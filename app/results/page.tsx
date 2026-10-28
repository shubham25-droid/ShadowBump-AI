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
import { BrandSymbol } from '@/components/BrandLogo';
import { 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Cpu, 
  ArrowLeft, 
  RefreshCw, 
  ShieldCheck,
  FileCode2
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
        recommendedFix: 'Verify network connection or NEBIUS_API_KEY in .env.local.'
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
        <BrandSymbol size={40} className="mx-auto animate-pulse" />
        <h2 className="text-base font-bold text-slate-800">
          Running Differential Analysis...
        </h2>
        <p className="text-xs text-slate-500">
          Testing zod@3.23.8 vs zod@4.6.7 in parallel sandboxes.
        </p>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <AlertTriangle className="h-7 w-7 text-amber-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800">
          No Active Session
        </h2>
        <Link
          href="/workspace"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold"
        >
          <span>Open Workspace</span>
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <Link
            href="/workspace"
            className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 mb-1.5 font-medium"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Workspace</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900">
            {summary.scenarioTitle}
          </h1>

          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mt-1">
            <span>Target: <strong className="text-slate-700">{summary.dependencyName}</strong></span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">{summary.oldVersion}</span>
            <span>→</span>
            <span className="text-violet-700 font-semibold">{summary.newVersion}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={runDefaultAnalysis}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700 font-medium transition-colors shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Re-run Analysis</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard
          label="Total Inputs"
          value={summary.totalInputs}
          subtext="Executed concurrently"
          icon={Layers}
          variant="brand"
        />
        <MetricCard
          label="Matches"
          value={summary.matches}
          subtext="Identical behavior"
          icon={CheckCircle2}
          variant="match"
        />
        <MetricCard
          label="Diffs"
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

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Evidence Diff List */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter Pills */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Differential Evidence
            </span>

            <div className="flex items-center space-x-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedFilter('ALL')}
                className={`px-2 py-0.5 rounded-md font-medium ${
                  selectedFilter === 'ALL'
                    ? 'bg-slate-200 text-slate-900 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({differences.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('POTENTIAL_REGRESSION')}
                className={`px-2 py-0.5 rounded-md font-medium ${
                  selectedFilter === 'POTENTIAL_REGRESSION'
                    ? 'bg-rose-100 text-rose-800 font-bold'
                    : 'text-slate-500 hover:text-rose-700'
                }`}
              >
                Regressions ({summary.potentialRegressions})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('MATCH')}
                className={`px-2 py-0.5 rounded-md font-medium ${
                  selectedFilter === 'MATCH'
                    ? 'bg-emerald-100 text-emerald-800 font-bold'
                    : 'text-slate-500 hover:text-emerald-700'
                }`}
              >
                Matches ({summary.matches})
              </button>
            </div>
          </div>

          {/* Cards */}
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
                        className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors flex items-center space-x-1 ${
                          isSelectedForAi
                            ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold'
                            : 'border-slate-200 bg-white text-slate-600 hover:text-sky-700 hover:bg-slate-50'
                        }`}
                      >
                        <Cpu className="h-3 w-3 text-sky-600" />
                        <span>{isSelectedForAi ? 'Selected for AI' : 'Explain with NVIDIA Nemotron'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): AI Explanation & Next Steps */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 space-y-4">
            <AIExplanationCard
              explanation={aiExplanation}
              isLoading={isAiLoading}
              onRefresh={selectedDiffItem ? () => fetchAiExplanation(selectedDiffItem) : undefined}
            />

            {/* Checklist */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Remediation Checklist
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-start space-x-1.5">
                  <span className="font-mono text-sky-600 font-bold">1.</span>
                  <span>Migrate any <code className="text-rose-700 bg-rose-50 px-1 rounded font-mono">error.errors</code> accesses to <code className="text-emerald-700 bg-emerald-50 px-1 rounded font-mono">error.issues</code>.</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <span className="font-mono text-sky-600 font-bold">2.</span>
                  <span>Replace <code className="text-amber-700 font-mono">required_error</code> with the unified <code className="text-emerald-700 font-mono">error</code> callback.</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <span className="font-mono text-sky-600 font-bold">3.</span>
                  <span>Run the generated reproduction snippet in your terminal to verify fixes.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
