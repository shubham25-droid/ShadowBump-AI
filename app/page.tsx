'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DemoVideoModal from '@/components/DemoVideoModal';
import WorkflowDiagram from '@/components/WorkflowDiagram';
import { SCENARIOS } from '@/lib/engine/scenarios';
import { 
  ArrowRight, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Layers, 
  Cpu, 
  GitCompare, 
  Zap, 
  Code2,
  Lock,
  ArrowUpRight,
  HelpCircle,
  Play,
  FileCheck,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== 'undefined' && window.location.hash === '#demo') {
        setIsDemoModalOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
  return (
    <div className="space-y-14 sm:space-y-16 pb-20">
      {/* 1. Hero Section */}
      <section className="bg-hero/40 border-b border-line pt-14 pb-14 px-4 sm:px-6 lg:px-8 backdrop-blur-[2px]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-line bg-card/90 text-xs font-mono text-ink-secondary shadow-card">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span>Nebius Token Factory × NVIDIA Nemotron - Differential Testing Harness</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink-primary leading-[1.12]">
              Catch{' '}
              <span className="inline-block px-3.5 py-0.5 mx-1 rounded-full bg-white shadow-card border border-line text-accent font-extrabold">
                Behavioral
              </span>{' '}
              Changes Before Production.
            </h1>

            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-2xl">
              Compare dependency behavior across versions. Investigate differences with reproducible evidence before bumping versions in production.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/workspace"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-button bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors shadow-subtle"
              >
                <span>Analyze an Upgrade</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-button border border-line bg-card hover:bg-panelHover text-ink-primary text-sm font-medium transition-colors shadow-card group cursor-pointer"
              >
                <div className="h-5 w-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
                </div>
                <span>Watch 2-Min Demo</span>
              </button>

              <a
                href="#guide"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-button border border-line bg-card hover:bg-panelHover text-ink-primary text-sm font-medium transition-colors shadow-card"
              >
                <HelpCircle className="h-4 w-4 text-accent" />
                <span>How to Use Guide</span>
              </a>

              <a
                href="#pipeline"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-button border border-line bg-card hover:bg-panelHover text-ink-primary text-sm font-medium transition-colors shadow-card"
              >
                <Layers className="h-4 w-4 text-tech" />
                <span>View Pipeline</span>
              </a>
            </div>
          </div>

          {/* 3 Core Architectural Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-card border border-line bg-card/95 space-y-1.5 shadow-card hover:shadow-panel transition-all">
              <span className="text-[10px] font-mono text-tech uppercase tracking-wider font-bold block">
                Feature 01
              </span>
              <h3 className="font-heading font-bold text-ink-primary text-sm">
                Twin Sandbox Isolation
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Parallel Node.js child processes for <code className="text-status-success font-mono font-medium">zod@3.23.8</code> vs <code className="text-status-error font-mono font-medium">zod@4.6.7</code> with 5s watchdog timers.
              </p>
            </div>

            <div className="p-4 rounded-card border border-line bg-card/95 space-y-1.5 shadow-card hover:shadow-panel transition-all">
              <span className="text-[10px] font-mono text-tech uppercase tracking-wider font-bold block">
                Feature 02
              </span>
              <h3 className="font-heading font-bold text-ink-primary text-sm">
                Deterministic AST Comparator
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Zero-AI mathematical comparison categorizes outputs into 4 deterministic tiers before any model inference.
              </p>
            </div>

            <div className="p-4 rounded-card border border-line bg-card/95 space-y-1.5 shadow-card hover:shadow-panel transition-all">
              <span className="text-[10px] font-mono text-tech uppercase tracking-wider font-bold block">
                Feature 03
              </span>
              <h3 className="font-heading font-bold text-ink-primary text-sm">
                NVIDIA Nemotron on Nebius
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Synthesizes observable AST diffs into root causes, blast radius estimates, and before/after migration code.
              </p>
            </div>
          </div>

          {/* 2D Interactive Execution Flow Diagram */}
          <div id="pipeline" className="pt-2">
            <WorkflowDiagram />
          </div>
        </div>
      </section>

      {/* 2. Interactive "How to Use" Step-by-Step Guide */}
      <section id="guide" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-line gap-2">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent block">
              Step-by-Step Guide
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink-primary mt-0.5">
              How to Use ShadowBump AI
            </h2>
            <p className="text-sm text-ink-secondary mt-1 max-w-xl">
              Follow these simple steps to analyze, detect, and remediate dependency breaking changes in seconds.
            </p>
          </div>

          <Link
            href="/workspace"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-button bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-subtle transition-colors self-start sm:self-auto"
          >
            <span>Open Workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 3 Steps Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="rounded-card border border-line bg-card/95 p-5 shadow-card space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-hero text-accent border border-line">
                  STEP 01
                </span>
                <span className="text-xs font-mono text-ink-muted">Configure</span>
              </div>
              <h3 className="font-heading text-base font-bold text-ink-primary">
                Select or Add Test Vectors
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Choose from 4 pre-configured real-world Zod migration scenarios (error maps, enum coercion, required fields) or input your own custom JSON payload.
              </p>
            </div>
            <div className="pt-3 border-t border-line text-[11px] font-mono text-ink-muted bg-hero/40 -mx-5 -mb-5 p-3.5">
              <span className="text-accent font-semibold block mb-0.5">Where in UI:</span>
              Workspace &gt; Section A &gt; Test Corpus
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-card border border-line bg-card/95 p-5 shadow-card space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-hero text-accent border border-line">
                  STEP 02
                </span>
                <span className="text-xs font-mono text-ink-muted">Execute</span>
              </div>
              <h3 className="font-heading text-base font-bold text-ink-primary">
                Run Differential Analysis
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Click &quot;Run Differential Analysis&quot;. ShadowBump spins up parallel Node.js child processes for <code className="font-mono text-status-success font-semibold">zod@3</code> and <code className="font-mono text-status-error font-semibold">zod@4</code>, feeding test inputs through stdin under a 5s watchdog limit.
              </p>
            </div>
            <div className="pt-3 border-t border-line text-[11px] font-mono text-ink-muted bg-hero/40 -mx-5 -mb-5 p-3.5">
              <span className="text-accent font-semibold block mb-0.5">Where in UI:</span>
              Workspace &gt; Run Button &gt; Live Subprocess
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-card border border-line bg-card/95 p-5 shadow-card space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-hero text-accent border border-line">
                  STEP 03
                </span>
                <span className="text-xs font-mono text-ink-muted">Inspect &amp; Fix</span>
              </div>
              <h3 className="font-heading text-base font-bold text-ink-primary">
                Review Evidence &amp; AI Fix
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Inspect side-by-side AST outputs to spot dropped properties (such as <code className="font-mono text-status-error font-semibold">error.errors</code> returning undefined). Copy the AI-generated before/after code migration fix directly.
              </p>
            </div>
            <div className="pt-3 border-t border-line text-[11px] font-mono text-ink-muted bg-hero/40 -mx-5 -mb-5 p-3.5">
              <span className="text-accent font-semibold block mb-0.5">Where in UI:</span>
              Results Page &gt; Diff Viewer &gt; Nemotron Card
            </div>
          </div>
        </div>
      </section>

      {/* 3. Real Empirical Breaking Change Demonstration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-card border border-line bg-card/95 p-6 sm:p-8 shadow-card space-y-6">
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
              className="text-xs text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-1 self-start sm:self-auto transition-colors"
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
            <pre className="p-3.5 rounded border border-line bg-hero/60 font-mono text-xs text-ink-primary overflow-x-auto">
              <code>{JSON.stringify({ email: "alex@company.org", age: 28 }, null, 2)}</code>
            </pre>
          </div>

          {/* Twin Output Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Baseline v3 */}
            <div className="p-4 rounded-card border border-status-success/30 bg-status-successBg space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-status-success/20">
                <span className="font-bold text-status-success">
                  Baseline (zod@3.23.8)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-card text-status-success font-semibold border border-status-success/30">
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
            <div className="p-4 rounded-card border border-status-error/30 bg-status-errorBg space-y-2.5">
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
          <div className="p-4 rounded-card border border-line bg-hero/60 text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-accent font-semibold text-xs">
              <AlertTriangle className="h-4 w-4" />
              <span>NVIDIA Nemotron Synthesis (Nebius Token Factory):</span>
            </div>
            <p className="text-ink-secondary leading-relaxed">
              Zod 4 consolidated error options into a single parameter and deprecated <code className="font-mono text-ink-primary font-medium">error.errors</code> in favor of <code className="font-mono text-ink-primary font-medium">error.issues</code>. Downstream code calling <code className="font-mono text-ink-primary font-medium">error.errors.map()</code> will crash with an unhandled TypeError in production.
            </p>
          </div>
        </div>
      </section>

      {/* 4. 4 Pre-configured Scenarios Available in Workspace */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent block">
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
              className="group p-5 rounded-card border border-line bg-card/95 hover:border-accent hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-hero/60 text-ink-primary border border-line">
                    Scenario 0{idx + 1} - {sc.breakingCategory}
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
                <span>Baseline: <strong className="text-status-success font-medium">zod@3.23.8</strong></span>
                <span>Candidate: <strong className="text-status-error font-medium">zod@4.6.7</strong></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Demo Video Modal */}
      <DemoVideoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
}
