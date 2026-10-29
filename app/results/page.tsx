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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <RefreshCw className="h-6 w-6 text-accent animate-spin mx-auto" />
        <h2 className="font-heading text-sm font-bold text-ink-primary">
          Executing Differential Comparison...
        </h2>
        <p className="text-xs text-ink-secondary">
          Testing zod@3.23.8 vs zod@4.6.7 in parallel sandboxes.
        </p>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <AlertTriangle className="h-6 w-6 text-status-warning mx-auto" />
        <h2 className="font-heading text-sm font-bold text-ink-primary">
          No Active Analysis Session Found
        </h2>
        <Link
          href="/workspace"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-button bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-card"
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
        label: 'Inconclusive Execution',
        description: 'One or more execution environments failed or timed out during the differential run.',
        style: 'bg-hero border-line text-ink-primary',
        badge: 'bg-card border-line text-ink-secondary'
      };
    }
    if (summary.potentialRegressions > 0) {
      return {
        label: 'Potential Regression Detected',
        description: `${summary.potentialRegressions} input vector(s) broke existing behavioral contracts, dropped custom error options, or threw unexpected TypeErrors.`,
        style: 'bg-status-error-bg text-status-error border-status-error/30',
        badge: 'bg-status-error text-white'
      };
    }
    if (summary.behavioralDifferences > 0) {
      return {
        label: 'Behavioral Difference Detected',
        description: `${summary.behavioralDifferences} input vector(s) produced observable output differences without confirmed regression.`,
        style: 'bg-status-warning-bg text-status-warning border-status-warning/30',
        badge: 'bg-status-warning text-white'
      };
    }
    return {
      label: 'No Difference Observed in Tested Inputs',
      description: `All ${summary.totalInputs} test inputs produced identical outputs across both versions. Note: Does not establish full correctness on untested inputs.`,
      style: 'bg-status-success-bg text-status-success border-status-success/30',
      badge: 'bg-status-success text-white'
    };
  };

  const overallState = getOverallState();

  const filteredDifferences = differences.filter(d => {
    if (selectedFilter === 'ALL') return true;
    return d.classification === selectedFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-line gap-3">
        <div>
          <Link
            href="/workspace"
            className="inline-flex items-center space-x-1 text-xs text-ink-secondary hover:text-ink-primary mb-1.5 font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Workspace</span>
          </Link>

          <h1 className="font-heading text-xl sm:text-2xl font-bold text-ink-primary">
            {summary.scenarioTitle}
          </h1>

          <div className="flex items-center space-x-2 text-xs font-mono text-ink-secondary mt-0.5">
            <span>Dependency: <strong className="text-ink-primary">{summary.dependencyName}</strong></span>
            <span>•</span>
            <span className="text-status-success font-semibold">{summary.oldVersion}</span>
            <span>→</span>
            <span className="text-status-error font-semibold">{summary.newVersion}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={runDefaultAnalysis}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-button border border-line bg-card hover:bg-hero text-xs text-ink-primary font-medium shadow-card transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5 text-ink-secondary" />
          <span>Re-execute Sandboxes</span>
        </button>
      </div>

      {/* A. Overall Result State Banner */}
      <div className={`p-4 sm:p-5 rounded-card border ${overallState.style} shadow-card`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${overallState.badge}`}>
                VERDICT
              </span>
              <h2 className="font-heading text-base font-bold">
                {overallState.label}
              </h2>
            </div>
            <p className="text-xs opacity-90 mt-1 leading-relaxed">
              {overallState.description}
            </p>
          </div>
          <span className="text-xs font-mono opacity-80 whitespace-nowrap self-start sm:self-auto">
            {summary.totalInputs} inputs tested ({summary.totalExecutionTimeMs}ms)
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard
          label="Total Inputs"
          value={summary.totalInputs}
          subtext="Tested concurrently"
          icon={Layers}
          variant="brand"
        />
        <MetricCard
          label="Matches"
          value={summary.matches}
          subtext="Identical outcome"
          icon={CheckCircle2}
          variant="match"
        />
        <MetricCard
          label="Differences"
          value={summary.behavioralDifferences}
          subtext="Observable changes"
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

      {/* Main Grid: Evidence Diff List & AI Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Evidence (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Filter Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <span className="font-heading text-xs font-bold text-ink-primary uppercase tracking-wider">
              Empirical Evidence ({filteredDifferences.length})
            </span>

            <div className="flex items-center space-x-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedFilter('ALL')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedFilter === 'ALL'
                    ? 'bg-hero text-ink-primary font-bold border border-line'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                All ({differences.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('POTENTIAL_REGRESSION')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedFilter === 'POTENTIAL_REGRESSION'
                    ? 'bg-status-error-bg text-status-error font-bold border border-status-error/30'
                    : 'text-ink-secondary hover:text-status-error'
                }`}
              >
                Regressions ({summary.potentialRegressions})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('MATCH')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedFilter === 'MATCH'
                    ? 'bg-status-success-bg text-status-success font-bold border border-status-success/30'
                    : 'text-ink-secondary hover:text-status-success'
                }`}
              >
                Matches ({summary.matches})
              </button>
            </div>
          </div>

          {/* Diff Cards */}
          <div className="space-y-3">
            {filteredDifferences.map((item) => {
              const isSelectedForAi = selectedDiffItem?.id === item.id;
              return (
                <div key={item.id} className="space-y-1">
                  <DiffViewer
                    item={item}
                    scenarioTitle={summary.scenarioTitle}
                  />

                  {item.classification !== 'MATCH' && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSelectDiffForAi(item)}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded border transition-colors flex items-center space-x-1.5 ${
                          isSelectedForAi
                            ? 'bg-accent-subtle border-accent text-accent font-bold'
                            : 'border-line bg-card text-ink-secondary hover:text-ink-primary hover:bg-hero'
                        }`}
                      >
                        <Cpu className="h-3 w-3 text-accent" />
                        <span>{isSelectedForAi ? 'Selected for NVIDIA AI' : 'Explain with NVIDIA Nemotron'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Synthesis & Next Steps (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 space-y-4">
            <AIExplanationCard
              explanation={aiExplanation}
              isLoading={isAiLoading}
              onRefresh={selectedDiffItem ? () => fetchAiExplanation(selectedDiffItem) : undefined}
            />

            {/* Developer Checklist */}
            <div className="rounded-card border border-line bg-card p-4 sm:p-5 shadow-card space-y-2.5">
              <span className="font-heading text-xs font-bold text-ink-primary uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-status-success" />
                Developer Review Checklist
              </span>
              <ul className="space-y-2 text-xs text-ink-secondary">
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-accent font-bold">1.</span>
                  <span>Migrate any <code className="text-status-error font-mono font-semibold">error.errors</code> property access to <code className="text-status-success font-mono font-semibold">error.issues</code>.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-accent font-bold">2.</span>
                  <span>Replace <code className="font-mono text-status-warning font-semibold">required_error</code> with the unified error function callback in Zod v4.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-accent font-bold">3.</span>
                  <span>Run the generated reproduction code locally in your terminal to verify fixes.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
