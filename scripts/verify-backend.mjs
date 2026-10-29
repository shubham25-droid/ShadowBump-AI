// scripts/verify-backend.mjs
// Comprehensive automated backend verification script for ShadowBump AI

const BASE_URL = 'http://localhost:3000';

async function testBackend() {
  console.log('=====================================================');
  console.log('   SHADOWBUMP AI: BACKEND HEALTH & API VERIFICATION  ');
  console.log('=====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`✗ [FAIL] ${testName} - ${details}`);
    }
  }

  // 1. Test /api/health
  console.log('--- 1. Testing /api/health ---');
  try {
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    assert(healthRes.status === 200, 'GET /api/health returns 200 OK');
    const healthData = await healthRes.json();
    assert(healthData.status === 'healthy', 'Health status is "healthy"');
    assert(healthData.environments?.v3?.installed === true && healthData.environments?.v3?.runner === true, 'v3 sandbox environment installed and ready');
    assert(healthData.environments?.v4?.installed === true && healthData.environments?.v4?.runner === true, 'v4 sandbox environment installed and ready');
    console.log(`  Environment info: v3=${healthData.environments?.v3?.version}, v4=${healthData.environments?.v4?.version}`);
    console.log(`  AI Provider: ${healthData.aiProvider?.provider} (${healthData.aiProvider?.model})`);
  } catch (err) {
    assert(false, 'GET /api/health throws error', err.message);
  }

  // 2. Test /api/run-analysis for all scenarios
  console.log('\n--- 2. Testing /api/run-analysis across all 4 scenarios ---');
  const scenarioIds = [
    'custom-error-messages',
    'error-map-signature',
    'enum-value-coercion',
    'optional-vs-nullable'
  ];

  let sampleDiffItem = null;

  for (const scenarioId of scenarioIds) {
    try {
      const res = await fetch(`${BASE_URL}/api/run-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId })
      });

      assert(res.status === 200, `POST /api/run-analysis for '${scenarioId}' returns 200`);
      const data = await res.json();
      
      assert(typeof data.summary?.totalInputs === 'number' && data.summary.totalInputs > 0, `Executed test cases > 0 (${data.summary?.totalInputs})`);
      assert(Array.isArray(data.differences), 'Response contains differences array');
      assert(typeof data.summary?.matches === 'number', `Summary contains matches (${data.summary?.matches})`);
      assert(typeof data.summary?.potentialRegressions === 'number', `Summary contains potentialRegressions (${data.summary?.potentialRegressions})`);

      if (data.differences.length > 0 && !sampleDiffItem) {
        sampleDiffItem = data.differences.find(i => i.classification !== 'MATCH') || data.differences[0];
      }

      console.log(`  Scenario '${scenarioId}': Total=${data.summary.totalInputs}, Matches=${data.summary.matches}, Diffs=${data.summary.behavioralDifferences}, Regressions=${data.summary.potentialRegressions}`);
    } catch (err) {
      assert(false, `POST /api/run-analysis for '${scenarioId}' threw error`, err.message);
    }
  }

  // 3. Test /api/run-analysis with custom test payload
  console.log('\n--- 3. Testing /api/run-analysis with custom arbitrary input ---');
  try {
    const customPayload = {
      scenarioId: 'custom-error-messages',
      customTestCases: [
        {
          id: 'custom-vector-1',
          label: 'Custom test payload missing username',
          input: { email: 'dev@test.local', age: 35 }
        }
      ]
    };

    const res = await fetch(`${BASE_URL}/api/run-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customPayload)
    });

    assert(res.status === 200, 'POST /api/run-analysis with customTestCases returns 200');
    const data = await res.json();
    assert(data.summary?.totalInputs === 1, 'Executed exactly 1 custom test case');
    assert(data.differences.length === 1, 'Returned 1 differential comparison item');
    assert(data.differences[0].classification === 'POTENTIAL_REGRESSION', 'Successfully detected breaking change on custom input');
    console.log(`  Custom test case verdict: ${data.differences[0].classification}`);
  } catch (err) {
    assert(false, 'POST /api/run-analysis with custom inputs threw error', err.message);
  }

  // 4. Test /api/explain-diff
  console.log('\n--- 4. Testing /api/explain-diff (NVIDIA Nemotron / Nebius Handler) ---');
  if (sampleDiffItem) {
    try {
      const res = await fetch(`${BASE_URL}/api/explain-diff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: 'custom-error-messages',
          diffItem: sampleDiffItem
        })
      });

      assert(res.status === 200, 'POST /api/explain-diff returns 200');
      const explainData = await res.json();
      assert(explainData.status !== undefined, `AI explanation status defined: ${explainData.status}`);
      assert(explainData.summary !== undefined && explainData.summary.length > 0, 'Explanation includes concise summary');
      assert(explainData.rootCause !== undefined && explainData.rootCause.length > 0, 'Explanation includes rootCause');
      assert(explainData.riskLevel !== undefined, `Risk level defined: ${explainData.riskLevel}`);
      console.log(`  AI Explanation Status: ${explainData.status}`);
      console.log(`  Risk Level: ${explainData.riskLevel}`);
      console.log(`  Summary: ${explainData.summary}`);
    } catch (err) {
      assert(false, 'POST /api/explain-diff threw error', err.message);
    }
  } else {
    console.log('Skipping explain-diff: No diff item available');
  }

  // 5. Test invalid requests / error handling
  console.log('\n--- 5. Testing API Error Handling ---');
  try {
    const res = await fetch(`${BASE_URL}/api/explain-diff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert(res.status === 400, 'POST /api/explain-diff without diffItem returns 400 Bad Request');
  } catch (err) {
    assert(false, 'Error handling test threw error', err.message);
  }

  console.log('\n=====================================================');
  console.log(`  TEST RESULTS: ${passedTests}/${totalTests} PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
  console.log('=====================================================\n');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

testBackend();
