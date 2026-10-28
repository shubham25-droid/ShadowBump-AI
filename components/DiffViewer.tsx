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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 shadow-sm">
            <CheckCircle className="h-3.5 w-3.5" />
            No Difference Observed
          </span>
        );
      case 'BEHAVIORAL_DIFFERENCE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/50 text-amber-400 border border-amber-500/30 shadow-sm">
            <AlertTriangle className="h-3.5 w-3.5" />
            Behavioral Difference
          </span>
        );
      case 'POTENTIAL_REGRESSION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950/60 text-rose-300 border border-rose-500/40 shadow-sm animate-pulse">
            <XCircle className="h-3.5 w-3.5 text-rose-400" />
            Potential Regression
          </span>
        );
      case 'EXECUTION_ERROR':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-zinc-800 border border-zinc-700 text-zinc-300">
            <Bug className="h-3.5 w-3.5 text-rose-400" />
            Execution Error
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-750 bg-[#161821]/95 shadow-card overflow-hidden transition-all hover:border-zinc-600">
      {/* Diff Card Header */}
      <div 
        className="flex flex-wrap items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-zinc-850 via-[#181a23] to-zinc-850 border-b border-zinc-750 cursor-pointer select-none transition-colors hover:bg-zinc-800/80"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold text-zinc-200 bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700">
            {item.id}
          </span>
          <div>
            <div className="font-bold text-white text-base">
              {item.label}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {item.summary}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
          {getStatusBadge()}
          <button 
            type="button"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
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
            <div className="p-4 rounded-xl border border-zinc-750 bg-[#0d0e12] space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider block">
                Empirical Evidence Detected:
              </span>
              <ul className="list-disc list-inside space-y-1 text-zinc-200 text-xs sm:text-sm">
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
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
              Synchronized Input Payload:
            </span>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-[#0d0e12] font-mono text-xs text-zinc-300 overflow-x-auto shadow-inner">
              <pre>{JSON.stringify(item.input, null, 2)}</pre>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Version Old (v3) */}
            <div className="rounded-xl border border-emerald-500/25 bg-gradient-to-b from-emerald-950/10 via-zinc-850 to-zinc-900 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-750 text-xs font-mono">
                <span className="font-bold text-emerald-400">
                  Baseline (zod@3.23.8)
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  item.oldResult.success 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-300'
                }`}>
                  {item.oldResult.success ? 'PARSE_SUCCESS' : 'VALIDATION_FAILED'}
                </span>
              </div>

              {item.oldResult.success ? (
                <div className="space-y-1">
                  <span className="text-xs font-mono text-zinc-400">Parsed Output:</span>
                  <div className="p-2.5 rounded-lg border border-zinc-800 bg-[#0d0e12] font-mono text-xs text-emerald-300 overflow-x-auto">
                    <pre>{JSON.stringify(item.oldResult.output, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-xs font-mono text-zinc-400">Captured Issues:</span>
                  <div className="p-2.5 rounded-lg border border-zinc-800 bg-[#0d0e12] font-mono text-xs text-zinc-300 overflow-x-auto max-h-48">
                    <pre>{JSON.stringify(item.oldResult.issues, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-zinc-750 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Property error.errors defined:</span>
                <span className={item.oldResult.legacyProperties?.hasErrorsProp ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                  {String(item.oldResult.legacyProperties?.hasErrorsProp)}
                </span>
              </div>
            </div>

            {/* Version New (v4) */}
            <div className="rounded-xl border border-rose-500/25 bg-gradient-to-b from-rose-950/10 via-zinc-850 to-zinc-900 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-750 text-xs font-mono">
                <span className="font-bold text-rose-400">
                  Candidate (zod@4.6.7)
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  item.newResult.success 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-300'
                }`}>
                  {item.newResult.success ? 'PARSE_SUCCESS' : 'VALIDATION_FAILED'}
                </span>
              </div>

              {item.newResult.success ? (
                <div className="space-y-1">
                  <span className="text-xs font-mono text-zinc-400">Parsed Output:</span>
                  <div className="p-2.5 rounded-lg border border-zinc-800 bg-[#0d0e12] font-mono text-xs text-emerald-300 overflow-x-auto">
                    <pre>{JSON.stringify(item.newResult.output, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-xs font-mono text-zinc-400">Captured Issues:</span>
                  <div className="p-2.5 rounded-lg border border-zinc-800 bg-[#0d0e12] font-mono text-xs text-rose-300 overflow-x-auto max-h-48">
                    <pre>{JSON.stringify(item.newResult.issues, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-zinc-750 flex items-center justify-between text-xs font-mono text-zinc-400">
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
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-zinc-300" />
                Standalone Reproduction Script (Copy & Run in Terminal)
              </span>
              <button
                type="button"
                onClick={handleCopySnippet}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-750 text-xs text-zinc-200 font-semibold transition-colors"
              >
                {copiedSnippet ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedSnippet ? 'Copied' : 'Copy Reproduction Script'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl border border-zinc-800 bg-[#0d0e12] font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
              <code>{item.reproducibleSnippet}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
