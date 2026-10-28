const fs = require('fs');
const z = require('zod');

// Read input from stdin
let inputData = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  const startTime = Date.now();
  try {
    const payload = JSON.parse(inputData || '{}');
    const { scenarioId, customSchema, testCases } = payload;
    const version = require('zod/package.json').version;

    let schema;

    // Build schema based on scenario or custom schema
    if (scenarioId === 'user-registration-form') {
      schema = z.object({
        username: z.string({ required_error: "Username is required" }).min(3),
        email: z.string({ required_error: "Email is required", invalid_type_error: "Email must be a string" }).email("Invalid email format"),
        age: z.number({ required_error: "Age is required" }).min(18),
        newsletter: z.boolean().default(false)
      });
    } else if (scenarioId === 'error-format-accessor') {
      schema = z.object({
        apiKey: z.string({ required_error: "API key is required" }),
        retries: z.number({ invalid_type_error: "Retries must be numeric" }).min(0)
      });
    } else if (scenarioId === 'type-coercion-dates') {
      schema = z.object({
        timestamp: z.coerce.date(),
        count: z.number(),
        flag: z.coerce.boolean()
      });
    } else if (scenarioId === 'strict-record-mapping') {
      schema = z.record(z.number({ invalid_type_error: "Values must be numbers" }));
    } else {
      // Fallback simple schema
      schema = z.object({
        value: z.string({ required_error: "Value is required" })
      });
    }

    const results = (testCases || []).map((tc, idx) => {
      const tcStart = Date.now();
      try {
        const parseRes = schema.safeParse(tc.input);
        const issues = parseRes.success ? [] : (parseRes.error?.issues || []);
        
        // Inspect compatibility properties
        const errorObj = parseRes.error;
        const legacyErrorsAccess = errorObj ? (errorObj.errors !== undefined) : null;
        const legacyErrorsCount = errorObj?.errors?.length ?? 0;

        return {
          id: tc.id || `tc-${idx}`,
          label: tc.label || `Test Case #${idx + 1}`,
          input: tc.input,
          expectedOutcome: tc.expectedOutcome || null,
          success: parseRes.success,
          output: parseRes.success ? parseRes.data : null,
          issues: issues.map(i => ({
            code: i.code,
            message: i.message,
            path: i.path,
            expected: i.expected,
            received: i.received
          })),
          legacyProperties: {
            hasErrorsProp: legacyErrorsAccess,
            errorsCount: legacyErrorsCount
          },
          durationMs: Date.now() - tcStart,
          error: parseRes.success ? null : {
            name: parseRes.error.name,
            message: parseRes.error.message,
            formattedString: parseRes.error.toString()
          }
        };
      } catch (err) {
        return {
          id: tc.id || `tc-${idx}`,
          label: tc.label || `Test Case #${idx + 1}`,
          input: tc.input,
          expectedOutcome: tc.expectedOutcome || null,
          success: false,
          output: null,
          issues: [],
          legacyProperties: { hasErrorsProp: false, errorsCount: 0 },
          durationMs: Date.now() - tcStart,
          thrownException: {
            name: err.name,
            message: err.message,
            stack: err.stack ? err.stack.split('\n').slice(0, 3).join('\n') : null
          }
        };
      }
    });

    const outputPayload = {
      status: 'success',
      environment: 'v3',
      version: version,
      executionTimeMs: Date.now() - startTime,
      resultsCount: results.length,
      results: results
    };

    process.stdout.write(JSON.stringify(outputPayload));
    process.exit(0);
  } catch (globalErr) {
    const errorPayload = {
      status: 'error',
      environment: 'v3',
      message: globalErr.message,
      stack: globalErr.stack
    };
    process.stdout.write(JSON.stringify(errorPayload));
    process.exit(1);
  }
});
