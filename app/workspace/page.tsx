'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SCENARIOS } from '@/lib/engine/scenarios';
import { TestCase } from '@/lib/types';
import { 
  Play, 
  Trash2, 
  RefreshCw,
  AlertCircle,
  FileCode2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function WorkspacePage() {
  const router = useRouter();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[0].id);
  const [testCases, setTestCases] = useState<TestCase[]>(SCENARIOS[0].testCases);
  const [customInputJson, setCustomInputJson] = useState<string>('');
  const [customInputLabel, setCustomInputLabel] = useState<string>('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>('');

  const activeScenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

  useEffect(() => {
    const scenario = SCENARIOS.find(s => s.id === selectedScenarioId);
    if (scenario) {
      setTestCases(scenario.testCases);
    }
  }, [selectedScenarioId]);

  const handleAddCustomTestCase = () => {
    setInputError(null);
    if (!customInputJson.trim()) {
      setInputError('Please enter a valid JSON object.');
      return;
    }

    try {
      const parsed = JSON.parse(customInputJson);
      const newTestCase: TestCase = {
        id: `custom-${Date.now().toString().slice(-4)}`,
        label: customInputLabel.trim() || `Custom Vector #${testCases.length + 1}`,
        description: 'User-defined test input',
        input: parsed,
      };

      setTestCases([...testCases, newTestCase]);
      setCustomInputJson('');
      setCustomInputLabel('');
    } catch (e: any) {
      setInputError(`Invalid JSON syntax: ${e.message}`);
    }
  };

  const handleRemoveTestCase = (id: string) => {
    setTestCases(testCases.filter(tc => tc.id !== id));
  };

  const handleRunAnalysis = async () => {
    setIsRunning(true);
    setCurrentStep('Spawning isolated Node.js v3 and v4 sandboxes...');

    try {
      setTimeout(() => setCurrentStep('Streaming test vectors across runtimes...'), 300);
      setTimeout(() => setCurrentStep('Evaluating deterministic AST diffs...'), 650);

      const response = await fetch('/api/run-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: activeScenario.id,
          customTestCases: testCases
        })
      });

      if (!response.ok) {
        throw new Error(`Execution error: ${response.status}`);
      }

      const result = await response.json();
      sessionStorage.setItem('shadowbump_latest_result', JSON.stringify(result));
      sessionStorage.setItem('shadowbump_active_scenario', JSON.stringify(activeScenario));

      setCurrentStep('Analysis complete. Redirecting...');
      setTimeout(() => {
        router.push('/results');
      }, 350);
    } catch (err: any) {
      alert(`Execution error: ${err.message}`);
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-line gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-primary">
            Analysis Workspace
          </h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Configure target scenario, inspect schema, and execute twin-environment verification.
          </p>
        </div>

        {/* Dependency Badge */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded border border-line bg-panel text-ink-primary">
            Target: <strong>zod</strong>
          </span>
          <span className="px-2.5 py-1 rounded border border-status-success/30 bg-status-success-bg text-status-success font-semibold">
            v3.23.8 (Baseline)
          </span>
          <span className="text-ink-secondary">→</span>
          <span className="px-2.5 py-1 rounded border border-line bg-panel text-accent font-semibold">
            v4.6.7 (Candidate)
          </span>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-ink-secondary block mb-2">
          Step 1: Select Verified Test Scenario
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          {SCENARIOS.map((sc) => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setSelectedScenarioId(sc.id)}
                className={`text-left p-3 rounded border text-xs transition-colors ${
                  isSelected
                    ? 'border-accent bg-panel text-ink-primary shadow-xs ring-1 ring-accent'
                    : 'border-line bg-panel hover:bg-background text-ink-secondary'
                }`}
              >
                <div className={`font-bold leading-tight ${isSelected ? 'text-accent' : 'text-ink-primary'}`}>
                  {sc.title}
                </div>
                <div className="text-[11px] text-ink-secondary font-mono truncate mt-1">
                  {sc.breakingCategory}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Schema (5 cols) & Inputs (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Target Schema */}
        <div className="lg:col-span-5 rounded border border-line bg-panel p-4 shadow-panel space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <span className="text-xs font-bold text-ink-primary uppercase tracking-wider flex items-center gap-1.5">
              <FileCode2 className="h-3.5 w-3.5 text-accent" />
              Target Schema Definition
            </span>
            <span className="text-[10px] font-mono text-ink-secondary">TypeScript</span>
          </div>

          <div className="p-3 rounded border border-line bg-background font-mono text-xs text-ink-primary overflow-x-auto max-h-72">
            <pre>{activeScenario.codeSnippet}</pre>
          </div>

          <p className="text-xs text-ink-secondary leading-relaxed">
            {activeScenario.description}
          </p>
        </div>

        {/* Right: Test Inputs */}
        <div className="lg:col-span-7 rounded border border-line bg-panel p-4 shadow-panel space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <div>
              <span className="text-xs font-bold text-ink-primary uppercase tracking-wider">
                Step 2: Synchronized Test Corpus ({testCases.length})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setTestCases(activeScenario.testCases)}
              className="text-xs text-accent hover:text-accent-hover font-medium"
            >
              Reset Defaults
            </button>
          </div>

          {/* Test Case List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {testCases.map((tc, idx) => (
              <div
                key={tc.id}
                className="p-2.5 rounded border border-line bg-background flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-accent font-bold text-[11px]">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-ink-primary">
                      {tc.label}
                    </span>
                    {tc.expectedOutcome && (
                      <span className="text-[10px] font-mono px-1.5 rounded border border-line bg-panel text-ink-secondary">
                        Oracle: {tc.expectedOutcome}
                      </span>
                    )}
                  </div>
                  <div className="p-1.5 rounded bg-panel border border-line font-mono text-[11px] text-ink-primary overflow-x-auto">
                    <pre>{JSON.stringify(tc.input)}</pre>
                  </div>
                </div>

                {testCases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTestCase(tc.id)}
                    className="text-ink-muted hover:text-status-error p-1 transition-colors"
                    title="Remove vector"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Vector Inline */}
          <div className="pt-2 border-t border-line space-y-2">
            <span className="text-[11px] font-bold text-ink-secondary uppercase tracking-wider block">
              + Add Custom Test Input
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Label"
                value={customInputLabel}
                onChange={(e) => setCustomInputLabel(e.target.value)}
                className="px-2.5 py-1.5 rounded border border-line text-xs bg-background text-ink-primary focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder='JSON: {"username": "alex"}'
                value={customInputJson}
                onChange={(e) => setCustomInputJson(e.target.value)}
                className="sm:col-span-2 px-2.5 py-1.5 rounded border border-line text-xs font-mono bg-background text-ink-primary focus:outline-none focus:border-accent"
              />
            </div>

            {inputError && (
              <div className="text-xs text-status-error font-medium">
                {inputError}
              </div>
            )}

            <button
              type="button"
              onClick={handleAddCustomTestCase}
              className="px-3 py-1 rounded border border-line bg-panel hover:bg-background text-xs text-ink-primary font-medium"
            >
              Add Input
            </button>
          </div>
        </div>
      </div>

      {/* Execution Control Action Bar */}
      <div className="rounded border border-line bg-panel p-4 shadow-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-ink-primary block">
            Step 3: Execute Differential Run
          </span>
          <p className="text-xs text-ink-secondary">
            Executes {testCases.length} identical inputs across isolated zod@3.23.8 and zod@4.6.7 runners.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={isRunning}
          className={`inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded text-xs font-bold transition-colors ${
            isRunning
              ? 'bg-line text-ink-muted cursor-not-allowed'
              : 'bg-accent hover:bg-accent-hover text-white'
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>{currentStep || 'Executing Sandboxes...'}</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Run Differential Analysis ({testCases.length})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
