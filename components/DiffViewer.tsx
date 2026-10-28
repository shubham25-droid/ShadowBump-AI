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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-status-success-bg text-status-success border border-status-success/20">
            <CheckCircle className="h-3 w-3" />
            No Difference Observed
          </span>
        );
      case 'BEHAVIORAL_DIFFERENCE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-status-warning-bg text-status-warning border border-status-warning/20">
            <AlertTriangle className="h-3 w-3" />
            Behavioral Difference
          </span>
        );
      case 'POTENTIAL_REGRESSION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-status-error-bg text-status-error border border-status-error/30">
            <XCircle className="h-3 w-3" />
            Potential Regression
          </span>
        );
      case 'EXECUTION_ERROR':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-background border border-line text-ink-primary">
            <Bug className="h-3 w-3" />
            Execution Error
          </span>
        );
    }
  };

  return (
    <div className="rounded border border-line bg-panel shadow-panel overflow-hidden transition-colors">
      {/* Diff Card Header */}
      <div 
        className="flex flex-wrap items-center justify-between p-3.5 bg-panel border-b border-line cursor-pointer select-none hover:bg-background transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2.5">
          <span className="font-mono text-xs font-bold text-accent bg-accent-subtle px-1.5 py-0.5 rounded border border-line">
            {item.id}
          </span>
          <div>
            <div className="font-bold text-ink-primary text-xs sm:text-sm">
              {item.label}
            </div>
            <p className="text-[11px] text-ink-secondary mt-0.5">
              {item.summary}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 mt-2 sm:mt-0">
          {getStatusBadge()}
          <button 
            type="button"
            className="p-1 rounded text-ink-secondary hover:text-ink-primary"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-3.5 text-xs">
          {/* Empirical Basis / Reasons */}
          {item.reasons.length > 0 && (
            <div className="p-2.5 rounded border border-line bg-background">
              <span className="text-[10px] font-bold text-ink-secondary uppercase tracking-wider block mb-1">
                Empirical Evidence Detected:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-ink-primary text-xs">
                {item.reasons.map((r, i) => (
                  <li key={i} className="leading-relaxed">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Test Input Vector */}
          <div>
            <span className="text-[10px] font-bold text-ink-secondary uppercase tracking-wider block mb-1">
              Executed Test Input:
            </span>
            <div className="p-2 rounded border border-line bg-background font-mono text-xs text-ink-primary overflow-x-auto">
              <pre>{JSON.stringify(item.input, null, 2)}</pre>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Version Old (v3) */}
            <div className="rounded border border-line bg-panel p-3 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-line text-xs">
                <span className="font-bold text-ink-primary font-mono text-[11px]">
                  Old Version: zod@3.23.8
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  item.oldResult.success 
                    ? 'bg-status-success-bg text-status-success' 
                    : 'bg-background border border-line text-ink-secondary'
                }`}>
                  {item.oldResult.success ? 'PARSE_SUCCESS' : 'VALIDATION_FAILED'}
                </span>
              </div>

              {item.oldResult.success ? (
                <div>
                  <span className="text-[10px] font-mono text-ink-secondary">Output:</span>
                  <div className="p-2 rounded border border-line bg-background font-mono text-xs text-status-success overflow-x-auto">
                    <pre>{JSON.stringify(item.oldResult.output, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] font-mono text-ink-secondary">Issues:</span>
                  <div className="p-2 rounded border border-line bg-background font-mono text-xs text-ink-primary overflow-x-auto max-h-36">
                    <pre>{JSON.stringify(item.oldResult.issues, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div className="pt-1.5 border-t border-line flex items-center justify-between text-[11px] font-mono text-ink-secondary">
                <span>error.errors defined:</span>
                <span className={item.oldResult.legacyProperties?.hasErrorsProp ? 'text-status-success font-bold' : 'text-ink-secondary'}>
                  {String(item.oldResult.legacyProperties?.hasErrorsProp)}
                </span>
              </div>
            </div>

            {/* Version New (v4) */}
            <div className="rounded border border-line bg-panel p-3 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-line text-xs">
                <span className="font-bold text-ink-primary font-mono text-[11px]">
                  New Version: zod@4.6.7
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  item.newResult.success 
                    ? 'bg-status-success-bg text-status-success' 
                    : 'bg-background border border-line text-ink-secondary'
                }`}>
                  {item.newResult.success ? 'PARSE_SUCCESS' : 'VALIDATION_FAILED'}
                </span>
              </div>

              {item.newResult.success ? (
                <div>
                  <span className="text-[10px] font-mono text-ink-secondary">Output:</span>
                  <div className="p-2 rounded border border-line bg-background font-mono text-xs text-status-success overflow-x-auto">
                    <pre>{JSON.stringify(item.newResult.output, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] font-mono text-ink-secondary">Issues:</span>
                  <div className="p-2 rounded border border-line bg-background font-mono text-xs text-ink-primary overflow-x-auto max-h-36">
                    <pre>{JSON.stringify(item.newResult.issues, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div className="pt-1.5 border-t border-line flex items-center justify-between text-[11px] font-mono text-ink-secondary">
                <span>error.errors defined:</span>
                <span className={item.newResult.legacyProperties?.hasErrorsProp ? 'text-status-success font-bold' : 'text-status-error font-bold'}>
                  {String(item.newResult.legacyProperties?.hasErrorsProp)} {item.newResult.legacyProperties?.hasErrorsProp === false && '(MISSING)'}
                </span>
              </div>
            </div>
          </div>

          {/* Reproducible Snippet */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-ink-secondary uppercase tracking-wider flex items-center gap-1">
                <Code className="h-3 w-3 text-accent" />
                Reproduction Code
              </span>
              <button
                type="button"
                onClick={handleCopySnippet}
                className="flex items-center space-x-1 text-[11px] text-accent hover:text-accent-hover font-medium transition-colors"
              >
                {copiedSnippet ? <Check className="h-3 w-3 text-status-success" /> : <Copy className="h-3 w-3" />}
                <span>{copiedSnippet ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-2.5 rounded border border-line bg-background font-mono text-xs text-ink-primary overflow-x-auto">
              <code>{item.reproducibleSnippet}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
