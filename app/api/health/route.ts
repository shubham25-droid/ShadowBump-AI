import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const root = process.cwd();
  const v3PackagePath = path.resolve(root, 'environments', 'v3', 'node_modules', 'zod', 'package.json');
  const v4PackagePath = path.resolve(root, 'environments', 'v4', 'node_modules', 'zod', 'package.json');

  let v3Version = 'not-installed';
  let v4Version = 'not-installed';

  try {
    if (fs.existsSync(v3PackagePath)) {
      v3Version = JSON.parse(fs.readFileSync(v3PackagePath, 'utf8')).version;
    }
    if (fs.existsSync(v4PackagePath)) {
      v4Version = JSON.parse(fs.readFileSync(v4PackagePath, 'utf8')).version;
    }
  } catch (e) {
    // Ignore read error
  }

  const nebiusConfigured = Boolean(process.env.NEBIUS_API_KEY && process.env.NEBIUS_API_KEY.trim() !== '');

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environments: {
      v3: {
        installed: v3Version !== 'not-installed',
        version: v3Version,
        runner: fs.existsSync(path.resolve(root, 'environments', 'v3', 'runner.cjs'))
      },
      v4: {
        installed: v4Version !== 'not-installed',
        version: v4Version,
        runner: fs.existsSync(path.resolve(root, 'environments', 'v4', 'runner.cjs'))
      }
    },
    aiProvider: {
      provider: 'Nebius Token Factory',
      model: process.env.NEBIUS_MODEL || 'nvidia/Llama-3.1-Nemotron-70B-Instruct-HF',
      endpoint: process.env.NEBIUS_BASE_URL || 'https://api.tokenfactory.nebius.com/v1',
      isConfigured: nebiusConfigured
    }
  });
}
