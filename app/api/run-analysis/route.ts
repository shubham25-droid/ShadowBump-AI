import { NextRequest, NextResponse } from 'next/server';
import { getScenarioById, SCENARIOS } from '@/lib/engine/scenarios';
import { executeEnvironment } from '@/lib/engine/runner';
import { compareRuns } from '@/lib/engine/comparator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scenarioId, customTestCases } = body;

    const scenario = getScenarioById(scenarioId) || SCENARIOS[0];
    const testCasesToRun = Array.isArray(customTestCases) && customTestCases.length > 0 
      ? customTestCases 
      : scenario.testCases;

    // Run both isolated environments concurrently
    const [oldRun, newRun] = await Promise.all([
      executeEnvironment({
        environment: 'v3',
        scenarioId: scenario.id,
        testCases: testCasesToRun
      }),
      executeEnvironment({
        environment: 'v4',
        scenarioId: scenario.id,
        testCases: testCasesToRun
      })
    ]);

    // Perform deterministic differential comparison
    const comparison = compareRuns(scenario.id, scenario.title, oldRun, newRun);

    return NextResponse.json(comparison);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'Failed to execute differential comparison',
        details: err.message
      },
      { status: 500 }
    );
  }
}
