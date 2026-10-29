'use client';

import React from 'react';
import Link from 'next/link';
import InsaneTopology3D from '@/components/InsaneTopology3D';
import { SCENARIOS } from '@/lib/engine/scenarios';
import { 
  ArrowRight, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Layers, 
  Cpu, 
  Sparkles, 
  GitCompare, 
  Zap, 
  Code2,
  Lock,
  ArrowUpRight
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* 1. Immersive Hero Section (Spacious, Left-Aligned Composition Inspired by Reference) */}
      <section className="bg-hero border-b border-line pt-14 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Left-Aligned Headline Block with Generous Whitespace */}
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-line bg-card text-xs font-mono font-medium text-ink-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>Nebius Token Factory × NVIDIA Nemotron • Differential Harness</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink-primary leading-[1.12]">
              Catch Behavioral Changes Before Production.
            </h1>

            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed font-normal max-w-2xl">
              Compare dependency behaviour across versions. Investigate differences with reproducible evidence.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/workspace"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-button bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors shadow-card"
              >
                <span>Analyze an Upgrade</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#topology"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-button border border-line bg-card hover:bg-bg text-ink-primary text-sm font-medium transition-colors"
              >
                <Layers className="h-4 w-4 text-ink-secondary" />
                <span>View Comparison Pipeline</span>
              </a>
            </div>
          </div>

          {/* 3D Physical Architecture Visualization (Light Mode, Ceramic Pedestals, Crystal Clear Flow) */}
          <div id="topology" className="space-y-3">
            <div className="flex items-center justify-between text-xs text-ink-secondary">
              <span className="font-mono uppercase tracking-wider font-semibold">
                Technical Visualization: Twin Runtime Comparison
              </span>
              <span className="font-mono text-[11px]">
                zod@3.23.8 (Baseline) vs zod@4.6.7 (Candidate)
              </span>
            </div>
            
            <InsaneTopology3D />
          </div>
        </div>
      </section>

      {/* 2. Real Empirical Difference Preview (Clean White Card, High-Contrast Typography) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-card border border-line bg-card p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-line gap-2">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent block">
                Empirical Demonstration
              </span>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-ink-primary mt-0.5">
                Zod v3 to v4 Breaking Change Detected
              </h2>
            </div>
            <Link
              href="/workspace"
              className="text-xs text-accent hover:text-accent-hover font-medium inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Execute in Workspace</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Test Input */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono text-ink-secondary block">
              Synchronized Input (Missing required <code className="text-ink-primary font-bold">username</code> field):
            </span>
            <pre className="p-3 rounded border border-line bg-hero font-mono text-xs text-ink-primary overflow-x-auto">
              <code>{JSON.stringify({ email: "alex@company.org", age: 28 }, null, 2)}</code>
            </pre>
          </div>

          {/* Twin Output Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Baseline v3 */}
            <div className="p-4 rounded-card border border-line bg-bg space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <span className="font-bold text-status-success">
                  Baseline (zod@3.23.8)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-status-success-bg text-status-success font-semibold">
                  CUSTOM ERROR HONORED
                </span>
              </div>
              <div className="text-[11px] text-ink-secondary">Validation Issue Message:</div>
              <div className="p-2.5 rounded bg-card border border-line text-status-success font-bold">
                &quot;Username is required&quot;
              </div>
              <div className="text-[11px] text-ink-secondary pt-1">
                error.errors property: <strong className="text-status-success">defined Array(1)</strong>
              </div>
            </div>

            {/* Candidate v4 */}
            <div className="p-4 rounded-card border border-status-error/30 bg-status-error-bg/25 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-status-error/20">
                <span className="font-bold text-status-error">
                  Candidate (zod@4.6.7)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-status-error text-white font-semibold">
                  REGRESSION DETECTED
                </span>
              </div>
              <div className="text-[11px] text-ink-secondary">Validation Issue Message:</div>
              <div className="p-2.5 rounded bg-card border border-line text-status-error font-bold">
                &quot;Invalid input: expected string, received undefined&quot;
              </div>
              <div className="text-[11px] text-ink-secondary pt-1">
                error.errors property: <strong className="text-status-error">undefined (Throws TypeError)</strong>
              </div>
            </div>
          </div>

          {/* NVIDIA Synthesis Summary */}
          <div className="p-4 rounded-card border border-line bg-hero text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-accent font-semibold text-xs">
              <AlertTriangle className="h-4 w-4" />
              <span>NVIDIA Nemotron Synthesis (Nebius Token Factory):</span>
            </div>
            <p className="text-ink-secondary leading-relaxed">
              Zod 4 consolidated error options into a single parameter and deprecated <code className="font-mono text-ink-primary">error.errors</code> in favor of <code className="font-mono text-ink-primary">error.issues</code>. Downstream code calling <code className="font-mono text-ink-primary">error.errors.map()</code> will crash with an unhandled TypeError.
            </p>
          </div>
        </div>
      </section>

      {/* 3. 4 Pre-configured Scenarios (Restrained Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-secondary">
            Verified Scenarios
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink-primary mt-0.5">
            Test Scenarios Available in Workspace
          </h2>
          <p className="text-sm text-ink-secondary mt-1">
            Each scenario executes against live twin child processes with deterministic assertions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCENARIOS.map((sc, idx) => (
            <Link
              key={sc.id}
              href="/workspace"
              className="group p-5 rounded-card border border-line bg-card hover:border-accent/40 hover:shadow-panel transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-hero text-ink-primary">
                    Scenario 0{idx + 1} • {sc.breakingCategory}
                  </span>
                  <span className="text-xs font-mono text-ink-muted">
                    {sc.testCases.length} vectors
                  </span>
                </div>

                <h3 className="font-heading text-base font-bold text-ink-primary group-hover:text-accent transition-colors flex items-center justify-between">
                  <span>{sc.title}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
                </h3>

                <p className="text-xs text-ink-secondary leading-relaxed">
                  {sc.description}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-line flex items-center justify-between text-xs font-mono text-ink-secondary">
                <span>Baseline: <strong className="text-status-success font-semibold">zod@3.23.8</strong></span>
                <span>Candidate: <strong className="text-status-error font-semibold">zod@4.6.7</strong></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Architectural Principles (Clear, Uncluttered) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-card border border-line bg-card shadow-card space-y-2">
            <div className="h-8 w-8 rounded-button bg-hero flex items-center justify-center text-ink-primary">
              <Lock className="h-4 w-4" />
            </div>
            <h3 className="font-heading font-bold text-sm text-ink-primary">Twin Sandbox Isolation</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Subprocesses run baseline and candidate dependencies in strictly quarantined Node.js sandboxes. Clean env variables, memory bounds, and 5-second watchdog timers prevent cross-contamination.
            </p>
          </div>

          <div className="p-5 rounded-card border border-line bg-card shadow-card space-y-2">
            <div className="h-8 w-8 rounded-button bg-hero flex items-center justify-center text-ink-primary">
              <GitCompare className="h-4 w-4" />
            </div>
            <h3 className="font-heading font-bold text-sm text-ink-primary">Deterministic AST Oracle</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Outputs, schema validations, and property mutations are compared with zero AI hallucination. Deep structural diffs classify differences into 4 rigorous tiers before any LLM is queried.
            </p>
          </div>

          <div className="p-5 rounded-card border border-line bg-card shadow-card space-y-2">
            <div className="h-8 w-8 rounded-button bg-hero flex items-center justify-center text-ink-primary">
              <Cpu className="h-4 w-4 text-tech" />
            </div>
            <h3 className="font-heading font-bold text-sm text-ink-primary">NVIDIA Nemotron on Nebius</h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              When differences are observed, NVIDIA Llama-3.1-Nemotron-70B via Nebius Token Factory analyzes the exact AST diff to provide actionable migration code and root-cause diagnosis.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
