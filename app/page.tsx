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
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-8 pb-4 overflow-hidden">
        {/* Subtle Ambient Top Grey Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-zinc-500/10 via-slate-500/8 to-zinc-400/8 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
          {/* Hackathon Track Tag */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-850/80 backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-zinc-400 animate-ping" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-300 font-mono">
              Nebius Token Factory × NVIDIA Nemotron • Hackathon Track: Coding & Agentic Engineering
            </span>
          </div>

          {/* Master Headline (Titanium Silver Shimmer) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Catch Behavioral Changes{' '}
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Before Production.
            </span>
          </h1>

          {/* Subtitle with High Readability */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-zinc-300 leading-relaxed font-normal">
            Dependencies silently mutate behavior across versions even when your test suites pass. 
            ShadowBump AI executes identical test vectors inside <strong className="text-white font-semibold">isolated twin runtime sandboxes</strong>, detects observable AST divergences, and explains regressions with <strong className="text-zinc-100 font-semibold">NVIDIA Nemotron-70B on Nebius</strong>.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/workspace"
              className="inline-flex items-center space-x-3 px-7 py-3.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-base font-bold transition-all shadow-sm hover:shadow-glowGrey transform hover:-translate-y-0.5"
            >
              <Zap className="h-5 w-5 fill-current" />
              <span>Launch Twin Analysis</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>

            <a
              href="#topology-section"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl border border-zinc-700 bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-base font-semibold transition-all hover:border-zinc-500"
            >
              <Layers className="h-5 w-5 text-zinc-400" />
              <span>Explore 3D Pipeline</span>
            </a>
          </div>

          {/* Live System Spec Badges */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-xl border border-zinc-750 bg-zinc-850/80 backdrop-blur-md">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">Target Package</span>
              <span className="text-base font-bold text-white font-mono mt-0.5 block">zod (v3.23.8 vs v4.6.7)</span>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-750 bg-zinc-850/80 backdrop-blur-md">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">Runtime Sandbox</span>
              <span className="text-base font-bold text-white font-mono mt-0.5 block">Isolated Subprocesses</span>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-750 bg-zinc-850/80 backdrop-blur-md">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">Differential Engine</span>
              <span className="text-base font-bold text-white font-mono mt-0.5 block">Deterministic AST Diff</span>
            </div>
            <div className="p-3.5 rounded-xl border border-zinc-750 bg-zinc-850/80 backdrop-blur-md">
              <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider block">Synthesis Model</span>
              <span className="text-base font-bold text-white font-mono mt-0.5 block">NVIDIA Nemotron 70B</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3D TOPOLOGY SECTION */}
      <section id="topology-section" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
              <span>Full Interactive Execution Topology</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              3D WebGL Differential Execution Architecture
            </h2>
            <p className="text-base text-zinc-400 mt-1 max-w-2xl">
              Rotate, zoom, and click any node to inspect how test inputs are duplicated, dispatched to twin isolated Node.js engines, evaluated mathematically, and explained.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/workspace"
              className="text-sm font-semibold text-zinc-200 hover:text-white inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-zinc-500 transition-all"
            >
              <span>Test Live in Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 3D WebGL Canvas Component */}
        <InsaneTopology3D />
      </section>

      {/* EMPIRICAL BREAKING CHANGE DEMONSTRATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-zinc-750 bg-gradient-to-b from-[#181a23] via-[#121319] to-[#181a23] p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-750 gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                <ShieldAlert className="h-4 w-4 text-zinc-400" />
                Empirically Verified Breaking Change
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Zod v3 to v4 Silent Regression: Dropped Custom Error & Deprecated .errors Property
              </h3>
            </div>
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 text-sm text-zinc-200 hover:text-white font-semibold px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-zinc-500 transition-colors"
            >
              <span>Run Scenario in Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Test Input Vector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono font-semibold text-zinc-300">
                Synchronized Test Input (Missing required <code className="text-zinc-100">username</code> field):
              </span>
              <span className="text-xs font-mono text-zinc-400">Payload streamed to both runtimes</span>
            </div>
            <pre className="p-4 rounded-xl border border-zinc-800 bg-[#0d0e12] font-mono text-sm text-zinc-200 overflow-x-auto shadow-inner">
              <code>{JSON.stringify({ email: "alex@engineering.org", age: 29 }, null, 2)}</code>
            </pre>
          </div>

          {/* Twin Subprocess Comparison Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Baseline (v3) */}
            <div className="p-5 rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/15 via-zinc-850 to-zinc-900 space-y-3 shadow-panel">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-750">
                <div>
                  <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-bold">Baseline Runtime</span>
                  <div className="text-base font-bold text-white font-mono mt-0.5">zod@3.23.8</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                  CUSTOM ERROR HONORED
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-mono text-zinc-400 block">Reported Error Message:</span>
                <div className="p-3 rounded-lg bg-[#0d0e12] border border-zinc-800 text-emerald-300 font-mono text-sm font-bold">
                  &quot;Username is required&quot;
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-mono text-zinc-400 block">Object Property Access:</span>
                <div className="p-2.5 rounded-lg bg-[#0d0e12] border border-zinc-800 text-xs font-mono text-zinc-200">
                  <code>error.errors</code>: <strong className="text-emerald-400">Array(1) [Valid]</strong>
                </div>
              </div>
            </div>

            {/* Candidate (v4) */}
            <div className="p-5 rounded-xl border border-rose-500/30 bg-gradient-to-b from-rose-950/15 via-zinc-850 to-zinc-900 space-y-3 shadow-panel">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-750">
                <div>
                  <span className="text-xs font-mono uppercase text-rose-400 tracking-wider font-bold">Candidate Runtime</span>
                  <div className="text-base font-bold text-white font-mono mt-0.5">zod@4.6.7</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold animate-pulse">
                  CRITICAL REGRESSION
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-mono text-zinc-400 block">Reported Error Message:</span>
                <div className="p-3 rounded-lg bg-[#0d0e12] border border-zinc-800 text-rose-300 font-mono text-sm font-bold">
                  &quot;Invalid input: expected string, received undefined&quot;
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-mono text-zinc-400 block">Object Property Access:</span>
                <div className="p-2.5 rounded-lg bg-[#0d0e12] border border-zinc-800 text-xs font-mono text-rose-300">
                  <code>error.errors</code>: <strong className="text-rose-400">undefined (Throws TypeError in production)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* AI Root Cause Synthesis Card */}
          <div className="p-5 rounded-xl border border-zinc-700 bg-gradient-to-r from-zinc-850 via-[#181a23] to-zinc-850 space-y-3">
            <div className="flex items-center space-x-2 text-zinc-200 font-bold text-sm">
              <Cpu className="h-4 w-4 text-zinc-400" />
              <span>NVIDIA Nemotron-70B Root Cause Synthesis (via Nebius Token Factory):</span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Zod 4 overhauled error map parameter structures. The legacy <code className="text-amber-300 font-mono">{`{ required_error: "..." }`}</code> option is silently ignored, causing error messaging to fall back to generic schema error messages. Furthermore, <code className="text-rose-400 font-mono">error.errors</code> has been deprecated in favor of <code className="text-zinc-100 font-mono">error.issues</code>. Downstream code relying on <code className="text-zinc-200 font-mono">error.errors.map(...)</code> will crash with an unhandled TypeError.
            </p>
          </div>
        </div>
      </section>

      {/* 4 SCENARIOS QUICK BENCHMARK GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold">Empirical Test Battery</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Explore 4 Real Dependency Scenarios
          </h2>
          <p className="text-base text-zinc-400 mt-1 max-w-2xl">
            Each scenario is tested against live isolated child processes with deterministic assertions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SCENARIOS.map((sc, idx) => (
            <Link
              key={sc.id}
              href={`/workspace`}
              className="group p-6 rounded-2xl border border-zinc-800 bg-[#161821]/80 hover:bg-[#1c1f2b] hover:border-zinc-650 transition-all shadow-card flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                    Scenario {idx + 1} • {sc.breakingCategory}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {sc.testCases.length} Vectors
                  </span>
                </div>

                <h4 className="text-lg font-bold text-white group-hover:text-zinc-200 transition-colors flex items-center justify-between">
                  <span>{sc.title}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                </h4>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  {sc.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-750 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Baseline: <strong className="text-emerald-400">zod@3.23.8</strong></span>
                <span>Candidate: <strong className="text-rose-400">zod@4.6.7</strong></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CORE ARCHITECTURE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-[#161821]/80 space-y-3 shadow-panel">
            <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Twin Sandbox Isolation</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Subprocesses run baseline and candidate dependencies in strictly quarantined Node.js sandboxes. Clean env variables, memory bounds, and 5-second watchdog timers prevent cross-contamination.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-[#161821]/80 space-y-3 shadow-panel">
            <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <GitCompare className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Deterministic AST Oracle</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Outputs, schema validations, and property mutations are compared with zero AI hallucination. Deep structural diffs classify differences into 4 rigorous tiers before any LLM is queried.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-[#161821]/80 space-y-3 shadow-panel">
            <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">NVIDIA Nemotron on Nebius</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              When differences are observed, NVIDIA Llama-3.1-Nemotron-70B via Nebius Token Factory analyzes the exact AST diff to provide actionable migration code, blast radius assessment, and root cause diagnosis.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
