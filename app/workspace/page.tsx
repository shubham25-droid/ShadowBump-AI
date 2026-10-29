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
      }, 350);
    } catch (err: any) {
      alert(`Execution error: ${err.message}`);
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-7">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-line gap-3">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white">
            Analysis Workspace
          </h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Configure target scenario, inspect schema, and execute twin-environment verification.
          </p>
        </div>

        {/* Runtime Target Pill */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded border border-line bg-card text-white">
            Target: <strong>zod</strong>
          </span>
          <span className="px-2.5 py-1 rounded border border-status-success/30 bg-status-successBg text-status-success font-semibold">
            v3.23.8 (Baseline)
          </span>
          <span className="text-ink-secondary">→</span>
          <span className="px-2.5 py-1 rounded border border-status-error/30 bg-status-errorBg text-status-error font-semibold">
            v4.6.7 (Candidate)
          </span>
        </div>
      </div>

      {/* Step 1: Scenario Selector Tabs */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-tech block">
          Step 1: Select Verified Test Scenario
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SCENARIOS.map((sc) => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setSelectedScenarioId(sc.id)}
                className={`text-left p-3.5 rounded-card border transition-colors ${
                  isSelected
                    ? 'border-accent bg-card text-white shadow-glowBlue ring-1 ring-accent'
                    : 'border-line bg-card hover:bg-hero text-ink-secondary'
                }`}
              >
                <div className={`font-heading font-bold text-xs leading-snug ${isSelected ? 'text-tech' : 'text-white'}`}>
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

      {/* Step 2: Main Grid: Schema Definition (5 cols) & Test Inputs (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Target Schema Code */}
        <div className="lg:col-span-5 rounded-card border border-line bg-card p-4 shadow-card space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <span className="text-xs font-heading font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileCode2 className="h-3.5 w-3.5 text-tech" />
                Target Schema Definition
              </span>
              <span className="text-[11px] font-mono text-ink-secondary">TypeScript</span>
            </div>

            <div className="p-3 rounded border border-line bg-[#0a1826] font-mono text-xs text-tech overflow-x-auto max-h-72 leading-relaxed">
              <pre>{activeScenario.codeSnippet}</pre>
            </div>
          </div>

          <p className="text-xs text-ink-secondary leading-relaxed pt-2 border-t border-line">
            {activeScenario.description}
          </p>
        </div>

        {/* Right: Test Inputs Corpus */}
        <div className="lg:col-span-7 rounded-card border border-line bg-card p-4 shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                Step 2: Synchronized Test Corpus ({testCases.length})
              </span>
              <button
                type="button"
                onClick={() => setTestCases(activeScenario.testCases)}
                className="text-xs text-tech hover:text-white font-medium transition-colors"
              >
                Reset Defaults
              </button>
            </div>

            {/* Test Case Cards List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {testCases.map((tc, idx) => (
                <div
                  key={tc.id}
                  className="p-3 rounded border border-line bg-[#0a1826] flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-tech font-bold text-[11px]">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-white">
                        {tc.label}
                      </span>
                      {tc.expectedOutcome && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-line bg-card text-ink-secondary">
                          Oracle: {tc.expectedOutcome}
                        </span>
                      )}
                    </div>
                    <div className="p-2 rounded bg-card border border-line font-mono text-[11px] text-ink-primary overflow-x-auto">
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
          </div>

          {/* Add Vector Inline Section */}
          <div className="pt-2 border-t border-line space-y-2">
            <span className="text-[11px] font-mono font-bold text-ink-secondary uppercase tracking-wider block">
              + Add Custom Test Input
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Label"
                value={customInputLabel}
                onChange={(e) => setCustomInputLabel(e.target.value)}
                className="px-2.5 py-1.5 rounded border border-line text-xs bg-[#0a1826] text-white focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder='JSON: {"username": "alex"}'
                value={customInputJson}
                onChange={(e) => setCustomInputJson(e.target.value)}
                className="sm:col-span-2 px-2.5 py-1.5 rounded border border-line text-xs font-mono bg-[#0a1826] text-tech focus:outline-none focus:border-accent"
              />
            </div>

            {inputError && (
              <div className="text-xs text-status-error font-medium flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{inputError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddCustomTestCase}
              className="px-3 py-1 rounded border border-line bg-card hover:bg-hero text-xs text-white font-medium transition-colors"
            >
              Add Input
            </button>
          </div>
        </div>
      </div>

      {/* Step 3: Execution Control Action Bar */}
      <div className="rounded-card border border-line bg-card p-4 sm:p-5 shadow-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-heading text-xs font-bold text-white block uppercase tracking-wider">
            Step 3: Execute Differential Run
          </span>
          <p className="text-xs text-ink-secondary mt-0.5">
            Executes {testCases.length} identical inputs across isolated <code className="text-status-success font-mono font-semibold">zod@3.23.8</code> and <code className="text-status-error font-mono font-semibold">zod@4.6.7</code> runners.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={isRunning}
          className={`inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-button text-xs font-bold transition-all shadow-glowBlue ${
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
