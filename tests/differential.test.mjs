import assert from 'node:assert';

async function runTests() {
  console.log('Running ShadowBump AI Differential Test Suite...');

  // Test 1: Health Check
  const healthRes = await fetch('http://localhost:3000/api/health');
  assert.strictEqual(healthRes.status, 200, 'Health endpoint must return 200');
  const healthData = await healthRes.json();
  assert.strictEqual(healthData.status, 'healthy');
  assert.strictEqual(healthData.environments.v3.installed, true, 'v3 runner must be installed');
  assert.strictEqual(healthData.environments.v4.installed, true, 'v4 runner must be installed');

  // Test 2: Differential Execution
  const analysisRes = await fetch('http://localhost:3000/api/run-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenarioId: 'user-registration-form' })
  });
  assert.strictEqual(analysisRes.status, 200, 'Analysis API must return 200');
  const analysisData = await analysisRes.json();

  assert(analysisData.summary.totalInputs > 0, 'Must test inputs');
  assert(analysisData.summary.matches > 0, 'Must identify identical matches');
  assert(analysisData.summary.potentialRegressions > 0, 'Must detect verified behavioral regressions');

  console.log('✓ All 4 validation assertions passed successfully!');
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
