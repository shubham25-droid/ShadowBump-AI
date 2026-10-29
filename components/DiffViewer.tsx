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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-status-success-bg text-status-success border border-status-success/20">
            <CheckCircle className="h-3.5 w-3.5" />
            No Difference Observed
          </span>
        );
      case 'BEHAVIORAL_DIFFERENCE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-status-warning-bg text-status-warning border border-status-warning/20">
            <AlertTriangle className="h-3.5 w-3.5" />
            Behavioral Difference
          </span>
        );
      case 'POTENTIAL_REGRESSION':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-status-error-bg text-status-error border border-status-error/30">
            <XCircle className="h-3.5 w-3.5 text-status-error" />
            Potential Regression
          </span>
        );
      case 'EXECUTION_ERROR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-hero border border-line text-ink-primary">
            <Bug className="h-3.5 w-3.5 text-status-error" />
            Execution Error
          </span>
        );
    }
  };

  return (
    <div className="rounded-card border border-line bg-card shadow-card overflow-hidden transition-all">
      {/* Diff Card Header */}
      <div 
        className="flex flex-wrap items-center justify-between p-4 sm:p-5 bg-card border-b border-line cursor-pointer select-none transition-colors hover:bg-hero/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold text-accent bg-accent-subtle px-2 py-0.5 rounded border border-accent/20">
            {item.id}
          </span>
          <div>
            <div className="font-heading font-bold text-ink-primary text-sm sm:text-base">
              {item.label}
            </div>
            <p className="text-xs text-ink-secondary mt-0.5">
              {item.summary}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
          {getStatusBadge()}
          <button 
            type="button"
            className="p-1 rounded text-ink-secondary hover:text-ink-primary transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Empirical Basis / Reasons */}
          {item.reasons.length > 0 && (
            <div className="p-3.5 rounded-card border border-line bg-bg space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-ink-primary uppercase tracking-wider block">
                Empirical Evidence Detected:
              </span>
              <ul className="list-disc list-inside space-y-1 text-ink-primary text-xs">
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
            <span className="text-[11px] font-mono font-bold text-ink-secondary uppercase tracking-wider block">
              Executed Input Payload:
            </span>
            <div className="p-3 rounded border border-line bg-hero font-mono text-xs text-ink-primary overflow-x-auto">
              <pre>{JSON.stringify(item.input, null, 2)}</pre>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Version Old (v3) */}
            <div className="rounded-card border border-line bg-bg p-3.5 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-line text-xs font-mono">
                <span className="font-bold text-status-success">
                  Baseline (zod@3.23.8)
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  item.oldResult.success 
                    ? 'bg-status-success-bg text-status-success' 
                    : 'bg-hero border border-line text-ink-secondary'
                }`}>
                  {item.oldResult.success ? 'PARSE_SUCCESS' : 'VALIDATION_FAILED'}
                </span>
              </div>

              {item.oldResult.success ? (
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-ink-secondary">Parsed Output:</span>
                  <div className="p-2.5 rounded border border-line bg-card font-mono text-xs text-status-success overflow-x-auto">
                    <pre>{JSON.stringify(item.oldResult.output, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-ink-secondary">Captured Issues:</span>
                  <div className="p-2.5 rounded border border-line bg-card font-mono text-xs text-ink-primary overflow-x-auto max-h-44">
                    <pre>{JSON.stringify(item.oldResult.issues, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-line flex items-center justify-between text-xs font-mono text-ink-secondary">
                <span>error.errors defined:</span>
                <span className={item.oldResult.legacyProperties?.hasErrorsProp ? 'text-status-success font-bold' : 'text-ink-muted'}>
                  {String(item.oldResult.legacyProperties?.hasErrorsProp)}
                </span>
              </div>
            </div>

            {/* Version New (v4) */}
            <div className="rounded-card border border-status-error/30 bg-status-error-bg/30 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-status-error/20 text-xs font-mono">
                <span className="font-bold text-status-error">
                  Candidate (zod@4.6.7)
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  item.newResult.success 
                    ? 'bg-status-success-bg text-status-success' 
                    : 'bg-hero border border-line text-ink-secondary'
                }`}>
                  {item.newResult.success ? 'PARSE_SUCCESS' : 'VALIDATION_FAILED'}
                </span>
              </div>

              {item.newResult.success ? (
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-ink-secondary">Parsed Output:</span>
                  <div className="p-2.5 rounded border border-line bg-card font-mono text-xs text-status-success overflow-x-auto">
                    <pre>{JSON.stringify(item.newResult.output, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-ink-secondary">Captured Issues:</span>
                  <div className="p-2.5 rounded border border-line bg-card font-mono text-xs text-status-error overflow-x-auto max-h-44">
                    <pre>{JSON.stringify(item.newResult.issues, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-status-error/20 flex items-center justify-between text-xs font-mono text-ink-secondary">
                <span>error.errors defined:</span>
                <span className={item.newResult.legacyProperties?.hasErrorsProp ? 'text-status-success font-bold' : 'text-status-error font-bold'}>
                  {String(item.newResult.legacyProperties?.hasErrorsProp)} {item.newResult.legacyProperties?.hasErrorsProp === false && '(MISSING)'}
                </span>
              </div>
            </div>
          </div>

          {/* Reproducible Snippet */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-ink-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-accent" />
                Reproduction Code
              </span>
              <button
                type="button"
                onClick={handleCopySnippet}
                className="flex items-center space-x-1 text-xs text-accent hover:text-accent-hover font-semibold transition-colors"
              >
                {copiedSnippet ? <Check className="h-3.5 w-3.5 text-status-success" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedSnippet ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-3 rounded border border-line bg-hero font-mono text-xs text-ink-primary overflow-x-auto leading-relaxed">
              <code>{item.reproducibleSnippet}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
