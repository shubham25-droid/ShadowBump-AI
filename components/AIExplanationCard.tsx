'use client';

import React, { useState } from 'react';
import { AIExplanationResult, RiskLevel } from '@/lib/types';
import { 
  Sparkles, 
  Cpu, 
  AlertCircle, 
  ShieldAlert, 
  CheckCircle, 
  FileCode, 
  Info,
  ExternalLink,
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
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">LOW RISK</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">MEDIUM RISK</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">HIGH RISK</span>;
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-red-600/20 text-red-400 border border-red-500/40 animate-pulse">CRITICAL RISK</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-sky-500/30 bg-surface-card p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 animate-spin">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">
              Querying Nebius Token Factory...
            </h4>
            <p className="text-xs text-slate-400">
              Evaluating diff evidence via NVIDIA Llama-3.1-Nemotron-70B-Instruct-HF
            </p>
          </div>
        </div>
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-800 rounded w-1/2" />
          <div className="h-24 bg-slate-800/60 rounded" />
        </div>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="rounded-xl border border-surface-border bg-surface-card p-6 text-center">
        <Cpu className="h-8 w-8 text-slate-400 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-slate-300">
          AI Explanation Ready
        </h4>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Select any detected behavioral difference or regression above to trigger an evidence-grounded root cause analysis by NVIDIA Nemotron.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-sky-500/30 bg-surface-card overflow-hidden shadow-2xl">
      {/* AI Card Header */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-slate-900/90 border-b border-sky-500/20">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold text-slate-100">
                NVIDIA Nemotron Root Cause Analysis
              </h4>
              {getRiskBadge(explanation.riskLevel)}
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono mt-0.5">
              <span>Nebius Token Factory</span>
              <span>•</span>
              <span className="text-sky-300">{explanation.modelUsed}</span>
            </div>
          </div>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-mono rounded border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors mt-2 sm:mt-0"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Re-Analyze</span>
          </button>
        )}
      </div>

      {/* Main Body */}
      <div className="p-5 space-y-5 text-xs">
        {/* Error / Limitation Warning Banner */}
        {explanation.status !== 'SUCCESS' && (
          <div className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300">
            <div className="flex items-start space-x-2.5">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold block mb-0.5">
                  {explanation.status === 'UNAVAILABLE' ? 'API Configuration Notice' : 'Nebius Call Notice'}
                </span>
                <p className="text-amber-200/90 leading-relaxed">
                  {explanation.errorNotice || explanation.rootCause}
                </p>
                <div className="mt-2 text-[11px] font-mono text-amber-400/80">
                  Tip: Provide NEBIUS_API_KEY in .env.local to enable real-time inference with NVIDIA open-source models.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Executive Summary */}
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Executive Summary
          </span>
          <p className="text-slate-200 leading-relaxed font-sans text-sm">
            {explanation.summary}
          </p>
        </div>

        {/* Root Cause & Blast Radius Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-lg border border-slate-800 bg-surface-200">
            <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5" />
              Technical Root Cause
            </span>
            <p className="text-slate-300 leading-relaxed">
              {explanation.rootCause}
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-800 bg-surface-200">
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              Production Blast Radius
            </span>
            <p className="text-slate-300 leading-relaxed">
              {explanation.blastRadius}
            </p>
          </div>
        </div>

        {/* Recommended Code Remediation Diff */}
        {explanation.codeDiff && (
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <FileCode className="h-3.5 w-3.5 text-emerald-400" />
              Suggested Migration Fix (Zod v3 → v4)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg border border-rose-900/40 bg-rose-950/20">
                <span className="text-rose-400 text-[11px] font-bold block mb-1">// Deprecated / Broken Syntax (v3)</span>
                <pre className="text-rose-200 overflow-x-auto whitespace-pre-wrap">{explanation.codeDiff.before}</pre>
              </div>
              <div className="p-3 rounded-lg border border-emerald-900/40 bg-emerald-950/20">
                <span className="text-emerald-400 text-[11px] font-bold block mb-1">// Modern Compatible Syntax (v4)</span>
                <pre className="text-emerald-200 overflow-x-auto whitespace-pre-wrap">{explanation.codeDiff.after}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Actionable Engineering Advice */}
        <div className="p-3 rounded-lg border border-slate-800 bg-surface-300">
          <span className="text-xs font-semibold text-slate-300 block mb-1">
            Engineering Action Plan:
          </span>
          <p className="text-slate-300 leading-relaxed">
            {explanation.recommendedFix}
          </p>
        </div>

        {/* Soundness & Limitations Disclaimer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Grounding: Analysis synthesized strictly from observable test vector diffs.</span>
          <span className="font-mono">Inference Temp: 0.1</span>
        </div>
      </div>
    </div>
  );
}
