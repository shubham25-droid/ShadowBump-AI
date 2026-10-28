'use client';

import React from 'react';
import { AIExplanationResult, RiskLevel } from '@/lib/types';
import { 
  Sparkles, 
  Cpu, 
  AlertCircle, 
  ShieldAlert, 
  FileCode, 
  RefreshCw
} from 'lucide-react';

interface AIExplanationCardProps {
  explanation: AIExplanationResult | null;
  isLoading: boolean;
  onRefresh?: () => void;
}

export default function AIExplanationCard({ explanation, isLoading, onRefresh }: AIExplanationCardProps) {
  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">LOW RISK</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">MEDIUM RISK</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">HIGH RISK</span>;
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-600 text-white animate-pulse">CRITICAL RISK</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-xs">
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 animate-spin">
            <RefreshCw className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Querying NVIDIA Nemotron via Nebius...
            </h4>
            <p className="text-[11px] text-slate-500">
              Evaluating empirical diff evidence
            </p>
          </div>
        </div>
        <div className="space-y-2 animate-pulse">
          <div className="h-3.5 bg-slate-100 rounded w-3/4" />
          <div className="h-3.5 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
        <Cpu className="h-7 w-7 text-slate-400 mx-auto mb-2" />
        <h4 className="text-xs font-bold text-slate-800">
          NVIDIA AI Analysis
        </h4>
        <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
          Select any detected difference to generate an evidence-grounded root cause explanation.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sky-200 bg-white overflow-hidden shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-sky-50/60 border-b border-sky-100">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-600 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-bold text-slate-900">
                NVIDIA Nemotron Analysis
              </h4>
              {getRiskBadge(explanation.riskLevel)}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Nebius Token Factory • {explanation.modelUsed}
            </div>
          </div>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center space-x-1 px-2 py-1 text-[11px] font-mono rounded border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Re-run</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* Notice if deterministic mode */}
        {explanation.status !== 'SUCCESS' && (
          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <span className="font-bold block mb-0.5">
                  Deterministic Fallback Mode
                </span>
                <p className="text-[11px] leading-relaxed text-amber-900">
                  {explanation.errorNotice || explanation.rootCause}
                </p>
                <span className="block mt-1 font-mono text-[10px] text-amber-700">
                  To enable live NVIDIA Nemotron inference, add NEBIUS_API_KEY in .env.local.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Summary:
          </span>
          <p className="text-slate-800 leading-relaxed font-medium">
            {explanation.summary}
          </p>
        </div>

        {/* Technical Root Cause */}
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
          <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block flex items-center gap-1">
            <Cpu className="h-3 w-3 text-sky-600" />
            Root Cause:
          </span>
          <p className="text-slate-700 leading-relaxed">
            {explanation.rootCause}
          </p>
        </div>

        {/* Suggested Migration Code Diff */}
        {explanation.codeDiff && (
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <FileCode className="h-3.5 w-3.5 text-emerald-600" />
              Migration Code Fix (v3 → v4)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/70">
                <span className="text-rose-700 font-bold block mb-1">// Old (v3)</span>
                <pre className="text-rose-900 whitespace-pre-wrap">{explanation.codeDiff.before}</pre>
              </div>
              <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/70">
                <span className="text-emerald-700 font-bold block mb-1">// Fixed for (v4)</span>
                <pre className="text-emerald-900 whitespace-pre-wrap">{explanation.codeDiff.after}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Action Plan */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-700 block mb-0.5">
            Recommended Action:
          </span>
          <p className="text-slate-600 leading-relaxed">
            {explanation.recommendedFix}
          </p>
        </div>
      </div>
    </div>
  );
}
