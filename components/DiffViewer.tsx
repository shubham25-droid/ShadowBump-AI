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
  Bug
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="h-3.5 w-3.5" />
            Identical Output
          </span>
        );
      case 'BEHAVIORAL_DIFFERENCE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" />
            Behavioral Diff
          </span>
        );
      case 'POTENTIAL_REGRESSION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="h-3.5 w-3.5" />
            Regression Detected
          </span>
        );
      case 'EXECUTION_ERROR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
            <Bug className="h-3.5 w-3.5" />
            Execution Error
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all">
      {/* Diff Card Header */}
      <div 
        className="flex flex-wrap items-center justify-between p-4 bg-slate-50/80 border-b border-slate-100 cursor-pointer select-none hover:bg-slate-100/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                {item.id}
              </span>
              <span className="text-slate-900 font-bold text-sm">
                {item.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {item.summary}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
          {getStatusBadge()}
          <button 
            type="button"
            className="p-1 rounded text-slate-400 hover:text-slate-600"
            aria-label={isExpanded ? 'Collapse test case diff' : 'Expand test case diff'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Reason Callout if Difference/Regression */}
          {item.reasons.length > 0 && (
            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50">
              <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block mb-1">
                Observable Differences Detected:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {item.reasons.map((r, i) => (
                  <li key={i} className="leading-relaxed">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Test Input */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Executed Test Payload:
            </span>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800 overflow-x-auto">
              <pre>{JSON.stringify(item.input, null, 2)}</pre>
            </div>
          </div>

          {/* Side-by-Side Twin Sandbox Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Version Old (v3) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800 font-mono text-xs flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Baseline: zod@3.23.8
                </span>
                <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                  item.oldResult.success 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {item.oldResult.success ? 'PARSED_SUCCESS' : 'VALIDATION_FAILED'}
                </span>
              </div>

              {item.oldResult.success ? (
                <div>
                  <span className="text-[10px] font-mono text-slate-500">Output Data:</span>
                  <div className="p-2 rounded bg-white border border-slate-200 font-mono text-[11px] text-emerald-700 overflow-x-auto">
                    <pre>{JSON.stringify(item.oldResult.output, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] font-mono text-slate-500">Issues:</span>
                  <div className="p-2 rounded bg-white border border-slate-200 font-mono text-[11px] text-slate-800 overflow-x-auto max-h-36">
                    <pre>{JSON.stringify(item.oldResult.issues, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>error.errors defined:</span>
                <span className={item.oldResult.legacyProperties?.hasErrorsProp ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                  {String(item.oldResult.legacyProperties?.hasErrorsProp)}
                </span>
              </div>
            </div>

            {/* Version New (v4) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800 font-mono text-xs flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                  Candidate: zod@4.6.7
                </span>
                <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                  item.newResult.success 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {item.newResult.success ? 'PARSED_SUCCESS' : 'VALIDATION_FAILED'}
                </span>
              </div>

              {item.newResult.success ? (
                <div>
                  <span className="text-[10px] font-mono text-slate-500">Output Data:</span>
                  <div className="p-2 rounded bg-white border border-slate-200 font-mono text-[11px] text-emerald-700 overflow-x-auto">
                    <pre>{JSON.stringify(item.newResult.output, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] font-mono text-slate-500">Issues:</span>
                  <div className="p-2 rounded bg-white border border-slate-200 font-mono text-[11px] text-slate-800 overflow-x-auto max-h-36">
                    <pre>{JSON.stringify(item.newResult.issues, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>error.errors defined:</span>
                <span className={item.newResult.legacyProperties?.hasErrorsProp ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                  {String(item.newResult.legacyProperties?.hasErrorsProp)} {item.newResult.legacyProperties?.hasErrorsProp === false && '(MISSING)'}
                </span>
              </div>
            </div>
          </div>

          {/* Copyable Reproduction Snippet */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Code className="h-3.5 w-3.5 text-sky-600" />
                Reproduction Script
              </span>
              <button
                type="button"
                onClick={handleCopySnippet}
                className="flex items-center space-x-1 text-xs text-sky-600 hover:text-sky-800 font-medium transition-colors"
              >
                {copiedSnippet ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>{copiedSnippet ? 'Copied' : 'Copy Test Snippet'}</span>
              </button>
            </div>
            <pre className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-200 overflow-x-auto">
              <code>{item.reproducibleSnippet}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
