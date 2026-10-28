'use client';

import React from 'react';
import { AIExplanationResult, RiskLevel } from '@/lib/types';
import { 
  Cpu, 
  AlertCircle, 
  FileCode, 
  RefreshCw,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ArrowRight
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
        return <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">LOW RISK</span>;
      case 'MEDIUM':
        return <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-950/60 text-amber-400 border border-amber-500/40">MEDIUM RISK</span>;
      case 'HIGH':
        return <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-950/60 text-rose-400 border border-rose-500/40 animate-pulse">HIGH RISK</span>;
      case 'CRITICAL':
        return <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse">CRITICAL RISK</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-cyan-500/40 bg-panel/90 p-6 shadow-glow space-y-3">
        <div className="flex items-center space-x-3 text-sm text-cyan-300">
          <RefreshCw className="h-5 w-5 animate-spin text-cyan-400" />
          <span className="font-bold text-white">Synthesizing Root Cause with NVIDIA Nemotron-70B on Nebius...</span>
        </div>
        <p className="text-xs text-slate-300">
          Feeding empirical AST diffs to Nebius Token Factory at temperature=0.1 for deterministic analysis.
        </p>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="rounded-2xl border border-border/80 bg-panel/70 p-8 text-center shadow-card space-y-2">
        <Cpu className="h-8 w-8 text-slate-500 mx-auto" />
        <div className="text-base font-bold text-white">
          NVIDIA AI Root-Cause Synthesis
        </div>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Select any detected difference above to synthesize an evidence-grounded root-cause explanation and migration diff.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cyan-500/40 bg-panel/90 shadow-glow overflow-hidden space-y-0 text-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-canvas via-panel to-canvas border-b border-border/80 gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-white text-base">
              NVIDIA Nemotron Root Cause Synthesis
            </span>
            {getRiskBadge(explanation.riskLevel)}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Nebius Token Factory • <span className="text-cyan-400 font-semibold">{explanation.modelUsed}</span>
          </div>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-border bg-canvas hover:bg-panel text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
            <span>Re-analyze</span>
          </button>
        )}
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Offline / Unavailable Notice */}
        {explanation.status !== 'SUCCESS' && (
          <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 text-amber-300 text-xs sm:text-sm space-y-1.5">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <strong className="block text-white font-bold">Deterministic Fallback Mode Active</strong>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {explanation.errorNotice || explanation.rootCause}
                </p>
                <div className="mt-2 font-mono text-[11px] text-slate-400">
                  Tip: Supply <code className="text-cyan-400">NEBIUS_API_KEY</code> in environment variables to enable live Nebius Token Factory inference.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1. Observed Facts */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            1. Observed Differential Evidence
          </span>
          <p className="text-slate-200 leading-relaxed text-sm bg-[#05070c] p-3.5 rounded-xl border border-border">
            {explanation.summary}
          </p>
        </div>

        {/* 2. Possible Implications & Root Cause */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            2. Root Cause & Architectural Blast Radius
          </span>
          <p className="text-slate-300 leading-relaxed text-sm">
            {explanation.rootCause}
          </p>
          <div className="p-3.5 rounded-xl border border-border/80 bg-canvas text-xs space-y-1">
            <span className="font-bold text-white block uppercase tracking-wide">Blast Radius Assessment:</span>
            <span className="text-slate-300 block">{explanation.blastRadius}</span>
          </div>
        </div>

        {/* 3. Migration Fix & Before/After Code Diff */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileCode className="h-4 w-4 text-cyan-400" />
            3. Recommended Code Migration Fix
          </span>

          {explanation.codeDiff && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-1.5">
                <span className="text-rose-400 font-bold block">// Deprecated / Non-Compliant (v3 Syntax)</span>
                <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">{explanation.codeDiff.before}</pre>
              </div>
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-1.5">
                <span className="text-emerald-400 font-bold block">// Modern Compliant (v4 Syntax)</span>
                <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">{explanation.codeDiff.after}</pre>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-300 leading-relaxed bg-[#05070c] p-3.5 rounded-xl border border-border">
            {explanation.recommendedFix}
          </p>
        </div>
      </div>
    </div>
  );
}
