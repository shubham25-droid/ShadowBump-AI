'use client';

import React from 'react';
import Link from 'next/link';
import WorkflowDiagram from '@/components/WorkflowDiagram';
import { ArrowRight, Code, AlertTriangle, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Hero Section */}
      <section className="max-w-3xl space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-primary leading-tight">
          Catch Behavioral Changes Before Production.
        </h1>

        <p className="text-base text-ink-secondary leading-relaxed max-w-2xl">
          ShadowBump AI compares software dependency behavior across versions by executing identical inputs in isolated runtime sandboxes and capturing observable differences.
        </p>

        <div className="pt-2">
          <Link
            href="/workspace"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors shadow-panel"
          >
            <span>Analyze an Upgrade</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* 2D Interactive Execution Flow */}
      <section>
        <WorkflowDiagram />
      </section>

      {/* Real Empirical Difference Preview */}
      <section className="rounded-lg border border-line bg-panel p-6 shadow-panel space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-line gap-2">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent block">
              Empirical Demonstration
            </span>
            <h2 className="text-sm font-bold text-ink-primary mt-0.5">
              Zod v3 to v4 Breaking Change Detected
            </h2>
          </div>
          <Link
            href="/workspace"
            className="text-xs text-accent hover:text-accent-hover font-medium inline-flex items-center gap-1"
          >
            <span>Execute in Workspace</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Input */}
        <div>
          <span className="text-[11px] font-mono text-ink-secondary block mb-1">
            Test Input (Missing required username field):
          </span>
          <pre className="p-2.5 rounded border border-line bg-background font-mono text-xs text-ink-primary overflow-x-auto">
            <code>{JSON.stringify({ email: "alex@company.org", age: 28 }, null, 2)}</code>
          </pre>
        </div>

        {/* Twin Output Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Baseline v3 */}
          <div className="p-3.5 rounded border border-line bg-background space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-line">
              <span className="font-bold text-status-success">
                Baseline (zod@3.23.8)
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-status-success-bg text-status-success font-semibold">
                CUSTOM ERROR HONORED
              </span>
            </div>
            <div className="text-[11px] text-ink-secondary">Validation Issue Message:</div>
            <div className="p-2 rounded bg-panel border border-line text-status-success font-bold">
              &quot;Username is required&quot;
            </div>
            <div className="text-[11px] text-ink-secondary pt-1">
              error.errors property: <strong className="text-status-success">defined Array(1)</strong>
            </div>
          </div>

          {/* Candidate v4 */}
          <div className="p-3.5 rounded border border-status-error/30 bg-status-error-bg/30 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-status-error/20">
              <span className="font-bold text-status-error">
                Candidate (zod@4.6.7)
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-status-error text-white font-semibold">
                REGRESSION DETECTED
              </span>
            </div>
            <div className="text-[11px] text-ink-secondary">Validation Issue Message:</div>
            <div className="p-2 rounded bg-panel border border-line text-status-error font-bold">
              &quot;Invalid input: expected string, received undefined&quot;
            </div>
            <div className="text-[11px] text-ink-secondary pt-1">
              error.errors property: <strong className="text-status-error">undefined (Throws TypeError)</strong>
            </div>
          </div>
        </div>

        {/* AI Synthesis Summary */}
        <div className="p-3 rounded border border-line bg-background text-xs space-y-1">
          <div className="flex items-center space-x-1.5 text-accent font-semibold text-[11px]">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>NVIDIA Nemotron Synthesis (Nebius Token Factory):</span>
          </div>
          <p className="text-ink-secondary leading-relaxed text-xs">
            Zod 4 consolidated error options into a single parameter and deprecated <code className="font-mono text-ink-primary">error.errors</code> in favor of <code className="font-mono text-ink-primary">error.issues</code>. Downstream code calling <code className="font-mono text-ink-primary">error.errors.map()</code> will crash with an unhandled TypeError.
          </p>
        </div>
      </section>
    </div>
  );
}
