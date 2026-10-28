'use client';

import React from 'react';
import Link from 'next/link';
import Topology3D from '@/components/Topology3D';
import { 
  Play, 
  ShieldCheck, 
  GitCompare, 
  Cpu, 
  ArrowRight,
  Code2,
  Terminal,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="px-4 pt-14 pb-16 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-200 bg-sky-50 text-xs font-semibold text-sky-700">
            <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
            <span>Nebius x NVIDIA Global AI Hackathon (Coding Track)</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Catch Dependency Regressions{' '}
            <span className="text-sky-600">
              Before Production.
            </span>
          </h1>

          {/* Punchy Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upgrading dependencies can silently break error handling, property access, and type coercion even when all tests pass. 
            ShadowBump AI runs identical test inputs against twin runtime sandboxes and explains the differences with NVIDIA Nemotron on Nebius.
          </p>

          {/* Clean Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/workspace"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-all shadow-sm"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Test Zod v3 vs v4 Live</span>
            </Link>

            <Link
              href="/methodology"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors shadow-xs"
            >
              <span>Methodology & Soundness</span>
            </Link>
          </div>
        </div>

        {/* Simplified 3D Pipeline Topology */}
        <div className="mt-12">
          <Topology3D />
        </div>
      </section>

      {/* 3 Simple Value Columns */}
      <section className="border-t border-slate-200 bg-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
              Differential Engine
            </h2>
            <h3 className="text-2xl font-bold text-slate-900">
              How ShadowBump AI Protects You
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <GitCompare className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                1. Twin Sandbox Runtimes
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Executes the baseline version (<code className="font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">zod@3.23.8</code>) and candidate version (<code className="font-mono text-violet-700 bg-violet-50 px-1 py-0.5 rounded">zod@4.6.7</code>) in parallel, isolated child processes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                2. Deterministic AST Diffing
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compares output values, exception payloads, and property access like <code className="font-mono text-slate-700 bg-slate-200 px-1 py-0.5 rounded">error.errors</code> without relying on AI guesswork.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
                <Cpu className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                3. NVIDIA Nemotron AI
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Synthesizes the empirical diff through Nebius Token Factory, explaining the root cause, blast radius, and exact migration code fix.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Callout Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="p-8 rounded-2xl border border-slate-200 bg-gradient-to-r from-sky-50 via-white to-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Ready to test real dependency behavioral changes?
            </h3>
            <p className="text-xs text-slate-600 max-w-lg">
              Run the verified Zod v3 vs v4 suite: dropped custom errors, removed <code className="font-mono text-slate-800">error.errors</code> property, and NaN coercion.
            </p>
          </div>
          <Link
            href="/workspace"
            className="shrink-0 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-all shadow-sm"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
