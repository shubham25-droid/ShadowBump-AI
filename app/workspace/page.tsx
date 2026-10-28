'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SCENARIOS } from '@/lib/engine/scenarios';
import { TestCase } from '@/lib/types';
import { 
  Play, 
  Layers, 
  Plus, 
  Trash2, 
  RefreshCw,
  AlertCircle,
  FileCode2,
  CheckCircle2,
  ShieldCheck
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
        description: 'User-provided vector',
        input: parsed,
      };

      setTestCases([...testCases, newTestCase]);
      setCustomInputJson('');
      setCustomInputLabel('');
    } catch (e: any) {
      setInputError(`Invalid JSON: ${e.message}`);
    }
  };

  const handleRemoveTestCase = (id: string) => {
    setTestCases(testCases.filter(tc => tc.id !== id));
  };

  const handleRunAnalysis = async () => {
    setIsRunning(true);
    setCurrentStep('Spawning isolated v3 and v4 sandboxes...');

    try {
      setTimeout(() => setCurrentStep('Streaming test vectors through both runtimes...'), 350);
      setTimeout(() => setCurrentStep('Computing deterministic AST diffs...'), 700);

      const response = await fetch('/api/run-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: activeScenario.id,
          customTestCases: testCases
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis run failed with status ${response.status}`);
      }

      const result = await response.json();
      sessionStorage.setItem('shadowbump_latest_result', JSON.stringify(result));
      sessionStorage.setItem('shadowbump_active_scenario', JSON.stringify(activeScenario));

      setCurrentStep('Complete! Loading results view...');
      setTimeout(() => {
        router.push('/results');
      }, 400);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Analysis Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare behavior between baseline (<code className="font-mono text-emerald-700">zod@3.23.8</code>) and candidate (<code className="font-mono text-violet-700">zod@4.6.7</code>).
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 font-medium">
            ● Baseline: v3.23.8
          </span>
          <span className="px-2.5 py-1 rounded-full border border-violet-200 bg-violet-50 text-violet-700 font-medium">
            ● Candidate: v4.6.7
          </span>
        </div>
      </div>

      {/* Scenario Pill Tabs */}
      <div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Choose Test Scenario:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {SCENARIOS.map((sc) => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setSelectedScenarioId(sc.id)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-sky-50 border-sky-400 text-sky-900 shadow-xs ring-1 ring-sky-300'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="text-xs font-bold leading-tight mb-1">
                  {sc.title}
                </div>
                <div className="text-[11px] text-slate-500 font-mono truncate">
                  {sc.breakingCategory}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Schema (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode2 className="h-4 w-4 text-sky-600" />
                Target Schema Definition
              </span>
              <span className="text-[10px] font-mono text-slate-400">TypeScript</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 font-mono text-xs text-slate-200 overflow-x-auto max-h-72">
              <pre>{activeScenario.codeSnippet}</pre>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              {activeScenario.description}
            </p>
          </div>
        </div>

        {/* Right Column: Test Corpus & Run (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Test Vectors Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Synchronized Test Inputs ({testCases.length})
              </span>
              <button
                type="button"
                onClick={() => setTestCases(activeScenario.testCases)}
                className="text-xs text-sky-600 hover:text-sky-800 font-medium"
              >
                Reset Default Vectors
              </button>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {testCases.map((tc, idx) => (
                <div
                  key={tc.id}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono text-sky-600 font-bold text-[11px]">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 text-xs">
                        {tc.label}
                      </span>
                      {tc.expectedOutcome && (
                        <span className="text-[10px] font-mono px-1.5 rounded bg-white border border-slate-200 text-slate-600">
                          Oracle: {tc.expectedOutcome}
                        </span>
                      )}
                    </div>
                    <div className="p-1.5 rounded bg-white border border-slate-200 font-mono text-[11px] text-slate-700 overflow-x-auto">
                      <pre>{JSON.stringify(tc.input)}</pre>
                    </div>
                  </div>

                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTestCase(tc.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove vector"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Inject Custom Vector */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                + Add Custom Vector:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Label"
                  value={customInputLabel}
                  onChange={(e) => setCustomInputLabel(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-sky-500"
                />
                <input
                  type="text"
                  placeholder='JSON (e.g. {"username": "bob"})'
                  value={customInputJson}
                  onChange={(e) => setCustomInputJson(e.target.value)}
                  className="sm:col-span-2 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono bg-white text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              {inputError && (
                <div className="text-xs text-rose-600 font-medium">
                  {inputError}
                </div>
              )}

              <button
                type="button"
                onClick={handleAddCustomTestCase}
                className="px-3 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 font-semibold"
              >
                Add Vector
              </button>
            </div>
          </div>

          {/* Start Button */}
          <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/60 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Execute Twin-Runtime Comparison
                </h4>
                <p className="text-xs text-slate-500">
                  Runs {testCases.length} identical inputs across v3 and v4 sandboxes.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isRunning}
                className={`inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                  isRunning
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-sky-600 hover:bg-sky-700 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Run Comparison ({testCases.length})</span>
                  </>
                )}
              </button>
            </div>

            {isRunning && (
              <div className="p-2.5 rounded-lg bg-white border border-sky-200 font-mono text-xs text-sky-800 flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                <span>{currentStep}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
