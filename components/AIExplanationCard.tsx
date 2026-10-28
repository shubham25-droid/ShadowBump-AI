'use client';

import React from 'react';
import { AIExplanationResult, RiskLevel } from '@/lib/types';
import { 
  Cpu, 
  AlertCircle, 
  FileCode, 
  RefreshCw,
  CheckCircle2
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
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-status-success-bg text-status-success border border-status-success/30">LOW RISK</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-status-warning-bg text-status-warning border border-status-warning/30">MEDIUM RISK</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-status-error-bg text-status-error border border-status-error/30">HIGH RISK</span>;
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-status-error text-white">CRITICAL RISK</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded border border-line bg-panel p-4 shadow-panel space-y-2.5">
        <div className="flex items-center space-x-2.5 text-xs text-ink-primary">
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-accent" />
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
      <div className="rounded border border-line bg-panel p-5 text-center shadow-panel">
        <Cpu className="h-6 w-6 text-ink-muted mx-auto mb-1.5" />
        <div className="text-xs font-bold text-ink-primary">
          AI Explanation
        </div>
        <p className="text-[11px] text-ink-secondary mt-0.5 max-w-xs mx-auto">
          Select any detected difference to generate an evidence-grounded explanation.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded border border-line bg-panel shadow-panel overflow-hidden space-y-0 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 bg-background border-b border-line">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-ink-primary text-xs">
              NVIDIA Nemotron Analysis
            </span>
            {getRiskBadge(explanation.riskLevel)}
          </div>
          <div className="text-[10px] text-ink-secondary font-mono mt-0.5">
            Nebius Token Factory • {explanation.modelUsed}
          </div>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center space-x-1 px-2 py-1 text-[11px] font-mono rounded border border-line bg-panel hover:bg-background text-ink-secondary hover:text-ink-primary"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Re-analyze</span>
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Offline / Unavailable Notice */}
        {explanation.status !== 'SUCCESS' && (
          <div className="p-3 rounded border border-status-warning/40 bg-status-warning-bg text-status-warning text-xs space-y-1">
            <div className="flex items-start space-x-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Deterministic Mode Active</strong>
                <p className="text-[11px] text-ink-primary leading-relaxed">
                  {explanation.errorNotice || explanation.rootCause}
                </p>
                <div className="mt-1 font-mono text-[10px] text-ink-secondary">
                  To enable live NVIDIA Nemotron synthesis, configure NEBIUS_API_KEY in .env.local.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1. Observed Facts */}
        <div>
          <span className="text-[10px] font-bold text-ink-secondary uppercase tracking-wider block mb-1">
            1. Observed Facts
          </span>
          <p className="text-ink-primary leading-relaxed">
            {explanation.summary}
          </p>
        </div>

        {/* 2. Possible Implications */}
        <div>
          <span className="text-[10px] font-bold text-ink-secondary uppercase tracking-wider block mb-1">
            2. Possible Implications & Root Cause
          </span>
          <p className="text-ink-secondary leading-relaxed mb-2">
            {explanation.rootCause}
          </p>
          <div className="p-2.5 rounded border border-line bg-background text-[11px]">
            <span className="font-semibold text-ink-primary block mb-0.5">Blast Radius:</span>
            <span className="text-ink-secondary">{explanation.blastRadius}</span>
          </div>
        </div>

        {/* 3. Suggested Follow-Up Tests & Migration Fix */}
        <div>
          <span className="text-[10px] font-bold text-ink-secondary uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <FileCode className="h-3 w-3 text-accent" />
            3. Migration Fix & Follow-up Tests
          </span>

          {explanation.codeDiff && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] mb-2">
              <div className="p-2.5 rounded border border-status-error/30 bg-status-error-bg/30">
                <span className="text-status-error font-bold block mb-1">// Old Syntax (v3)</span>
                <pre className="text-ink-primary whitespace-pre-wrap">{explanation.codeDiff.before}</pre>
              </div>
              <div className="p-2.5 rounded border border-status-success/30 bg-status-success-bg/30">
                <span className="text-status-success font-bold block mb-1">// Compliant Syntax (v4)</span>
                <pre className="text-ink-primary whitespace-pre-wrap">{explanation.codeDiff.after}</pre>
              </div>
            </div>
          )}

          <p className="text-[11px] text-ink-secondary leading-relaxed">
            {explanation.recommendedFix}
          </p>
        </div>
      </div>
    </div>
  );
}
