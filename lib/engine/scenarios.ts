import { ScenarioDefinition } from '../types';

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'user-registration-form',
    title: 'User Registration: Custom Error Map Deprecation',
    description: 'Compares form validation schemas using legacy custom error options (required_error / invalid_type_error) vs Zod v4 unified error syntax.',
    dependencyName: 'zod',
    oldVersion: '3.23.8',
    newVersion: '4.6.7',
    breakingCategory: 'Error Parameter Consolidation & Property Removal',
    codeSnippet: `// Schema defined by developer
const registrationSchema = z.object({
  username: z.string({ required_error: "Username is required" }).min(3),
  email: z.string({ 
    required_error: "Email is required", 
    invalid_type_error: "Email must be a string" 
  }).email("Invalid email format"),
  age: z.number({ required_error: "Age is required" }).min(18),
  newsletter: z.boolean().default(false)
});`,
    testCases: [
      {
        id: 'tc-reg-1',
        label: 'Valid Complete Submission',
        description: 'Typical valid user registration payload',
        input: {
          username: 'alex_dev',
          email: 'alex@company.org',
          age: 28,
          newsletter: true
        },
        expectedOutcome: 'VALID'
      },
      {
        id: 'tc-reg-2',
        label: 'Missing Required Username (Custom Error Expectation)',
        description: 'Input omits username; triggers custom required_error',
        input: {
          email: 'alex@company.org',
          age: 28
        },
        expectedOutcome: 'INVALID'
      },
      {
        id: 'tc-reg-3',
        label: 'Invalid Type for Email Field',
        description: 'Passes number instead of string; triggers invalid_type_error',
        input: {
          username: 'alex_dev',
          email: 998877,
          age: 28
        },
        expectedOutcome: 'INVALID'
      },
      {
        id: 'tc-reg-4',
        label: 'Underage User with Valid String Email',
        description: 'Valid types but fails minimum numeric constraint',
        input: {
          username: 'junior_coder',
          email: 'junior@school.edu',
          age: 15
        },
        expectedOutcome: 'INVALID'
      },
      {
        id: 'tc-reg-5',
        label: 'Omitted Default Boolean Field',
        description: 'Newsletter field omitted; tests .default(false) fallback',
        input: {
          username: 'alex_dev',
          email: 'alex@company.org',
          age: 30
        },
        expectedOutcome: 'VALID'
      }
    ]
  },
  {
    id: 'error-format-accessor',
    title: 'Downstream API Adapter: error.errors Property Removal',
    description: 'Detects code that depends on ZodError.errors property for formatting API JSON responses.',
    dependencyName: 'zod',
    oldVersion: '3.23.8',
    newVersion: '4.6.7',
    breakingCategory: 'ZodError Interface Breaking Change',
    codeSnippet: `// API Middleware Error Handler
function handleValidation(schema, payload) {
  const result = schema.safeParse(payload);
  if (!result.success) {
    // In Zod 3: result.error.errors is an Array
    // In Zod 4: result.error.errors is UNDEFINED! (Use .issues instead)
    return result.error.errors.map(err => err.message);
  }
  return result.data;
}`,
    testCases: [
      {
        id: 'tc-err-1',
        label: 'Valid API Config Payload',
        description: 'Payload matches schema expectations',
        input: {
          apiKey: 'demo-api-token-sample-9482',
          retries: 3
        },
        expectedOutcome: 'VALID'
      },
      {
        id: 'tc-err-2',
        label: 'Missing API Key Parameter',
        description: 'Fails validation; tests downstream access to error.errors',
        input: {
          retries: 5
        },
        expectedOutcome: 'INVALID'
      },
      {
        id: 'tc-err-3',
        label: 'Non-numeric Retry Count',
        description: 'Passes string instead of number for retries',
        input: {
          apiKey: 'demo-api-token-sample-9482',
          retries: 'unlimited'
        },
        expectedOutcome: 'INVALID'
      }
    ]
  },
  {
    id: 'type-coercion-dates',
    title: 'Coercion & Numeric Edge Cases: Date & NaN Normalization',
    description: 'Evaluates type coercion behavior on empty strings, date objects, and NaN number parsing.',
    dependencyName: 'zod',
    oldVersion: '3.23.8',
    newVersion: '4.6.7',
    breakingCategory: 'Parsing Error Phrasing & NaN Type Code Difference',
    codeSnippet: `// Ingestion Schema with Coercion
const eventSchema = z.object({
  timestamp: z.coerce.date(),
  count: z.number(),
  flag: z.coerce.boolean()
});`,
    testCases: [
      {
        id: 'tc-coerce-1',
        label: 'Standard Valid Timestamp & Number',
        description: 'Standard ISO 8601 string and integer count',
        input: {
          timestamp: '2026-10-28T12:00:00Z',
          count: 42,
          flag: 'true'
        },
        expectedOutcome: 'VALID'
      },
      {
        id: 'tc-coerce-2',
        label: 'Empty String Date Coercion',
        description: 'Passes empty string to z.coerce.date(); checks error message output',
        input: {
          timestamp: '',
          count: 10,
          flag: false
        },
        expectedOutcome: 'INVALID'
      },
      {
        id: 'tc-coerce-3',
        label: 'Explicit NaN Passed to z.number()',
        description: 'Passes NaN into number validator; compares "nan" vs "NaN" received identifier',
        input: {
          timestamp: '2026-10-28T12:00:00Z',
          count: NaN,
          flag: true
        },
        expectedOutcome: 'INVALID'
      },
      {
        id: 'tc-coerce-4',
        label: 'Falsy Boolean Coercion ("0")',
        description: 'Tests boolean coercion of string "0"',
        input: {
          timestamp: '2026-10-28T12:00:00Z',
          count: 100,
          flag: '0'
        },
        expectedOutcome: 'VALID'
      }
    ]
  },
  {
    id: 'strict-record-mapping',
    title: 'Record Dictionary Validation: Type Mismatch Reporting',
    description: 'Validates key-value record structures where values must satisfy numeric constraints.',
    dependencyName: 'zod',
    oldVersion: '3.23.8',
    newVersion: '4.6.7',
    breakingCategory: 'Record Validation Message Format',
    codeSnippet: `// Key-Value Metric Map
const metricsSchema = z.record(
  z.number({ invalid_type_error: "Values must be numbers" })
);`,
    testCases: [
      {
        id: 'tc-rec-1',
        label: 'Valid Metrics Dictionary',
        description: 'Object with purely numeric metrics',
        input: {
          cpu_usage: 45.2,
          memory_mb: 2048,
          active_workers: 8
        },
        expectedOutcome: 'VALID'
      },
      {
        id: 'tc-rec-2',
        label: 'String Metric Value',
        description: 'Passes string in dictionary value position',
        input: {
          cpu_usage: 45.2,
          memory_mb: '2GB'
        },
        expectedOutcome: 'INVALID'
      },
      {
        id: 'tc-rec-3',
        label: 'Empty Record Object',
        description: 'Passes empty dictionary {}',
        input: {},
        expectedOutcome: 'VALID'
      }
    ]
  }
];

export function getScenarioById(id: string): ScenarioDefinition | undefined {
  return SCENARIOS.find(s => s.id === id);
}
