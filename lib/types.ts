export type DifferenceClassification = 
  | 'MATCH' 
  | 'BEHAVIORAL_DIFFERENCE' 
  | 'POTENTIAL_REGRESSION' 
  | 'EXECUTION_ERROR';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TestCase {
  id: string;
  label: string;
  input: any;
  description?: string;
  expectedOutcome?: 'VALID' | 'INVALID' | 'SPECIFIC_ERROR';
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  description: string;
  dependencyName: string;
  oldVersion: string;
  newVersion: string;
  breakingCategory: string;
  codeSnippet: string;
  testCases: TestCase[];
}

export interface IssueDetail {
  code?: string;
  message?: string;
  path?: (string | number)[];
  expected?: string;
  received?: string;
}

export interface EnvironmentRunResult {
  id: string;
  label: string;
  input: any;
  expectedOutcome?: string | null;
  success: boolean;
  output: any;
  issues: IssueDetail[];
  legacyProperties: {
    hasErrorsProp: boolean | null;
    errorsCount: number;
  };
  durationMs: number;
  error: {
    name: string;
    message: string;
    formattedString?: string;
  } | null;
  thrownException?: {
    name: string;
    message: string;
    stack?: string | null;
  };
}

export interface EnvironmentRunResponse {
  status: 'success' | 'error';
  environment: 'v3' | 'v4';
  version: string;
  executionTimeMs: number;
  resultsCount: number;
  results: EnvironmentRunResult[];
  message?: string;
}

export interface ComparisonDiffItem {
  id: string;
  label: string;
  input: any;
  classification: DifferenceClassification;
  summary: string;
  reasons: string[];
  oldResult: EnvironmentRunResult;
  newResult: EnvironmentRunResult;
  reproducibleSnippet: string;
  aiExplanation?: AIExplanationResult | null;
}

export interface AnalysisSummary {
  scenarioId: string;
  scenarioTitle: string;
  dependencyName: string;
  oldVersion: string;
  newVersion: string;
  totalInputs: number;
  matches: number;
  behavioralDifferences: number;
  potentialRegressions: number;
  executionErrors: number;
  totalExecutionTimeMs: number;
  testedAt: string;
}

export interface AnalysisResponse {
  summary: AnalysisSummary;
  differences: ComparisonDiffItem[];
  rawOldRun: EnvironmentRunResponse;
  rawNewRun: EnvironmentRunResponse;
}

export interface AIExplanationResult {
  status: 'SUCCESS' | 'UNAVAILABLE' | 'ERROR';
  modelUsed: string;
  provider: string;
  timestamp: string;
  summary: string;
  rootCause: string;
  riskLevel: RiskLevel;
  blastRadius: string;
  recommendedFix: string;
  codeDiff?: {
    before: string;
    after: string;
  };
  rawModelResponse?: string;
  errorNotice?: string;
}
