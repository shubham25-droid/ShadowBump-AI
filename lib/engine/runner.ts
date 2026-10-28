import { spawn } from 'child_process';
import path from 'path';
import { EnvironmentRunResponse, TestCase } from '../types';

export interface ExecuteEnvironmentOptions {
  environment: 'v3' | 'v4';
  scenarioId: string;
  testCases: TestCase[];
  customSchema?: string;
  timeoutMs?: number;
}

export async function executeEnvironment(options: ExecuteEnvironmentOptions): Promise<EnvironmentRunResponse> {
  const { environment, scenarioId, testCases, customSchema, timeoutMs = 5000 } = options;
  const projectRoot = process.cwd();
  const envDir = path.resolve(projectRoot, 'environments', environment);
  const runnerScript = path.resolve(envDir, 'runner.cjs');

  return new Promise((resolve) => {
    const startTime = Date.now();

    // Isolated subprocess with minimal environment (no secrets passed down)
    const child = spawn(process.execPath, [runnerScript], {
      cwd: envDir,
      env: {
        NODE_ENV: 'test',
        PATH: process.env.PATH || ''
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdoutBuffer = '';
    let stderrBuffer = '';
    let hasExited = false;

    const timer = setTimeout(() => {
      if (!hasExited) {
        hasExited = true;
        child.kill('SIGKILL');
        resolve({
          status: 'error',
          environment,
          version: environment === 'v3' ? '3.23.8' : '4.6.7',
          executionTimeMs: Date.now() - startTime,
          resultsCount: 0,
          results: [],
          message: `Execution timed out after ${timeoutMs}ms in environment ${environment}`
        });
      }
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdoutBuffer += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderrBuffer += chunk.toString();
    });

    child.on('error', (err) => {
      if (!hasExited) {
        hasExited = true;
        clearTimeout(timer);
        resolve({
          status: 'error',
          environment,
          version: environment === 'v3' ? '3.23.8' : '4.6.7',
          executionTimeMs: Date.now() - startTime,
          resultsCount: 0,
          results: [],
          message: `Subprocess spawn error: ${err.message}`
        });
      }
    });

    child.on('close', (code) => {
      if (!hasExited) {
        hasExited = true;
        clearTimeout(timer);

        if (code !== 0 && !stdoutBuffer) {
          return resolve({
            status: 'error',
            environment,
            version: environment === 'v3' ? '3.23.8' : '4.6.7',
            executionTimeMs: Date.now() - startTime,
            resultsCount: 0,
            results: [],
            message: `Runner process exited with code ${code}: ${stderrBuffer || 'Unknown error'}`
          });
        }

        try {
          const parsed = JSON.parse(stdoutBuffer);
          resolve(parsed);
        } catch (parseError) {
          resolve({
            status: 'error',
            environment,
            version: environment === 'v3' ? '3.23.8' : '4.6.7',
            executionTimeMs: Date.now() - startTime,
            resultsCount: 0,
            results: [],
            message: `Failed to parse runner output: ${stdoutBuffer.slice(0, 300)} (stderr: ${stderrBuffer.slice(0, 300)})`
          });
        }
      }
    });

    // Write input payload safely
    const payload = {
      scenarioId,
      customSchema,
      testCases
    };

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}
