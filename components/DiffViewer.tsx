'use client';

import React, { useState } from 'react';
import { ComparisonDiffItem } from '@/lib/types';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Copy, 
  Check, 
  Code, 
  ChevronDown, 
  ChevronUp,
  Bug,
  Terminal,
  FileCode2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface DiffViewerProps {
  item: ComparisonDiffItem;
  scenarioTitle: string;
}

export default function DiffViewer({ item, scenarioTitle }: DiffViewerProps) {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(item.reproducibleSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const getStatusBadge = () => {
    switch (item.classification) {
      case 'MATCH':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 shadow-sm">
            <CheckCircle className="h-3.5 w-3.5" />
            No Difference Observed
          </span>
        );
      case 'BEHAVIORAL_DIFFERENCE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/60 text-amber-400 border border-amber-500/40 shadow-sm">
            <AlertTriangle className="h-3.5 w-3.5" />
            Behavioral Difference
          </span>
        );
      case 'POTENTIAL_REGRESSION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950/70 text-rose-300 border border-rose-500/50 shadow-sm animate-pulse">
            <XCircle className="h-3.5 w-3.5 text-rose-400" />
            Potential Regression
          </span>
        );
      case 'EXECUTION_ERROR':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-canvas border border-border text-slate-300">
            <Bug className="h-3.5 w-3.5 text-rose-400" />
            Execution Error
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-panel/90 shadow-card overflow-hidden transition-all hover:border-slate-600">
      {/* Diff Card Header */}
      <div 
        className="flex flex-wrap items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-canvas via-panel to-canvas border-b border-border/80 cursor-pointer select-none transition-colors hover:bg-panelHover"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            {item.id}
          </span>
          <div>
            <div className="font-bold text-white text-base">
              {item.label}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {item.summary}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
          {getStatusBadge()}
          <button 
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-canvas transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-5 text-sm">
          {/* Empirical Basis / Reasons */}
          {item.reasons.length > 0 && (
            <div className="p-4 rounded-xl border border-border/80 bg-[#05070c] space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                Empirical Evidence Detected:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-200 text-xs sm:text-sm">
                {item.reasons.map((r, i) => (
                  <li key={i} className="leading-relaxed">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Test Input Vector */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Synchronized Input Payload:
            </span>
            <div className="p-3.5 rounded-xl border border-border bg-[#05070c] font-mono text-xs text-cyan-300 overflow-x-auto shadow-inner">
              <pre>{JSON.stringify(item.input, null, 2)}</pre>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Version Old (v3) */}
            <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/10 via-panel to-panel p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/80 text-xs font-mono">
                <span className="font-bold text-emerald-400">
                  Baseline (zod@3.23.8)
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  item.oldResult.success 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-canvas border border-border text-slate-300'
                }`}>
                  {item.oldResult.success ? 'PARSE_SUCCESS' : 'VALIDATION_FAILED'}
                </span>
              </div>

              {item.oldResult.success ? (
                <div className="space-y-1">
                  <span className="text-xs font-mono text-slate-400">Parsed Output:</span>
                  <div className="p-2.5 rounded-lg border border-border bg-[#05070c] font-mono text-xs text-emerald-300 overflow-x-auto">
                    <pre>{JSON.stringify(item.oldResult.output, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-xs font-mono text-slate-400">Captured Issues:</span>
                  <div className="p-2.5 rounded-lg border border-border bg-[#05070c] font-mono text-xs text-slate-200 overflow-x-auto max-h-48">
                    <pre>{JSON.stringify(item.oldResult.issues, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-border/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Property error.errors defined:</span>
                <span className={item.oldResult.legacyProperties?.hasErrorsProp ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {String(item.oldResult.legacyProperties?.hasErrorsProp)}
                </span>
              </div>
            </div>

            {/* Version New (v4) */}
            <div className="rounded-xl border border-rose-500/30 bg-gradient-to-b from-rose-950/10 via-panel to-panel p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/80 text-xs font-mono">
                <span className="font-bold text-rose-400">
                  Candidate (zod@4.6.7)
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  item.newResult.success 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-canvas border border-border text-slate-300'
                }`}>
                  {item.newResult.success ? 'PARSE_SUCCESS' : 'VALIDATION_FAILED'}
                </span>
              </div>

              {item.newResult.success ? (
                <div className="space-y-1">
                  <span className="text-xs font-mono text-slate-400">Parsed Output:</span>
                  <div className="p-2.5 rounded-lg border border-border bg-[#05070c] font-mono text-xs text-emerald-300 overflow-x-auto">
                    <pre>{JSON.stringify(item.newResult.output, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-xs font-mono text-slate-400">Captured Issues:</span>
                  <div className="p-2.5 rounded-lg border border-border bg-[#05070c] font-mono text-xs text-rose-300 overflow-x-auto max-h-48">
                    <pre>{JSON.stringify(item.newResult.issues, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-border/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Property error.errors defined:</span>
                <span className={item.newResult.legacyProperties?.hasErrorsProp ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {String(item.newResult.legacyProperties?.hasErrorsProp)} {item.newResult.legacyProperties?.hasErrorsProp === false && '(MISSING)'}
                </span>
              </div>
            </div>
          </div>

          {/* Reproducible Snippet */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-cyan-400" />
                Standalone Reproduction Script (Copy & Run in Terminal)
              </span>
              <button
                type="button"
                onClick={handleCopySnippet}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-lg border border-border bg-canvas hover:bg-panel text-xs text-cyan-400 font-semibold transition-colors"
              >
                {copiedSnippet ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedSnippet ? 'Copied' : 'Copy Reproduction Script'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl border border-border bg-[#05070c] font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
              <code>{item.reproducibleSnippet}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
