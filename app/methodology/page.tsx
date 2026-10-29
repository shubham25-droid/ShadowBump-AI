import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  GitCompare, 
  Cpu, 
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Bug,
  Server
} from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Title */}
      <div className="border-b border-line pb-4">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-ink-primary">
          Methodology & Soundness
        </h1>
        <p className="text-xs sm:text-sm text-ink-secondary mt-1 max-w-xl leading-relaxed">
          How ShadowBump AI reliably detects dependency behavioral regressions and leverages NVIDIA open-source models via Nebius.
        </p>
      </div>

      {/* 1. The Core Problem */}
      <section className="space-y-3">
        <h2 className="font-heading text-sm sm:text-base font-bold text-ink-primary flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-accent" />
          1. The Silent Regression Problem
        </h2>
        <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
          Standard test suites only assert anticipated code paths. When upgrading dependencies (such as migrating from <strong>Zod v3 to Zod v4</strong>), breaking changes often pass build steps while silently failing in production:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-card border border-line bg-card shadow-card">
            <span className="font-heading font-bold text-ink-primary block mb-1">Option Deprecation</span>
            <p className="text-ink-secondary text-[11px] leading-relaxed">
              <code className="text-status-warning font-mono font-semibold">required_error</code> is discarded in v4 without throwing compile errors, falling back to generic phrasing.
            </p>
          </div>
          <div className="p-3.5 rounded-card border border-line bg-card shadow-card">
            <span className="font-heading font-bold text-ink-primary block mb-1">Property Removal</span>
            <p className="text-ink-secondary text-[11px] leading-relaxed">
              <code className="text-status-error font-mono font-semibold">error.errors</code> is replaced by <code className="text-status-success font-mono font-semibold">.issues</code>, causing downstream runtime TypeErrors.
            </p>
          </div>
          <div className="p-3.5 rounded-card border border-line bg-card shadow-card">
            <span className="font-heading font-bold text-ink-primary block mb-1">Coercion Semantics</span>
            <p className="text-ink-secondary text-[11px] leading-relaxed">
              Date and NaN parsing format issue strings differently (<code className="font-mono text-ink-primary">&quot;nan&quot;</code> vs <code className="font-mono text-ink-primary">&quot;NaN&quot;</code>).
            </p>
          </div>
        </div>
      </section>

      {/* 2. Difference vs Defect */}
      <section className="space-y-3">
        <h2 className="font-heading text-sm sm:text-base font-bold text-ink-primary flex items-center gap-2">
          <GitCompare className="h-4 w-4 text-status-success" />
          2. Difference vs Defect (The Oracle Problem)
        </h2>
        <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
          A behavioral difference is not automatically a bug. Libraries intentionally modernize APIs and error phrasing. ShadowBump AI categorizes outcomes into four explicit tiers:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-card border border-[#C3E6CB] bg-[#EAF5EC]">
            <span className="font-bold text-status-success block mb-0.5 font-mono">● MATCH</span>
            <p className="text-ink-primary text-[11px]">Identical output values, validation status, and issue codes across both versions.</p>
          </div>
          <div className="p-3 rounded-card border border-[#FAD7A0] bg-[#FEF9E7]">
            <span className="font-bold text-status-warning block mb-0.5 font-mono">● BEHAVIORAL DIFFERENCE</span>
            <p className="text-ink-primary text-[11px]">Observable changes in error phrasing or output structure that do not violate an explicit contract.</p>
          </div>
          <div className="p-3 rounded-card border border-[#F5C6CB] bg-[#FDEDEC]">
            <span className="font-bold text-status-error block mb-0.5 font-mono">● POTENTIAL REGRESSION</span>
            <p className="text-ink-primary text-[11px]">Validation status flipped, missing properties (<code className="font-mono font-semibold">error.errors</code>), or dropped custom messages.</p>
          </div>
          <div className="p-3 rounded-card border border-line bg-hero">
            <span className="font-bold text-ink-primary block mb-0.5 font-mono">● EXECUTION ERROR / INCONCLUSIVE</span>
            <p className="text-ink-secondary text-[11px]">Subprocess crashed, timed out (5,000ms limit), or threw an unhandled internal exception.</p>
          </div>
        </div>
      </section>

      {/* 3. Sandbox Isolation */}
      <section className="space-y-3">
        <h2 className="font-heading text-sm sm:text-base font-bold text-ink-primary flex items-center gap-2">
          <Lock className="h-4 w-4 text-accent" />
          3. Twin Sandbox Isolation Boundary
        </h2>
        <div className="p-4 rounded-card border border-line bg-card shadow-card space-y-2 text-xs text-ink-secondary">
          <div className="flex items-start gap-2">
            <span className="font-mono text-accent font-bold">•</span>
            <span><strong>Separate Directories:</strong> Baseline (<code className="text-status-success font-mono font-semibold">zod@3.23.8</code>) and candidate (<code className="text-status-error font-mono font-semibold">zod@4.6.7</code>) are installed in independent folders with isolated <code className="font-mono">node_modules</code>.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-mono text-accent font-bold">•</span>
            <span><strong>Sanitized Environment:</strong> Subprocesses are spawned without host credentials or forwarded API keys (<code className="font-mono">NODE_ENV: &apos;test&apos;</code>).</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-mono text-accent font-bold">•</span>
            <span><strong>Execution Timeouts:</strong> Subprocesses are forcefully terminated after 5,000ms to eliminate infinite loop risks.</span>
          </div>
        </div>
      </section>

      {/* 4. Nebius & NVIDIA */}
      <section className="space-y-3">
        <h2 className="font-heading text-sm sm:text-base font-bold text-ink-primary flex items-center gap-2">
          <Cpu className="h-4 w-4 text-accent" />
          4. NVIDIA Nemotron & Nebius Token Factory
        </h2>
        <div className="p-4 rounded-card border border-line bg-card shadow-card space-y-1.5 text-xs text-ink-secondary">
          <p className="leading-relaxed">
            ShadowBump AI connects to Nebius Token Factory querying <strong>nvidia/Llama-3.1-Nemotron-70B-Instruct-HF</strong>.
          </p>
          <p className="leading-relaxed text-[11px]">
            The model receives only the minimal empirical evidence package (schema snippet, failing test vector, v3 vs v4 AST output). It does not replace the deterministic diff engine; rather, it synthesizes the root cause and provides a concrete migration code fix.
          </p>
        </div>
      </section>

      {/* 5. Scientific Limitations */}
      <section className="space-y-3 border-t border-line pt-6">
        <h2 className="font-heading text-sm sm:text-base font-bold text-ink-primary">
          5. Soundness & Scientific Limitations
        </h2>
        <div className="p-4 rounded-card border border-line bg-card shadow-card space-y-2 text-xs text-ink-secondary">
          <p className="leading-relaxed">
            • <strong>No Difference Observed ≠ Proof of Full Correctness:</strong> If a test corpus produces zero differences, it establishes only that the tested inputs behaved identically under the tested runtime. Untested edge cases may still diverge.
          </p>
          <p className="leading-relaxed">
            • <strong>Oracle Dependency:</strong> Distinguishing intentional changes from true defects requires an explicit expectation or oracle specification.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="pt-2 flex items-center justify-between">
        <Link
          href="/workspace"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-button bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-all shadow-sm"
        >
          <span>Open Analysis Workspace</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
