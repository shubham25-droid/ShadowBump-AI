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
  Layers, 
  Bug, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="h-3.5 w-3.5" />
            Identical Output
          </span>
        );
      case 'BEHAVIORAL_DIFFERENCE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="h-3.5 w-3.5" />
            Behavioral Difference
          </span>
        );
      case 'POTENTIAL_REGRESSION':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="h-3.5 w-3.5" />
            Potential Regression
          </span>
        );
      case 'EXECUTION_ERROR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Bug className="h-3.5 w-3.5" />
            Execution Error
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden transition-all shadow-md">
      {/* Diff Card Header */}
      <div 
        className="flex flex-wrap items-center justify-between p-4 bg-surface-200/90 border-b border-surface-border cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-sky-400">
                {item.id}
              </span>
              <span className="text-slate-300 font-semibold text-sm">
                {item.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {item.summary}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
          {getStatusBadge()}
          <button 
            type="button"
            className="p-1 rounded text-slate-400 hover:text-slate-200"
            aria-label={isExpanded ? 'Collapse test case diff' : 'Expand test case diff'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-5">
          {/* Detected Reason List */}
          {item.reasons.length > 0 && (
            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                Empirical Evidence Detected:
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                {item.reasons.map((r, i) => (
                  <li key={i} className="leading-relaxed">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Test Input Payload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-400 font-mono">
                Executed Test Vector (Piped Identically to Stdin)
              </span>
            </div>
            <div className="p-3 rounded-lg bg-surface-300 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre>{JSON.stringify(item.input, null, 2)}</pre>
            </div>
          </div>

          {/* Side-by-Side Twin Environment Outcome */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Version Old (v3) */}
            <div className="rounded-lg border border-slate-800 bg-surface-200/50 p-4">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-slate-200 font-mono uppercase">
                    Baseline: zod@3.23.8
                  </span>
                </div>
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                  item.oldResult.success 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {item.oldResult.success ? 'PARSED_SUCCESS' : 'VALIDATION_FAILED'}
                </span>
              </div>

              {/* Output or Issues */}
              {item.oldResult.success ? (
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-slate-400">Parsed Data:</span>
                  <div className="p-2.5 rounded bg-surface-300 font-mono text-xs text-emerald-300 overflow-x-auto">
                    <pre>{JSON.stringify(item.oldResult.output, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-slate-400">Issues Array:</span>
                  <div className="p-2.5 rounded bg-surface-300 font-mono text-xs text-slate-300 overflow-x-auto max-h-48">
                    <pre>{JSON.stringify(item.oldResult.issues, null, 2)}</pre>
                  </div>
                </div>
              )}

              {/* Legacy property indicator */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>error.errors defined:</span>
                <span className={item.oldResult.legacyProperties?.hasErrorsProp ? 'text-emerald-400' : 'text-slate-400'}>
                  {String(item.oldResult.legacyProperties?.hasErrorsProp)}
                </span>
              </div>
            </div>

            {/* Version New (v4) */}
            <div className="rounded-lg border border-slate-800 bg-surface-200/50 p-4">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-violet-400" />
                  <span className="text-xs font-bold text-slate-200 font-mono uppercase">
                    Candidate: zod@4.6.7
                  </span>
                </div>
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                  item.newResult.success 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {item.newResult.success ? 'PARSED_SUCCESS' : 'VALIDATION_FAILED'}
                </span>
              </div>

              {/* Output or Issues */}
              {item.newResult.success ? (
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-slate-400">Parsed Data:</span>
                  <div className="p-2.5 rounded bg-surface-300 font-mono text-xs text-emerald-300 overflow-x-auto">
                    <pre>{JSON.stringify(item.newResult.output, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-slate-400">Issues Array:</span>
                  <div className="p-2.5 rounded bg-surface-300 font-mono text-xs text-slate-300 overflow-x-auto max-h-48">
                    <pre>{JSON.stringify(item.newResult.issues, null, 2)}</pre>
                  </div>
                </div>
              )}

              {/* Legacy property indicator */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>error.errors defined:</span>
                <span className={item.newResult.legacyProperties?.hasErrorsProp ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                  {String(item.newResult.legacyProperties?.hasErrorsProp)} {item.newResult.legacyProperties?.hasErrorsProp === false && '(REMOVED)'}
                </span>
              </div>
            </div>
          </div>

          {/* Reproducible Snippet Box */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-sky-400" />
                Deterministic Reproduction Snippet
              </span>
              <button
                type="button"
                onClick={handleCopySnippet}
                className="flex items-center space-x-1 text-xs text-sky-400 hover:text-sky-300 font-mono transition-colors"
              >
                {copiedSnippet ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedSnippet ? 'Copied' : 'Copy Reproduction Code'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-surface-300 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <code>{item.reproducibleSnippet}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
