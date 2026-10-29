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
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-status-successBg text-status-success border border-status-success/30">LOW RISK</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-status-warningBg text-status-warning border border-status-warning/30">MEDIUM RISK</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-status-errorBg text-status-error border border-status-error/40 animate-pulse">HIGH RISK</span>;
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-status-error text-white shadow-sm animate-pulse">CRITICAL RISK</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-card border border-line bg-card p-5 shadow-card space-y-2">
        <div className="flex items-center space-x-2.5 text-xs text-white">
          <RefreshCw className="h-4 w-4 animate-spin text-tech" />
          <span className="font-semibold">Querying NVIDIA Nemotron-70B on Nebius...</span>
        </div>
        <p className="text-xs text-ink-secondary">
          Synthesizing root cause from empirical diff evidence.
        </p>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="rounded-card border border-line bg-card p-6 text-center shadow-card space-y-1.5">
        <Cpu className="h-6 w-6 text-ink-muted mx-auto" />
        <div className="font-heading font-bold text-xs text-white">
          NVIDIA AI Explanation
        </div>
        <p className="text-[11px] text-ink-secondary max-w-xs mx-auto">
          Select any detected difference to generate an evidence-grounded root-cause explanation.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line bg-card shadow-card overflow-hidden space-y-0 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-hero border-b border-line gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="font-heading font-bold text-white text-xs">
              NVIDIA Nemotron Analysis
            </span>
            {getRiskBadge(explanation.riskLevel)}
          </div>
          <div className="text-[10px] text-ink-secondary font-mono">
            Nebius Token Factory • {explanation.modelUsed}
          </div>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-mono rounded border border-line bg-card hover:bg-panelHover text-ink-secondary hover:text-white transition-colors"
          >
            <RefreshCw className="h-3 w-3 text-tech" />
            <span>Re-analyze</span>
          </button>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Offline / Unavailable Notice */}
        {explanation.status !== 'SUCCESS' && (
          <div className="p-3.5 rounded border border-status-warning/40 bg-status-warningBg text-white text-xs space-y-1">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-status-warning" />
              <div>
                <strong className="block font-semibold">Deterministic Mode Active</strong>
                <p className="text-[11px] text-ink-secondary leading-relaxed">
                  {explanation.errorNotice || explanation.rootCause}
                </p>
                <div className="mt-1 font-mono text-[10px] text-ink-muted">
                  Configure <code className="text-white">NEBIUS_API_KEY</code> in environment variables to enable live Nebius Token Factory inference.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1. Observed Facts */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-tech uppercase tracking-wider block">
            1. Observed Facts
          </span>
          <p className="text-ink-primary leading-relaxed bg-[#0a1826] p-3 rounded border border-line">
            {explanation.summary}
          </p>
        </div>

        {/* 2. Possible Implications & Root Cause */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-tech uppercase tracking-wider block">
            2. Possible Implications & Root Cause
          </span>
          <p className="text-ink-secondary leading-relaxed">
            {explanation.rootCause}
          </p>
          <div className="p-2.5 rounded border border-line bg-[#0a1826] text-[11px]">
            <span className="font-semibold text-white block mb-0.5">Blast Radius:</span>
            <span className="text-ink-secondary">{explanation.blastRadius}</span>
          </div>
        </div>

        {/* 3. Migration Fix & Before/After Code Diff */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold text-tech uppercase tracking-wider flex items-center gap-1">
            <FileCode className="h-3.5 w-3.5 text-tech" />
            3. Migration Fix & Follow-up Tests
          </span>

          {explanation.codeDiff && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="p-3 rounded border border-status-error/30 bg-status-errorBg space-y-1">
                <span className="text-status-error font-bold text-[11px] block">// Old Syntax (v3)</span>
                <pre className="text-ink-primary whitespace-pre-wrap leading-relaxed">{explanation.codeDiff.before}</pre>
              </div>
              <div className="p-3 rounded border border-status-success/30 bg-status-successBg space-y-1">
                <span className="text-status-success font-bold text-[11px] block">// Modern Syntax (v4)</span>
                <pre className="text-ink-primary whitespace-pre-wrap leading-relaxed">{explanation.codeDiff.after}</pre>
              </div>
            </div>
          )}

          <p className="text-[11px] text-ink-secondary leading-relaxed bg-[#0a1826] p-3 rounded border border-line">
            {explanation.recommendedFix}
          </p>
        </div>
      </div>
    </div>
  );
}
