import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  GitCompare, 
  Cpu, 
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Methodology & Soundness
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
          How ShadowBump AI reliably detects dependency behavioral regressions and leverages NVIDIA models via Nebius.
        </p>
      </div>

      {/* 1. The Core Problem */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-sky-600" />
          1. The Silent Regression Problem
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Standard test suites only check anticipated code paths. When upgrading from <strong>Zod v3 to Zod v4</strong>, breaking changes often pass tests while silently failing in production:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
            <span className="font-bold text-slate-800 block mb-1">Option Deprecation</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              <code className="text-amber-700 font-mono">required_error</code> is ignored in v4 without throwing compile errors.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
            <span className="font-bold text-slate-800 block mb-1">Property Removal</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              <code className="text-rose-700 font-mono">error.errors</code> is replaced by <code className="text-emerald-700 font-mono">.issues</code>, causing downstream runtime TypeErrors.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
            <span className="font-bold text-slate-800 block mb-1">Coercion Semantics</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Date and NaN parsing format issue strings differently (<code className="font-mono">&quot;nan&quot;</code> vs <code className="font-mono">&quot;NaN&quot;</code>).
            </p>
          </div>
        </div>
      </section>

      {/* 2. Difference vs Defect */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <GitCompare className="h-4 w-4 text-emerald-600" />
          2. Difference vs Defect (The Oracle Problem)
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          A behavioral difference is not automatically a bug. ShadowBump AI categorizes outcomes into four explicit tiers:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
            <span className="font-bold text-emerald-800 block mb-0.5">● MATCH</span>
            <p className="text-emerald-950 text-[11px]">Identical output values, validation status, and issue codes across both versions.</p>
          </div>
          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50">
            <span className="font-bold text-amber-800 block mb-0.5">● BEHAVIORAL DIFFERENCE</span>
            <p className="text-amber-950 text-[11px]">Observable changes in error phrasing or output structure that do not violate an explicit contract.</p>
          </div>
          <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50">
            <span className="font-bold text-rose-800 block mb-0.5">● POTENTIAL REGRESSION</span>
            <p className="text-rose-950 text-[11px]">Validation status flipped, missing properties (<code className="font-mono">error.errors</code>), or dropped custom messages.</p>
          </div>
          <div className="p-3 rounded-xl border border-violet-200 bg-violet-50/50">
            <span className="font-bold text-violet-800 block mb-0.5">● EXECUTION ERROR</span>
            <p className="text-violet-950 text-[11px]">Subprocess crashed, timed out, or threw an unhandled internal exception.</p>
          </div>
        </div>
      </section>

      {/* 3. Sandbox Isolation */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Lock className="h-4 w-4 text-amber-600" />
          3. Twin Sandbox Isolation Boundary
        </h2>
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <span className="font-mono text-sky-600 font-bold">•</span>
            <span><strong>Separate Directories:</strong> Baseline (`zod@3.23.8`) and candidate (`zod@4.6.7`) are installed in independent folders with isolated `node_modules`.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-mono text-sky-600 font-bold">•</span>
            <span><strong>Sanitized Environment:</strong> Subprocesses are spawned without host credentials or Nebius API keys (`NODE_ENV: &apos;test&apos;`).</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-mono text-sky-600 font-bold">•</span>
            <span><strong>Execution Timeouts:</strong> Subprocesses are forcefully terminated after 5,000ms to eliminate infinite loop risks.</span>
          </div>
        </div>
      </section>

      {/* 4. Nebius & NVIDIA */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-sky-600" />
          4. NVIDIA Nemotron & Nebius Token Factory
        </h2>
        <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 space-y-1.5 text-xs text-slate-700">
          <p className="leading-relaxed">
            ShadowBump AI connects to Nebius Token Factory at <code className="font-mono text-sky-800">https://api.tokenfactory.nebius.com/v1</code> querying <strong>nvidia/Llama-3.1-Nemotron-70B-Instruct-HF</strong>.
          </p>
          <p className="leading-relaxed text-[11px] text-slate-600">
            The model receives only the minimal empirical evidence package (schema snippet, failing test vector, v3 vs v4 AST output). It does not replace the deterministic diff engine; rather, it synthesizes the root cause and provides a concrete migration code fix.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="pt-2 flex items-center justify-between">
        <Link
          href="/workspace"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-sm"
        >
          <span>Open Analysis Workspace</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
