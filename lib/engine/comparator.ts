import { 
  EnvironmentRunResponse, 
  EnvironmentRunResult, 
  ComparisonDiffItem, 
  DifferenceClassification, 
  AnalysisSummary, 
  AnalysisResponse 
} from '../types';

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) return false;

  if (typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false;

    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false;
      }
      return true;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}

function generateReproducibleSnippet(scenarioId: string, testCase: { label: string; input: any }): string {
  const inputStr = JSON.stringify(testCase.input, null, 2);
  return `// ShadowBump AI - Reproducible Reproduction Snippet
// Scenario: ${scenarioId}
// Test Case: ${testCase.label}

import { z as z3 } from "zod-v3"; // 3.23.8
import { z as z4 } from "zod-v4"; // 4.6.7

const testInput = ${inputStr};

// Run against Zod v3
const resultV3 = schemaV3.safeParse(testInput);
console.log("v3 outcome:", resultV3.success ? resultV3.data : resultV3.error?.issues);

// Run against Zod v4
const resultV4 = schemaV4.safeParse(testInput);
console.log("v4 outcome:", resultV4.success ? resultV4.data : resultV4.error?.issues);
`;
}

export function compareRuns(
  scenarioId: string,
  scenarioTitle: string,
  oldRun: EnvironmentRunResponse,
  newRun: EnvironmentRunResponse
): AnalysisResponse {
  const diffItems: ComparisonDiffItem[] = [];

  let matchCount = 0;
  let behavioralDiffCount = 0;
  let potentialRegressionCount = 0;
  let executionErrorCount = 0;

  const totalInputs = Math.max(oldRun.results.length, newRun.results.length);

  for (let i = 0; i < totalInputs; i++) {
    const oldItem: EnvironmentRunResult = oldRun.results[i] || {
      id: `missing-old-${i}`,
      label: `Missing Old #${i}`,
      input: null,
      success: false,
      output: null,
      issues: [],
      legacyProperties: { hasErrorsProp: false, errorsCount: 0 },
      durationMs: 0,
      error: null
    };

    const newItem: EnvironmentRunResult = newRun.results[i] || {
      id: `missing-new-${i}`,
      label: `Missing New #${i}`,
      input: null,
      success: false,
      output: null,
      issues: [],
      legacyProperties: { hasErrorsProp: false, errorsCount: 0 },
      durationMs: 0,
      error: null
    };

    const reasons: string[] = [];
    let classification: DifferenceClassification = 'MATCH';
    let summary = 'Behavior matches identically across both versions.';

    // Check for execution-level crashes or thrown unhandled exceptions
    if (oldItem.thrownException || newItem.thrownException || oldRun.status === 'error' || newRun.status === 'error') {
      classification = 'EXECUTION_ERROR';
      executionErrorCount++;
      if (oldItem.thrownException) reasons.push(`Old environment threw: ${oldItem.thrownException.message}`);
      if (newItem.thrownException) reasons.push(`New environment threw: ${newItem.thrownException.message}`);
      summary = 'Execution terminated abnormally in one or both environments.';
    } else {
      // 1. Success status difference (One succeeded, the other failed)
      if (oldItem.success !== newItem.success) {
        classification = 'POTENTIAL_REGRESSION';
        reasons.push(
          `Validation status changed: Old version produced success=${oldItem.success}, whereas New version produced success=${newItem.success}.`
        );
      }

      // 2. Output data difference on success
      if (oldItem.success && newItem.success) {
        if (!deepEqual(oldItem.output, newItem.output)) {
          classification = 'BEHAVIORAL_DIFFERENCE';
          reasons.push('Parsed output object data structures or normalized values differ.');
        }
      }

      // 3. Issue messages and error format difference
      if (!oldItem.success && !newItem.success) {
        // Compare issue messages
        const oldMessages = (oldItem.issues || []).map(iss => iss.message).filter((m): m is string => Boolean(m));
        const newMessages = (newItem.issues || []).map(iss => iss.message).filter((m): m is string => Boolean(m));

        if (!deepEqual(oldMessages, newMessages)) {
          // If a custom error message was supplied in old but replaced with default generic in new, it's a potential regression
          const oldHasCustom = oldMessages.some(m => !m.startsWith('Invalid input:') && !m.startsWith('Expected'));
          const newLostCustom = newMessages.some(m => m.startsWith('Invalid input:'));

          if (oldHasCustom && newLostCustom) {
            classification = 'POTENTIAL_REGRESSION';
            reasons.push(
              `Custom error message contract dropped: Old version returned "${oldMessages.join(', ')}", while New version reverted to default generic "${newMessages.join(', ')}".`
            );
          } else {
            classification = 'BEHAVIORAL_DIFFERENCE';
            reasons.push(
              `Error message phrasing changed from "${oldMessages.join('; ')}" to "${newMessages.join('; ')}".`
            );
          }
        }

        // Compare issue codes or received types
        const oldCodes = (oldItem.issues || []).map(iss => `${iss.code}:${iss.received}`);
        const newCodes = (newItem.issues || []).map(iss => `${iss.code}:${iss.received}`);
        if (!deepEqual(oldCodes, newCodes)) {
          if (classification === 'MATCH') classification = 'BEHAVIORAL_DIFFERENCE';
          reasons.push(
            `Issue categorization or received type identification differs (Old: [${oldCodes.join(', ')}] vs New: [${newCodes.join(', ')}]).`
          );
        }
      }

      // 4. Interface compatibility: Check for removed properties (e.g., error.errors)
      if (oldItem.legacyProperties?.hasErrorsProp === true && newItem.legacyProperties?.hasErrorsProp === false) {
        classification = 'POTENTIAL_REGRESSION';
        reasons.push(
          'Breaking API property access: `error.errors` was defined in Old version but is undefined in New version (migrated to `error.issues`). Code accessing `.errors` will throw TypeError.'
        );
      }

      // 5. Oracle check: If an expected outcome was defined
      if (oldItem.expectedOutcome) {
        const expected = oldItem.expectedOutcome;
        const newMatchesExpected = (expected === 'VALID' && newItem.success) || (expected === 'INVALID' && !newItem.success);
        if (!newMatchesExpected && classification !== 'POTENTIAL_REGRESSION') {
          classification = 'POTENTIAL_REGRESSION';
          reasons.push(`New version output violated the explicit oracle expectation of ${expected}.`);
        }
      }

      // Update counters & summary
      if (classification === 'MATCH') {
        matchCount++;
      } else if (classification === 'POTENTIAL_REGRESSION') {
        potentialRegressionCount++;
        summary = `Potential regression detected: ${reasons[0] || 'Violates previous behavioral contract.'}`;
      } else if (classification === 'BEHAVIORAL_DIFFERENCE') {
        behavioralDiffCount++;
        summary = `Observable behavioral difference detected: ${reasons[0] || 'Outputs or error details differ.'}`;
      }
    }

    diffItems.push({
      id: oldItem.id || `diff-${i}`,
      label: oldItem.label || `Test Case #${i + 1}`,
      input: oldItem.input,
      classification,
      summary,
      reasons,
      oldResult: oldItem,
      newResult: newItem,
      reproducibleSnippet: generateReproducibleSnippet(scenarioId, oldItem)
    });
  }

  const summary: AnalysisSummary = {
    scenarioId,
    scenarioTitle,
    dependencyName: 'zod',
    oldVersion: oldRun.version || '3.23.8',
    newVersion: newRun.version || '4.6.7',
    totalInputs,
    matches: matchCount,
    behavioralDifferences: behavioralDiffCount,
    potentialRegressions: potentialRegressionCount,
    executionErrors: executionErrorCount,
    totalExecutionTimeMs: (oldRun.executionTimeMs || 0) + (newRun.executionTimeMs || 0),
    testedAt: new Date().toISOString()
  };

  return {
    summary,
    differences: diffItems,
    rawOldRun: oldRun,
    rawNewRun: newRun
  };
}
