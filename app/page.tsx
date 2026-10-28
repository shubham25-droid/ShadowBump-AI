'use client';

import React from 'react';
import Link from 'next/link';
import Topology3D from '@/components/Topology3D';
import { 
  Play, 
  Layers, 
  ShieldAlert, 
  GitCompare, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Code2,
  FileSearch,
  BookOpen
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-xs font-mono text-sky-400">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping" />
            <span>Nebius x NVIDIA Global AI Hackathon Track: Coding & Agentic Engineering</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100">
            Catch Behavioral Changes{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">
              Before Production.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Software dependencies regularly alter runtime behavior across versions without failing builds or existing happy-path tests. 
            ShadowBump AI executes identical test vectors across isolated twin runtimes, detects observable behavioral divergences, and synthesizes root-cause evidence using NVIDIA Nemotron on Nebius Token Factory.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/workspace"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-all shadow-lg shadow-sky-600/20"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Launch Live Demonstration</span>
            </Link>

            <Link
              href="/methodology"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg border border-slate-700 bg-surface-card hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Read Methodology & Soundness</span>
            </Link>
          </div>
        </div>

        {/* 3D Pipeline Topology Section */}
        <div className="mt-16 sm:mt-20">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-200">
                Differential Testing Topology
              </h2>
              <p className="text-xs text-slate-400">
                Real-time interactive schematic of ShadowBump AI twin execution and evidence collection pipeline
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Interactive 3D Isometric View
            </span>
          </div>
          <Topology3D />
        </div>
      </section>

      {/* The Core Problem & Solution */}
      <section className="border-t border-surface-border bg-surface-200/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold mb-2">
              The Engineering Challenge
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-100">
              Why Dependency Upgrades Cause Silent Regressions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-surface-border bg-surface-card space-y-3">
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-slate-200 text-base">
                1. Test Coverage Blind Spots
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unit test suites routinely verify happy paths and basic validation. However, edge cases—such as NaN coercion, removed error accessor properties, or customized error strings—slip into production unnoticed.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-surface-border bg-surface-card space-y-3">
              <div className="h-10 w-10 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                <GitCompare className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-slate-200 text-base">
                2. Twin Differential Execution
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instead of guessing code changes from release notes, ShadowBump AI executes the identical test input against two isolated Node.js environments (baseline version vs candidate version) to capture empirical diffs.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-surface-border bg-surface-card space-y-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Cpu className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-slate-200 text-base">
                3. NVIDIA AI Root Cause Synthesis
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empirical diffs are packaged into structured evidence for NVIDIA Llama-3.1-Nemotron-70B on Nebius Token Factory. The model pinpoints breaking architectural changes, estimates blast radius, and generates migration diffs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What the User Receives */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <h2 className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold mb-2">
            Analysis Output Artifacts
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-100">
            What You Receive After an Analysis
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3">
            <div className="flex items-center space-x-2.5">
              <Code2 className="h-5 w-5 text-sky-400" />
              <h4 className="font-semibold text-slate-200">
                Side-by-Side AST & Error Diffs
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Examine exactly how return types, parsed objects, issue codes, and property structures changed between versions with zero ambiguity.
            </p>
            <div className="p-3 rounded-lg bg-surface-300 font-mono text-[11px] text-slate-300 border border-slate-800">
              <span className="text-emerald-400 block">// Baseline (v3): error.errors is defined Array(1)</span>
              <span className="text-rose-400 block">// Candidate (v4): error.errors is undefined (Crash Risk)</span>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3">
            <div className="flex items-center space-x-2.5">
              <Terminal className="h-5 w-5 text-emerald-400" />
              <h4 className="font-semibold text-slate-200">
                Deterministic Reproduction Snippets
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every identified behavioral divergence comes with a standalone, copy-pasteable script to reproduce the regression locally in your terminal or CI pipeline.
            </p>
            <div className="p-3 rounded-lg bg-surface-300 font-mono text-[11px] text-slate-300 border border-slate-800">
              <span className="text-slate-400 block">// Run locally</span>
              <span className="text-sky-300 block">npx ts-node reproduce-issue-tc2.ts</span>
            </div>
          </div>
        </div>

        {/* Start Demonstration CTA */}
        <div className="mt-14 p-8 rounded-2xl border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-surface-card to-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-slate-100 mb-1">
              Test Real-World Dependency Differences
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Experience the live controlled demonstration comparing Zod v3.23.8 against Zod v4.6.7 across custom error mapping, property access, and edge-case type coercion.
            </p>
          </div>
          <Link
            href="/workspace"
            className="shrink-0 inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-all shadow-md"
          >
            <span>Open Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
