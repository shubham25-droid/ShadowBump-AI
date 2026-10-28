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
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';

export default function ResultsPage() {
  const router = useRouter();
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | DifferenceClassification>('ALL');
  const [selectedDiffItem, setSelectedDiffItem] = useState<ComparisonDiffItem | null>(null);
  const [aiExplanation, setAiExplanation] = useState<AIExplanationResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isLoadingDefault, setIsLoadingDefault] = useState<boolean>(false);

  useEffect(() => {
    const storedResult = sessionStorage.getItem('shadowbump_latest_result');

    if (storedResult) {
      try {
        const parsed: AnalysisResponse = JSON.parse(storedResult);
        setAnalysisData(parsed);

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
        throw new Error(`AI request error: ${res.status}`);
      }

      const explanation: AIExplanationResult = await res.json();
      setAiExplanation(explanation);
    } catch (err: any) {
      setAiExplanation({
        status: 'ERROR',
        modelUsed: 'nvidia/Llama-3.1-Nemotron-70B-Instruct-HF',
        provider: 'Nebius Token Factory',
        timestamp: new Date().toISOString(),
        summary: 'Nebius API request was not completed.',
        rootCause: err.message,
        riskLevel: 'MEDIUM',
        blastRadius: 'Unable to evaluate remotely.',
        recommendedFix: 'Review the deterministic side-by-side diff.'
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
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <RefreshCw className="h-8 w-8 text-zinc-400 animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-white">
          Executing Differential Comparison...
        </h2>
        <p className="text-sm text-zinc-400">
          Running twin Node.js subprocesses for <code className="text-emerald-400 font-mono">zod@3.23.8</code> vs <code className="text-rose-400 font-mono">zod@4.6.7</code> in parallel.
        </p>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">
          No Active Analysis Session Found
        </h2>
        <p className="text-sm text-zinc-400">
          Return to workspace to execute a verified dependency migration scenario.
        </p>
        <Link
          href="/workspace"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-bold shadow-sm"
        >
          <span>Open Analysis Workspace</span>
        </Link>
      </div>
    );
  }

  const { summary, differences } = analysisData;

  // Determine Overall Result State (Section 7A)
  const getOverallState = () => {
    if (summary.executionErrors > 0) {
      return {
        label: 'Inconclusive Execution (Subprocess Crash)',
        description: 'One or more execution environments failed or timed out during the differential run.',
        border: 'border-zinc-700',
        bg: 'bg-zinc-850',
        textColor: 'text-zinc-200',
        badgeBg: 'bg-zinc-800 text-zinc-300'
      };
    }
    if (summary.potentialRegressions > 0) {
      return {
        label: 'Potential Regression Detected (Silent Contract Break)',
        description: `${summary.potentialRegressions} input vector(s) broke existing behavioral contracts, altered exception interfaces, or dropped custom error messages.`,
        border: 'border-rose-500/35',
        bg: 'bg-gradient-to-r from-rose-950/20 via-zinc-850 to-zinc-900',
        textColor: 'text-rose-300',
        badgeBg: 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
      };
    }
    if (summary.behavioralDifferences > 0) {
      return {
        label: 'Behavioral Difference Detected (Observable Mutation)',
        description: `${summary.behavioralDifferences} input vector(s) produced observable output differences without confirmed regression.`,
        border: 'border-amber-500/35',
        bg: 'bg-gradient-to-r from-amber-950/20 via-zinc-850 to-zinc-900',
        textColor: 'text-amber-300',
        badgeBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
      };
    }
    return {
      label: 'No Difference Observed in Tested Inputs',
      description: `All ${summary.totalInputs} test inputs produced identical outputs across both versions. Note: Does not prove equivalence on untested inputs.`,
      border: 'border-emerald-500/35',
      bg: 'bg-gradient-to-r from-emerald-950/20 via-zinc-850 to-zinc-900',
      textColor: 'text-emerald-300',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
    };
  };

  const overallState = getOverallState();

  const filteredDifferences = differences.filter(d => {
    if (selectedFilter === 'ALL') return true;
    return d.classification === selectedFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-zinc-750 gap-4">
        <div>
          <Link
            href="/workspace"
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-zinc-400 hover:text-white mb-2 font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Workspace</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {summary.scenarioTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-300 mt-1.5">
            <span>Dependency: <strong className="text-white font-bold">{summary.dependencyName}</strong></span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{summary.oldVersion} (Baseline)</span>
            <span>➔</span>
            <span className="text-rose-400 font-semibold">{summary.newVersion} (Candidate)</span>
          </div>
        </div>

        <button
          type="button"
          onClick={runDefaultAnalysis}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-750 text-xs font-mono text-zinc-200 transition-colors shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5 text-zinc-400" />
          <span>Re-execute Sandboxes</span>
        </button>
      </div>

      {/* A. Overall Result State Banner */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${overallState.border} ${overallState.bg} shadow-card`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${overallState.badgeBg}`}>
                VERDICT
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {overallState.label}
              </h2>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {overallState.description}
            </p>
          </div>
          <div className="text-xs font-mono text-zinc-400 whitespace-nowrap">
            {summary.totalInputs} vectors tested ({summary.totalExecutionTimeMs}ms total)
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <MetricCard
          label="Total Inputs"
          value={summary.totalInputs}
          subtext="Concurrently executed"
          icon={Layers}
          variant="brand"
        />
        <MetricCard
          label="Identical Matches"
          value={summary.matches}
          subtext="Equivalent output"
          icon={CheckCircle2}
          variant="match"
        />
        <MetricCard
          label="Differences"
          value={summary.behavioralDifferences}
          subtext="Observable mutations"
          icon={AlertTriangle}
          variant="diff"
        />
        <MetricCard
          label="Regressions"
          value={summary.potentialRegressions}
          subtext="Contract breaks"
          icon={XCircle}
          variant="regression"
        />
        <MetricCard
          label="Execution Time"
          value={`${summary.totalExecutionTimeMs}ms`}
          subtext="Twin sandboxes"
          icon={Clock}
          variant="neutral"
        />
      </div>

      {/* Main Grid: Evidence Diff List (7 cols) & AI Explanation (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Evidence (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-zinc-750 gap-2">
            <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">
              Empirical Evidence ({filteredDifferences.length})
            </span>

            <div className="flex items-center space-x-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setSelectedFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedFilter === 'ALL'
                    ? 'bg-zinc-800 text-white border border-zinc-650 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({differences.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('POTENTIAL_REGRESSION')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedFilter === 'POTENTIAL_REGRESSION'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/35 font-bold'
                    : 'text-zinc-400 hover:text-rose-400'
                }`}
              >
                Regressions ({summary.potentialRegressions})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('MATCH')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedFilter === 'MATCH'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 font-bold'
                    : 'text-zinc-400 hover:text-emerald-400'
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
                <div key={item.id} className="space-y-2">
                  <DiffViewer
                    item={item}
                    scenarioTitle={summary.scenarioTitle}
                  />

                  {item.classification !== 'MATCH' && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSelectDiffForAi(item)}
                        className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all flex items-center space-x-2 ${
                          isSelectedForAi
                            ? 'bg-zinc-800 border-zinc-400 text-white font-bold shadow-sm'
                            : 'border-zinc-750 bg-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-600'
                        }`}
                      >
                        <Cpu className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{isSelectedForAi ? 'Analyzed by NVIDIA AI' : 'Explain with NVIDIA Nemotron'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Synthesis & Developer Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="sticky top-20 space-y-5">
            <AIExplanationCard
              explanation={aiExplanation}
              isLoading={isAiLoading}
              onRefresh={selectedDiffItem ? () => fetchAiExplanation(selectedDiffItem) : undefined}
            />

            {/* Developer Checklist */}
            <div className="rounded-2xl border border-zinc-750 bg-[#161821]/95 p-5 shadow-card space-y-3">
              <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Developer Remediation Checklist
              </span>
              <ul className="space-y-2 text-xs text-zinc-300 leading-relaxed">
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-zinc-400 font-bold">1.</span>
                  <span>Migrate any <code className="text-rose-400 font-mono">error.errors</code> property access to <code className="text-emerald-400 font-mono">error.issues</code> across repository.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-zinc-400 font-bold">2.</span>
                  <span>Replace deprecated <code className="font-mono text-amber-300">{`{ required_error }`}</code> with modern Zod v4 custom error functions.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-zinc-400 font-bold">3.</span>
                  <span>Run reproduction code snippet locally in terminal to verify regression remediation before merging.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
