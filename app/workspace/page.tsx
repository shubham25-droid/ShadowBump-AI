'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SCENARIOS } from '@/lib/engine/scenarios';
import { TestCase, ScenarioDefinition } from '@/lib/types';
import { 
  Play, 
  Layers, 
  Code, 
  Terminal, 
  CheckCircle2, 
  Cpu, 
  Plus, 
  Trash2, 
  RefreshCw,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  FileCode2
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
  const [envStatus, setEnvStatus] = useState<any>(null);

  const activeScenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

  useEffect(() => {
    // When scenario changes, load its default test cases
    const scenario = SCENARIOS.find(s => s.id === selectedScenarioId);
    if (scenario) {
      setTestCases(scenario.testCases);
    }
  }, [selectedScenarioId]);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setEnvStatus(data))
      .catch(() => setEnvStatus(null));
  }, []);

  const handleAddCustomTestCase = () => {
    setInputError(null);
    if (!customInputJson.trim()) {
      setInputError('Please provide a valid JSON input vector.');
      return;
    }

    try {
      const parsed = JSON.parse(customInputJson);
      const newTestCase: TestCase = {
        id: `custom-${Date.now().toString().slice(-4)}`,
        label: customInputLabel.trim() || `Custom Vector #${testCases.length + 1}`,
        description: 'User-defined test vector',
        input: parsed,
        expectedOutcome: undefined
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

  const handleResetTestCases = () => {
    setTestCases(activeScenario.testCases);
  };

  const handleRunAnalysis = async () => {
    setIsRunning(true);
    setCurrentStep('Initializing twin isolated runner environments...');

    try {
      setTimeout(() => setCurrentStep('Streaming test vectors across zod@3.23.8 and zod@4.6.7...'), 400);
      setTimeout(() => setCurrentStep('Executing deterministic comparison engine...'), 800);

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
      
      // Store result in sessionStorage for display on results view
      sessionStorage.setItem('shadowbump_latest_result', JSON.stringify(result));
      sessionStorage.setItem('shadowbump_active_scenario', JSON.stringify(activeScenario));

      setCurrentStep('Analysis complete! Redirecting to Evidence Inspector...');
      setTimeout(() => {
        router.push('/results');
      }, 500);
    } catch (err: any) {
      alert(`Execution error: ${err.message}`);
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Environment Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">
              Execution Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            Differential Analysis Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure target dependency versions, select schema test suites, and execute twin-environment verification.
          </p>
        </div>

        {/* Runtime Environment Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-surface-card">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Baseline Sandbox:</span>
            <span className="text-emerald-300 font-bold">zod@3.23.8</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-surface-card">
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            <span className="text-slate-400">Candidate Sandbox:</span>
            <span className="text-violet-300 font-bold">zod@4.6.7</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Scenario & Configuration */}
        <div className="lg:col-span-1 space-y-6">
          {/* Scenario Selector */}
          <div className="rounded-xl border border-surface-border bg-surface-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-sky-400" />
                Select Scenario
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {SCENARIOS.length} Available
              </span>
            </div>

            <div className="space-y-2">
              {SCENARIOS.map((sc) => {
                const isSelected = sc.id === selectedScenarioId;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setSelectedScenarioId(sc.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                      isSelected
                        ? 'border-sky-500/50 bg-sky-950/20 text-slate-100 shadow-sm'
                        : 'border-slate-800/80 bg-surface-200/40 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold ${isSelected ? 'text-sky-300' : 'text-slate-200'}`}>
                        {sc.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block line-clamp-2">
                      {sc.description}
                    </span>
                    <div className="mt-2 text-[10px] font-mono text-slate-400">
                      Category: <span className="text-slate-300">{sc.breakingCategory}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schema Code Preview */}
          <div className="rounded-xl border border-surface-border bg-surface-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileCode2 className="h-4 w-4 text-emerald-400" />
                Target Schema Definition
              </span>
              <span className="text-[10px] font-mono text-slate-400">TypeScript</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-300 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-56">
              <pre>{activeScenario.codeSnippet}</pre>
            </div>
          </div>
        </div>

        {/* Right Column: Test Corpus & Execution */}
        <div className="lg:col-span-2 space-y-6">
          {/* Test Corpus Header */}
          <div className="rounded-xl border border-surface-border bg-surface-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Synchronized Test Corpus
                </h3>
                <p className="text-xs text-slate-400">
                  These identical inputs will be delivered concurrently into both Zod v3 and Zod v4 child runners.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetTestCases}
                className="text-xs text-slate-400 hover:text-slate-200 font-mono flex items-center gap-1"
                title="Reset to scenario defaults"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset Default Vectors</span>
              </button>
            </div>

            {/* Test Case Cards */}
            <div className="space-y-2.5">
              {testCases.map((tc, index) => (
                <div
                  key={tc.id}
                  className="p-3 rounded-lg border border-slate-800 bg-surface-200/50 flex items-start justify-between gap-4 text-xs"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sky-400 font-bold">
                        #{index + 1}
                      </span>
                      <span className="font-semibold text-slate-200">
                        {tc.label}
                      </span>
                      {tc.expectedOutcome && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-slate-700 bg-slate-800 text-slate-400">
                          Oracle: {tc.expectedOutcome}
                        </span>
                      )}
                    </div>
                    {tc.description && (
                      <p className="text-[11px] text-slate-400">
                        {tc.description}
                      </p>
                    )}
                    <div className="mt-1 p-2 rounded bg-surface-300 border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-24">
                      <pre>{JSON.stringify(tc.input)}</pre>
                    </div>
                  </div>

                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTestCase(tc.id)}
                      className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                      title="Remove this test vector"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Custom Vector Adder */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 text-sky-400" />
                Inject Custom Test Vector
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Vector Label (e.g. Edge Case Empty Object)"
                  value={customInputLabel}
                  onChange={(e) => setCustomInputLabel(e.target.value)}
                  className="sm:col-span-1 px-3 py-2 rounded-lg bg-surface-300 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
                <input
                  type="text"
                  placeholder='JSON Payload (e.g. {"username": "", "age": 20})'
                  value={customInputJson}
                  onChange={(e) => setCustomInputJson(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 rounded-lg bg-surface-300 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              {inputError && (
                <div className="flex items-center space-x-1.5 text-xs text-rose-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{inputError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddCustomTestCase}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition-colors"
              >
                Add Vector to Corpus
              </button>
            </div>
          </div>

          {/* Launch Action Card */}
          <div className="rounded-xl border border-sky-500/30 bg-surface-card p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Ready to Execute Differential Run
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Spawns parallel sandboxes, captures output structures, and computes AST diffs.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isRunning}
                className={`inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all shadow-md ${
                  isRunning
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
                }`}
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Executing Sandboxes...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    <span>Start Differential Analysis ({testCases.length} Vectors)</span>
                  </>
                )}
              </button>
            </div>

            {/* Execution step progress bar */}
            {isRunning && (
              <div className="p-3 rounded-lg bg-slate-900 border border-sky-500/30 font-mono text-xs text-sky-300 flex items-center space-x-2 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span>{currentStep}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
