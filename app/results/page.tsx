'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  AnalysisResponse, 
  ComparisonDiffItem, 
  AIExplanationResult,
  DifferenceClassification 
} from '@/lib/types';
import MetricCard from '@/components/MetricCard';
import DiffViewer from '@/components/DiffViewer';
import AIExplanationCard from '@/components/AIExplanationCard';
import { 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Cpu, 
  ArrowLeft, 
  RefreshCw, 
  FileText, 
  ShieldCheck,
  Code2,
  BookOpen
} from 'lucide-react';

export default function ResultsPage() {
  const router = useRouter();
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [activeScenario, setActiveScenario] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | DifferenceClassification>('ALL');
  const [selectedDiffItem, setSelectedDiffItem] = useState<ComparisonDiffItem | null>(null);
  const [aiExplanation, setAiExplanation] = useState<AIExplanationResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isLoadingDefault, setIsLoadingDefault] = useState<boolean>(false);

  useEffect(() => {
    // Attempt to read from sessionStorage
    const storedResult = sessionStorage.getItem('shadowbump_latest_result');
    const storedScenario = sessionStorage.getItem('shadowbump_active_scenario');

    if (storedResult) {
      try {
        const parsed: AnalysisResponse = JSON.parse(storedResult);
        setAnalysisData(parsed);
        if (storedScenario) setActiveScenario(JSON.parse(storedScenario));

        // Auto-select the first non-match difference or regression for AI explanation
        const candidate = parsed.differences.find(d => d.classification === 'POTENTIAL_REGRESSION') 
          || parsed.differences.find(d => d.classification === 'BEHAVIORAL_DIFFERENCE')
          || parsed.differences[0];

        if (candidate) {
          setSelectedDiffItem(candidate);
          fetchAiExplanation(candidate, parsed.summary.scenarioTitle);
        }
        return;
      } catch (e) {
        console.error('Failed to parse cached analysis result', e);
      }
    }

    // If nothing in session storage, run default demo automatically
    runDefaultAnalysis();
  }, []);

  const runDefaultAnalysis = async () => {
    setIsLoadingDefault(true);
    try {
      const res = await fetch('/api/run-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId: 'user-registration-form' })
      });
      const data: AnalysisResponse = await res.json();
      setAnalysisData(data);

      const candidate = data.differences.find(d => d.classification === 'POTENTIAL_REGRESSION') 
        || data.differences.find(d => d.classification === 'BEHAVIORAL_DIFFERENCE')
        || data.differences[0];

      if (candidate) {
        setSelectedDiffItem(candidate);
        fetchAiExplanation(candidate, data.summary.scenarioTitle);
      }
    } catch (e) {
      console.error('Failed to run default analysis', e);
    } finally {
      setIsLoadingDefault(false);
    }
  };

  const fetchAiExplanation = async (item: ComparisonDiffItem, title?: string) => {
    setIsAiLoading(true);
    setAiExplanation(null);

    try {
      const res = await fetch('/api/explain-diff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: analysisData?.summary.scenarioId || 'user-registration-form',
          diffItem: item
        })
      });

      if (!res.ok) {
        throw new Error(`AI explanation request failed with status ${res.status}`);
      }

      const explanation: AIExplanationResult = await res.json();
      setAiExplanation(explanation);
    } catch (err: any) {
      setAiExplanation({
        status: 'ERROR',
        modelUsed: 'nvidia/Llama-3.1-Nemotron-70B-Instruct-HF',
        provider: 'Nebius Token Factory',
        timestamp: new Date().toISOString(),
        summary: 'Failed to contact Nebius Token Factory.',
        rootCause: err.message,
        riskLevel: 'MEDIUM',
        blastRadius: 'Indeterminate',
        recommendedFix: 'Verify network connection or NEBIUS_API_KEY environment variable.'
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSelectDiffForAi = (item: ComparisonDiffItem) => {
    setSelectedDiffItem(item);
    fetchAiExplanation(item, analysisData?.summary.scenarioTitle);
  };

  if (isLoadingDefault) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <RefreshCw className="h-8 w-8 text-sky-400 animate-spin mx-auto" />
        <h2 className="text-lg font-bold text-slate-100">
          Running Live Twin Differential Verification...
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Executing identical test inputs through isolated zod@3.23.8 and zod@4.6.7 runners.
        </p>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-100">
          No Active Analysis Session
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Launch a differential analysis run from the workspace to generate evidence.
        </p>
        <Link
          href="/workspace"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
        >
          <span>Open Analysis Workspace</span>
        </Link>
      </div>
    );
  }

  const { summary, differences } = analysisData;

  const filteredDifferences = differences.filter(d => {
    if (selectedFilter === 'ALL') return true;
    return d.classification === selectedFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation & Scenario Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <Link
            href="/workspace"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Workspace</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">
              Empirical Findings Report
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            {summary.scenarioTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mt-2">
            <span>Target: <strong className="text-slate-200">{summary.dependencyName}</strong></span>
            <span>•</span>
            <span>Baseline: <strong className="text-emerald-400">{summary.oldVersion}</strong></span>
            <span>→</span>
            <span>Candidate: <strong className="text-violet-400">{summary.newVersion}</strong></span>
            <span>•</span>
            <span>Tested At: {new Date(summary.testedAt).toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={runDefaultAnalysis}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-surface-card hover:bg-slate-800 text-xs text-slate-300 font-mono transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Re-Execute Test</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Total Tested Inputs"
          value={summary.totalInputs}
          subtext="Identical Stdin Stream"
          icon={Layers}
          variant="brand"
        />
        <MetricCard
          label="Identical Matches"
          value={summary.matches}
          subtext="Zero Behavioral Drift"
          icon={CheckCircle2}
          variant="match"
        />
        <MetricCard
          label="Behavioral Diffs"
          value={summary.behavioralDifferences}
          subtext="Observable Change"
          icon={AlertTriangle}
          variant="diff"
        />
        <MetricCard
          label="Potential Regressions"
          value={summary.potentialRegressions}
          subtext="Contract or Oracle Break"
          icon={XCircle}
          variant="regression"
        />
        <MetricCard
          label="Execution Time"
          value={`${summary.totalExecutionTimeMs}ms`}
          subtext="Parallel Subprocesses"
          icon={Clock}
          variant="neutral"
        />
      </div>

      {/* Main Results Layout: Evidence Explorer + NVIDIA AI Explainer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Evidence Diff List */}
        <div className="lg:col-span-7 space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Differential Evidence Stream
            </span>

            <div className="flex items-center space-x-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedFilter('ALL')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedFilter === 'ALL'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({differences.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('POTENTIAL_REGRESSION')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedFilter === 'POTENTIAL_REGRESSION'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'text-slate-400 hover:text-rose-400'
                }`}
              >
                Regressions ({summary.potentialRegressions})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('BEHAVIORAL_DIFFERENCE')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedFilter === 'BEHAVIORAL_DIFFERENCE'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-amber-400'
                }`}
              >
                Diffs ({summary.behavioralDifferences})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('MATCH')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedFilter === 'MATCH'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-emerald-400'
                }`}
              >
                Matches ({summary.matches})
              </button>
            </div>
          </div>

          {/* Diff Cards */}
          <div className="space-y-4">
            {filteredDifferences.map((item) => {
              const isSelectedForAi = selectedDiffItem?.id === item.id;
              return (
                <div key={item.id} className="relative group">
                  <DiffViewer
                    item={item}
                    scenarioTitle={summary.scenarioTitle}
                  />

                  {/* Button to feed this exact case to NVIDIA AI */}
                  {item.classification !== 'MATCH' && (
                    <div className="mt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSelectDiffForAi(item)}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded border transition-colors flex items-center space-x-1.5 ${
                          isSelectedForAi
                            ? 'bg-sky-600/30 border-sky-500 text-sky-300'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-sky-300 hover:border-slate-700'
                        }`}
                      >
                        <Cpu className="h-3 w-3 text-sky-400" />
                        <span>{isSelectedForAi ? 'Currently Analyzed by AI' : 'Explain with NVIDIA Nemotron'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): NVIDIA AI Explainer & Recommended Next Steps */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Explanation Card */}
          <div className="sticky top-20 space-y-6">
            <AIExplanationCard
              explanation={aiExplanation}
              isLoading={isAiLoading}
              onRefresh={selectedDiffItem ? () => fetchAiExplanation(selectedDiffItem) : undefined}
            />

            {/* Suggested Next Steps for Developer Review */}
            <div className="rounded-xl border border-surface-border bg-surface-card p-5 space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Suggested Developer Action Checklist
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-sky-400 font-bold">1.</span>
                  <span>Examine AST changes in error structures before approving the dependency PR.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-sky-400 font-bold">2.</span>
                  <span>Migrate any <code className="text-rose-300 bg-rose-950/40 px-1 py-0.5 rounded font-mono">error.errors</code> accesses to <code className="text-emerald-300 bg-emerald-950/40 px-1 py-0.5 rounded font-mono">error.issues</code>.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-sky-400 font-bold">3.</span>
                  <span>Replace legacy <code className="font-mono text-amber-300">required_error</code> with the unified <code className="font-mono text-emerald-300">error</code> parameter.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-sky-400 font-bold">4.</span>
                  <span>Run the generated deterministic reproduction scripts locally to verify fixes.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
