import { NextRequest, NextResponse } from 'next/server';
import { getScenarioById } from '@/lib/engine/scenarios';
import { explainDifferenceWithNebius } from '@/lib/nebius/client';
import { ComparisonDiffItem } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scenarioId, diffItem } = body as { scenarioId: string; diffItem: ComparisonDiffItem };

    if (!diffItem) {
      return NextResponse.json(
        { error: 'Missing diffItem in request payload' },
        { status: 400 }
      );
    }

    const scenario = getScenarioById(scenarioId);
    const explanation = await explainDifferenceWithNebius({
      scenarioTitle: scenario ? scenario.title : 'Custom Validation Schema',
      scenarioCodeSnippet: scenario ? scenario.codeSnippet : undefined,
      diffItem
    });

    return NextResponse.json(explanation);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'Failed to generate AI explanation',
        details: err.message
      },
      { status: 500 }
    );
  }
}
