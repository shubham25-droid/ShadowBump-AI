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
  ArrowRight,
  Plus,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Zap,
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
      setInputError('Please enter a valid JSON payload string.');
      return;
    }

    try {
      const parsed = JSON.parse(customInputJson);
      const newTestCase: TestCase = {
        id: `custom-${Date.now().toString().slice(-4)}`,
        label: customInputLabel.trim() || `Custom Vector #${testCases.length + 1}`,
        description: 'User-defined test input payload',
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
      setTimeout(() => setCurrentStep('Streaming synchronized test vectors across runtimes...'), 300);
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

      setCurrentStep('Analysis complete. Generating differential view...');
      setTimeout(() => {
        router.push('/results');
      }, 400);
    } catch (err: any) {
      alert(`Execution error: ${err.message}`);
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/80 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Isolated Runtime Harness</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Differential Test Workspace
          </h1>
          <p className="text-base text-slate-300 mt-1 max-w-2xl">
            Select a verified dependency migration scenario, customize test vectors, and execute twin Node.js subprocesses.
          </p>
        </div>

        {/* Runtime Target Pill */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <div className="px-3.5 py-1.5 rounded-xl border border-border bg-panel shadow-sm">
            <span className="text-slate-400">Package:</span> <strong className="text-cyan-400 font-bold">zod</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-semibold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>v3.23.8 (Baseline)</span>
          </div>
          <span className="text-slate-500 font-bold">➔</span>
          <div className="px-3 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/30 text-indigo-300 font-semibold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            <span>v4.6.7 (Candidate)</span>
          </div>
        </div>
      </div>

      {/* Step 1: Scenario Selector Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
              1
            </span>
            <span>Select Target Dependency Migration Scenario</span>
          </label>
          <span className="text-xs font-mono text-slate-400">4 Scenarios Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {SCENARIOS.map((sc, index) => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setSelectedScenarioId(sc.id)}
                className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-500 bg-gradient-to-b from-cyan-950/40 via-panel to-panel shadow-glow ring-1 ring-cyan-500/50'
                    : 'border-border/80 bg-panel/70 hover:bg-panel hover:border-slate-600 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-canvas text-slate-400'
                    }`}>
                      0{index + 1}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 truncate ml-2">
                      {sc.testCases.length} inputs
                    </span>
                  </div>
                  <div className={`font-bold text-sm leading-snug ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {sc.title}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border/80">
                  <span className={`text-xs font-mono block truncate ${isSelected ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}>
                    {sc.breakingCategory}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Main Grid: Schema Definition (5 cols) & Test Inputs (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Target Schema Code */}
        <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-panel/80 p-5 shadow-panel space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-border/80">
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <FileCode2 className="h-4 w-4 text-cyan-400" />
                Target Schema Definition
              </span>
              <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30">
                TypeScript / Zod
              </span>
            </div>

            {/* Code Window */}
            <div className="rounded-xl border border-border bg-[#05070c] overflow-hidden shadow-inner">
              <div className="flex items-center space-x-1.5 px-3 py-2 bg-canvas/90 border-b border-border/80 text-xs font-mono text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-[11px] text-slate-400">schema.ts</span>
              </div>
              <pre className="p-4 font-mono text-xs text-cyan-300 overflow-x-auto max-h-80 leading-relaxed">
                <code>{activeScenario.codeSnippet}</code>
              </pre>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-canvas/70 text-xs text-slate-300 leading-relaxed space-y-1">
            <span className="font-bold text-white block">Observed Behavioral Context:</span>
            <p>{activeScenario.description}</p>
          </div>
        </div>

        {/* Right: Test Inputs Corpus */}
        <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-panel/80 p-5 shadow-panel space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/80">
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span>Step 2: Synchronized Test Corpus</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs">
                  {testCases.length} Vectors
                </span>
              </span>
              <button
                type="button"
                onClick={() => setTestCases(activeScenario.testCases)}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Reset Default Vectors
              </button>
            </div>

            {/* Test Case Cards List */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {testCases.map((tc, idx) => (
                <div
                  key={tc.id}
                  className="p-3.5 rounded-xl border border-border/80 bg-[#05070c] hover:border-cyan-500/40 transition-colors flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 text-xs">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-white text-sm">
                        {tc.label}
                      </span>
                      {tc.expectedOutcome && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-canvas border border-border text-slate-300">
                          Oracle: {tc.expectedOutcome}
                        </span>
                      )}
                    </div>
                    <div className="p-2 rounded-lg bg-panel border border-border/80 font-mono text-xs text-slate-200 overflow-x-auto">
                      <code>{JSON.stringify(tc.input)}</code>
                    </div>
                  </div>

                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTestCase(tc.id)}
                      className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/30 transition-colors"
                      title="Remove vector"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Vector Inline Section */}
          <div className="pt-3 border-t border-border/80 space-y-2.5">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
              + Inject Custom Test Vector
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                placeholder="Vector Label (e.g. Empty Payload)"
                value={customInputLabel}
                onChange={(e) => setCustomInputLabel(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-[#05070c] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              <input
                type="text"
                placeholder='JSON: {"email": "user@corp.io"}'
                value={customInputJson}
                onChange={(e) => setCustomInputJson(e.target.value)}
                className="sm:col-span-2 px-3 py-2 rounded-xl border border-border bg-[#05070c] font-mono text-xs text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {inputError && (
              <div className="text-xs text-rose-400 font-mono font-medium flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{inputError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddCustomTestCase}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-canvas hover:bg-panel text-xs text-slate-200 font-semibold hover:border-cyan-500/40 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Vector to Test Corpus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 3: Execution Control Action Bar */}
      <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-panel via-canvas to-panel p-6 shadow-glow flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
              3
            </span>
            <span className="text-base font-bold text-white">
              Launch Differential Execution Harness
            </span>
          </div>
          <p className="text-sm text-slate-300">
            Forks clean Node.js processes for <code className="text-emerald-400 font-mono">zod@3.23.8</code> and <code className="text-indigo-400 font-mono">zod@4.6.7</code>, streams all {testCases.length} inputs, and generates AST diffs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={isRunning}
          className={`inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-xl text-base font-bold transition-all shadow-glow ${
            isRunning
              ? 'bg-border text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white hover:shadow-[0_0_35px_rgba(56,189,248,0.5)] transform hover:-translate-y-0.5'
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin text-cyan-300" />
              <span>{currentStep || 'Executing Twin Sandboxes...'}</span>
            </>
          ) : (
            <>
              <Play className="h-5 w-5 fill-current" />
              <span>Run Analysis ({testCases.length} Vectors)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
