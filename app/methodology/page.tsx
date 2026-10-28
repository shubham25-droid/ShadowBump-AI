import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  GitCompare, 
  Cpu, 
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Bug,
  Server,
  Zap
} from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Page Title */}
      <div className="border-b border-border/80 pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Soundness & Scientific Design</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Methodology & Architecture
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
          How ShadowBump AI reliably isolates dependency behavioral regressions using twin runtime sandboxes and NVIDIA open-source intelligence on Nebius.
        </p>
      </div>

      {/* 1. The Core Problem */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            1. The Silent Regression Problem
          </h2>
        </div>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Standard test suites only assert anticipated code paths. When upgrading dependencies (such as migrating from <strong className="text-white">Zod v3 to Zod v4</strong>), breaking changes often compile cleanly and pass existing unit tests while silently failing in production:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl border border-border/80 bg-panel/80 shadow-panel space-y-2">
            <span className="font-bold text-white text-sm block">Custom Option Deprecation</span>
            <p className="text-slate-300 text-xs leading-relaxed">
              <code className="text-amber-400 font-mono">{`{ required_error }`}</code> is silently ignored in Zod v4 without compiler warnings, falling back to generic error strings.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-border/80 bg-panel/80 shadow-panel space-y-2">
            <span className="font-bold text-white text-sm block">Interface Property Removal</span>
            <p className="text-slate-300 text-xs leading-relaxed">
              <code className="text-rose-400 font-mono">error.errors</code> is deprecated in favor of <code className="text-emerald-400 font-mono">.issues</code>, breaking downstream <code className="font-mono text-slate-300">.errors.map()</code> with unhandled TypeErrors.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-border/80 bg-panel/80 shadow-panel space-y-2">
            <span className="font-bold text-white text-sm block">Coercion Semantics Shift</span>
            <p className="text-slate-300 text-xs leading-relaxed">
              Date and NaN parsing format issue strings differently (<code className="font-mono text-cyan-300">&quot;nan&quot;</code> vs <code className="font-mono text-cyan-300">&quot;NaN&quot;</code>), breaking string-matching error handlers.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Difference vs Defect */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <GitCompare className="h-5 w-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            2. Difference vs Defect (The Oracle Problem)
          </h2>
        </div>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          A behavioral difference is not automatically a bug. Libraries modernize API shapes intentionally. ShadowBump AI uses a deterministic 4-tier taxonomy before querying any AI:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
            <span className="font-bold text-emerald-400 font-mono text-sm flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              MATCH
            </span>
            <p className="text-slate-300 text-xs leading-relaxed">Identical output values, validation status, and issue codes across both baseline and candidate.</p>
          </div>
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-1">
            <span className="font-bold text-amber-400 font-mono text-sm flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              BEHAVIORAL DIFFERENCE
            </span>
            <p className="text-slate-300 text-xs leading-relaxed">Observable changes in error phrasing or output structure that do not violate an explicit contract.</p>
          </div>
          <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 space-y-1">
            <span className="font-bold text-rose-400 font-mono text-sm flex items-center gap-1.5">
              <XCircle className="h-4 w-4" />
              POTENTIAL REGRESSION
            </span>
            <p className="text-slate-300 text-xs leading-relaxed">Validation status flipped, missing properties (<code className="font-mono text-rose-300">error.errors</code>), or dropped custom messages.</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-canvas space-y-1">
            <span className="font-bold text-slate-300 font-mono text-sm flex items-center gap-1.5">
              <Bug className="h-4 w-4 text-slate-400" />
              EXECUTION ERROR
            </span>
            <p className="text-slate-300 text-xs leading-relaxed">Subprocess crashed, timed out (5s limit), or threw an unhandled internal exception.</p>
          </div>
        </div>
      </section>

      {/* 3. Sandbox Isolation */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            3. Twin Sandbox Isolation Boundary
          </h2>
        </div>
        <div className="p-6 rounded-2xl border border-border/80 bg-panel/80 shadow-panel space-y-3 text-sm text-slate-300">
          <div className="flex items-start gap-3">
            <span className="h-2 w-2 rounded-full bg-cyan-400 mt-2 shrink-0" />
            <div>
              <strong className="text-white block">Quarantined Directories & Runtimes:</strong>
              Baseline (<code className="text-emerald-400 font-mono">zod@3.23.8</code>) and candidate (<code className="text-rose-400 font-mono">zod@4.6.7</code>) reside in separate physical disk folders with isolated <code className="font-mono text-slate-400">node_modules</code>.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="h-2 w-2 rounded-full bg-cyan-400 mt-2 shrink-0" />
            <div>
              <strong className="text-white block">Sanitized Subprocess Execution:</strong>
              Subprocesses are spawned via child processes with zero host credentials, no API keys forwarded, and restricted environmental context.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="h-2 w-2 rounded-full bg-cyan-400 mt-2 shrink-0" />
            <div>
              <strong className="text-white block">5,000ms Watchdog Protection:</strong>
              Every execution has a hard watchdog timer killing rogue processes, preventing infinite loops or memory leaks from blocking analysis.
            </div>
          </div>
        </div>
      </section>

      {/* 4. Nebius & NVIDIA */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Cpu className="h-5 w-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            4. NVIDIA Nemotron on Nebius Token Factory
          </h2>
        </div>
        <div className="p-6 rounded-2xl border border-border/80 bg-panel/80 shadow-panel space-y-3 text-sm text-slate-300">
          <p className="leading-relaxed">
            ShadowBump AI connects to Nebius Token Factory querying <strong className="text-white font-mono">nvidia/Llama-3.1-Nemotron-70B-Instruct-HF</strong>.
          </p>
          <p className="leading-relaxed text-xs sm:text-sm">
            The model receives strictly the minimal empirical diff evidence (schema code, executed test input, and twin AST outputs). It does not replace the deterministic comparator; instead, it synthesizes root causes, estimates blast radius, and provides precise Before/After code fixes.
          </p>
        </div>
      </section>

      {/* 5. Soundness & Scientific Limitations */}
      <section className="space-y-4 border-t border-border/80 pt-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          5. Soundness & Scientific Limitations
        </h2>
        <div className="p-6 rounded-2xl border border-border/80 bg-canvas space-y-3 text-sm text-slate-300 leading-relaxed">
          <p>
            • <strong className="text-white">Tested Equivalence ≠ Global Proof:</strong> If an input corpus shows zero differences, it proves only that the specific inputs evaluated produced identical output under the test harness. Untested inputs may still diverge.
          </p>
          <p>
            • <strong className="text-white">Oracle Specification:</strong> Distinguishing intentional library evolutions from unintended defects requires explicit oracle rules or human engineering judgment.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="pt-4 flex items-center justify-between">
        <Link
          href="/workspace"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white text-sm font-bold transition-all shadow-glow hover:shadow-[0_0_30px_rgba(56,189,248,0.4)]"
        >
          <span>Open Differential Workspace</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
