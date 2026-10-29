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
      {/* 1. Immersive Hero Section (Exact Match to Clinical Atmospheric Reference) */}
      <section className="hero-clinical-bg border-b border-line pt-16 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Left-Aligned Headline Block with Generous Whitespace */}
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-line bg-card/80 backdrop-blur-md text-xs font-mono font-medium text-ink-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-tech animate-pulse" />
              <span>Nebius Token Factory × NVIDIA Nemotron • Differential Testing Harness</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.14]">
              Catch Behavioral Changes<br className="hidden sm:inline" /> Before Production.
            </h1>

            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed font-light max-w-2xl">
              Compare dependency behaviour across versions. Investigate differences with reproducible evidence.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/workspace"
                className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-[5px] bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all shadow-glowBlue"
              >
                <span>Analyze an Upgrade</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#topology"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-[5px] border border-line bg-card/70 hover:bg-panelHover text-white text-sm font-medium transition-colors backdrop-blur-sm"
              >
                <Layers className="h-4 w-4 text-tech" />
                <span>View Comparison Pipeline</span>
              </a>
            </div>
          </div>

          {/* 3D Physical Architecture Visualization */}
          <div id="topology" className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-ink-secondary">
              <span className="font-mono uppercase tracking-wider font-semibold text-tech flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-tech" />
                Technical Visualization: Twin Runtime Comparison
              </span>
              <span className="font-mono text-[11px] text-ink-muted">
                zod@3.23.8 (Baseline) vs zod@4.6.7 (Candidate)
              </span>
            </div>
            
            <InsaneTopology3D />
          </div>

          {/* Pagination Dots (Matching Reference Center Indicator) */}
          <div className="flex items-center justify-center space-x-2 pt-2">
            <span className="h-4 w-4 rounded-full border-2 border-tech/80 flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-tech" />
            </span>
            <span className="h-2 w-2 rounded-full bg-white/30" />
            <span className="h-2 w-2 rounded-full bg-white/30" />
          </div>

          {/* Docked Solid Vibrant Blue Shelf Cards (Exact match to bottom shelf of reference) */}
          <div className="grid grid-cols-1 md:grid-cols-3 rounded-card overflow-hidden shadow-panel border border-accent/30">
            <div className="p-6 bg-shelf-blue1 hover:bg-[#005298] transition-colors text-white space-y-2 border-b md:border-b-0 md:border-r border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-200 font-bold block">
                Feature 01 • Sandbox Isolation
              </span>
              <h3 className="font-heading text-lg font-bold text-white">
                Twin Sandbox Isolation
              </h3>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Parallel Node.js child processes for <code className="bg-black/25 px-1 py-0.5 rounded text-white font-mono">zod@3.23.8</code> vs <code className="bg-black/25 px-1 py-0.5 rounded text-white font-mono">zod@4.6.7</code> with strict 5s watchdog limits.
              </p>
            </div>

            <div className="p-6 bg-shelf-blue2 hover:bg-[#0058a6] transition-colors text-white space-y-2 border-b md:border-b-0 md:border-r border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-200 font-bold block">
                Feature 02 • AST Comparator
              </span>
              <h3 className="font-heading text-lg font-bold text-white">
                Deterministic AST Comparator
              </h3>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Zero-AI mathematical comparison categorizes outputs into 4 deterministic tiers before any model inference is dispatched.
              </p>
            </div>

            <div className="p-6 bg-shelf-blue3 hover:bg-[#004787] transition-colors text-white space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-200 font-bold block">
                Feature 03 • AI Synthesis
              </span>
              <h3 className="font-heading text-lg font-bold text-white">
                NVIDIA Nemotron on Nebius
              </h3>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Synthesizes observable AST diffs into root causes, blast radius estimates, and concrete before/after migration code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Real Empirical Difference Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-card border border-line bg-card p-6 sm:p-8 shadow-panel space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-line gap-2">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-tech block">
                Empirical Demonstration
              </span>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-white mt-0.5">
                Zod v3 to v4 Breaking Change Detected
              </h2>
            </div>
            <Link
              href="/workspace"
              className="text-xs text-tech hover:text-white font-medium inline-flex items-center gap-1 self-start sm:self-auto transition-colors"
            >
              <span>Execute in Workspace</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Test Input */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono text-ink-secondary block">
              Synchronized Input (Missing required <code className="text-white font-bold">username</code> field):
            </span>
            <pre className="p-3.5 rounded border border-line bg-[#17212b] font-mono text-xs text-tech overflow-x-auto">
              <code>{JSON.stringify({ email: "alex@company.org", age: 28 }, null, 2)}</code>
            </pre>
          </div>

          {/* Twin Output Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Baseline v3 */}
            <div className="p-4 rounded-card border border-status-success/30 bg-[#17212b] space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <span className="font-bold text-status-success">
                  Baseline (zod@3.23.8)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-status-successBg text-status-success font-semibold">
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
            <div className="p-4 rounded-card border border-status-error/30 bg-[#17212b] space-y-2.5">
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
            <div className="flex items-center space-x-1.5 text-tech font-semibold text-xs">
              <AlertTriangle className="h-4 w-4" />
              <span>NVIDIA Nemotron Synthesis (Nebius Token Factory):</span>
            </div>
            <p className="text-ink-secondary leading-relaxed">
              Zod 4 consolidated error options into a single parameter and deprecated <code className="font-mono text-white">error.errors</code> in favor of <code className="font-mono text-white">error.issues</code>. Downstream code calling <code className="font-mono text-white">error.errors.map()</code> will crash with an unhandled TypeError.
            </p>
          </div>
        </div>
      </section>

      {/* 3. 4 Pre-configured Scenarios */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-tech">
            Verified Scenarios
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white mt-0.5">
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
              className="group p-5 rounded-card border border-line bg-card hover:border-accent hover:shadow-panel transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-hero text-tech border border-line">
                    Scenario 0{idx + 1} • {sc.breakingCategory}
                  </span>
                  <span className="text-xs font-mono text-ink-muted">
                    {sc.testCases.length} vectors
                  </span>
                </div>

                <h3 className="font-heading text-base font-bold text-white group-hover:text-tech transition-colors flex items-center justify-between">
                  <span>{sc.title}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-tech" />
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
    </div>
  );
}
