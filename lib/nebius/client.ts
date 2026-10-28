import { AIExplanationResult, ComparisonDiffItem, RiskLevel } from '../types';

export interface ExplainDiffParams {
  scenarioTitle: string;
  scenarioCodeSnippet?: string;
  diffItem: ComparisonDiffItem;
}

const DEFAULT_BASE_URL = 'https://api.tokenfactory.nebius.com/v1';
const DEFAULT_MODEL = 'nvidia/Llama-3.1-Nemotron-70B-Instruct-HF';

export async function explainDifferenceWithNebius(params: ExplainDiffParams): Promise<AIExplanationResult> {
  const { scenarioTitle, scenarioCodeSnippet, diffItem } = params;
  const apiKey = process.env.NEBIUS_API_KEY;
  const baseUrl = (process.env.NEBIUS_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
  const model = process.env.NEBIUS_MODEL || DEFAULT_MODEL;

  // If no API key is provided, report the limitation honestly without inventing results
  if (!apiKey || apiKey.trim() === '') {
    return {
      status: 'UNAVAILABLE',
      modelUsed: model,
      provider: 'Nebius Token Factory',
      timestamp: new Date().toISOString(),
      summary: 'AI root cause analysis paused: NEBIUS_API_KEY is not configured.',
      rootCause: 'Deterministic comparison completed successfully, but automated NVIDIA model explanation requires a valid Nebius Token Factory API key.',
      riskLevel: diffItem.classification === 'POTENTIAL_REGRESSION' ? 'HIGH' : 'MEDIUM',
      blastRadius: 'Depends on downstream code consumption of Zod error issues and property access.',
      recommendedFix: 'Set NEBIUS_API_KEY in your .env.local file to enable automated model synthesis, or review the deterministic AST diff below.',
      errorNotice: 'Missing NEBIUS_API_KEY environment variable. Grounded deterministic test evidence is preserved.'
    };
  }

  const endpoint = `${baseUrl}/chat/completions`;

  // Build the smallest useful evidence package grounded solely in empirical test execution
  const evidencePayload = {
    scenario: scenarioTitle,
    schemaReference: scenarioCodeSnippet || 'Standard Zod schema definition',
    testInput: diffItem.input,
    classification: diffItem.classification,
    detectedReasons: diffItem.reasons,
    oldVersion: {
      version: '3.23.8',
      success: diffItem.oldResult.success,
      output: diffItem.oldResult.output,
      issues: diffItem.oldResult.issues,
      legacyProperties: diffItem.oldResult.legacyProperties
    },
    newVersion: {
      version: '4.6.7',
      success: diffItem.newResult.success,
      output: diffItem.newResult.output,
      issues: diffItem.newResult.issues,
      legacyProperties: diffItem.newResult.legacyProperties
    }
  };

  const systemPrompt = `You are ShadowBump AI's Expert Dependency Engineer, powered by NVIDIA Nemotron on Nebius Token Factory.
Your job is to analyze empirical differential testing evidence between two dependency versions (Zod v3 vs Zod v4).
Strict Rules:
1. Ground your answer ONLY in the provided empirical test evidence. Do not invent non-existent issues or packages.
2. Distinguish an intentional API breaking change or behavioral difference from a true defect.
3. If an API property like 'error.errors' was removed or a custom error option like 'required_error' was dropped, clearly explain the exact migration path.
4. Output your analysis in valid JSON conforming to this structure:
{
  "summary": "Concise 1-2 sentence explanation of the behavioral difference",
  "rootCause": "Detailed technical root cause in the dependency rewrite (e.g. unified error parameter, ZodError interface change)",
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "blastRadius": "What parts of an application will break (e.g. form error toast displays, API response serializers)",
  "recommendedFix": "Concrete engineering instruction to resolve the issue",
  "codeDiff": {
    "before": "Original code snippet",
    "after": "Updated code snippet compliant with the new dependency"
  }
}`;

  const userPrompt = `Analyze the following empirical differential test result:
${JSON.stringify(evidencePayload, null, 2)}

Respond with the JSON object only.`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 1000
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        status: 'ERROR',
        modelUsed: model,
        provider: 'Nebius Token Factory',
        timestamp: new Date().toISOString(),
        summary: `Nebius API responded with HTTP ${response.status}`,
        rootCause: 'Failed to communicate with Nebius Token Factory endpoint.',
        riskLevel: 'MEDIUM',
        blastRadius: 'Unable to compute via AI model.',
        recommendedFix: 'Check that your NEBIUS_API_KEY has valid permissions and sufficient credits.',
        errorNotice: `Nebius API Error (${response.status}): ${errorText.slice(0, 300)}`
      };
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '';

    // Attempt to extract JSON from response (handling potential markdown code block wrappers)
    let parsedJson: any = null;
    try {
      const cleaned = rawContent.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
      parsedJson = JSON.parse(cleaned);
    } catch {
      // Fallback if model responded in free-form text
      parsedJson = {
        summary: rawContent.slice(0, 200),
        rootCause: rawContent,
        riskLevel: 'HIGH',
        blastRadius: 'Downstream consumers of validation outputs',
        recommendedFix: 'Consult the migration guide for the new dependency version.'
      };
    }

    const validRiskLevels: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const assignedRisk: RiskLevel = validRiskLevels.includes(parsedJson.riskLevel)
      ? parsedJson.riskLevel
      : 'HIGH';

    return {
      status: 'SUCCESS',
      modelUsed: model,
      provider: 'Nebius Token Factory (NVIDIA Open-Source)',
      timestamp: new Date().toISOString(),
      summary: parsedJson.summary || 'Behavioral difference analyzed by NVIDIA model.',
      rootCause: parsedJson.rootCause || 'Dependency breaking change identified.',
      riskLevel: assignedRisk,
      blastRadius: parsedJson.blastRadius || 'Unknown blast radius.',
      recommendedFix: parsedJson.recommendedFix || 'Update schema to compliant syntax.',
      codeDiff: parsedJson.codeDiff,
      rawModelResponse: rawContent
    };
  } catch (fetchError: any) {
    return {
      status: 'ERROR',
      modelUsed: model,
      provider: 'Nebius Token Factory',
      timestamp: new Date().toISOString(),
      summary: 'Network or timeout exception while contacting Nebius Token Factory.',
      rootCause: fetchError.name === 'AbortError' ? 'Nebius request timed out after 15 seconds.' : fetchError.message,
      riskLevel: 'MEDIUM',
      blastRadius: 'Indeterminate due to API communication failure.',
      recommendedFix: 'Verify network connectivity and Nebius endpoint URL in .env.local.',
      errorNotice: fetchError.message
    };
  }
}
