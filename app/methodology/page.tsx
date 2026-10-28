import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ShieldAlert, 
  GitCompare, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Lock,
  ArrowRight
} from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="border-b border-surface-border pb-6">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">
            Technical Specification & Soundness
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-1">
          Differential Testing Methodology
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          How ShadowBump AI detects silent behavioral changes between software dependency versions, addresses the oracle problem, and leverages NVIDIA open-source models via Nebius.
        </p>
      </div>

      {/* Section 1: The Core Problem */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-sky-400" />
          1. The Dependency Upgrade Dilemma
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          In modern software engineering, automated unit and integration tests serve as guardians against regressions. However, tests inherently exercise only the specific paths developers thought to assert. When a library updates—such as migrating from <strong>Zod v3 to Zod v4</strong>—subtle behavioral changes occur:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-lg border border-slate-800 bg-surface-card">
            <h4 className="font-semibold text-slate-200 mb-1">Parameter Deprecation</h4>
            <p className="text-slate-400">
              Options like <code className="text-amber-300 font-mono">required_error</code> are silently ignored in v4 without throwing build-time type errors.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-slate-800 bg-surface-card">
            <h4 className="font-semibold text-slate-200 mb-1">Interface Property Removal</h4>
            <p className="text-slate-400">
              <code className="text-rose-300 font-mono">error.errors</code> is replaced by <code className="text-emerald-300 font-mono">error.issues</code>. Downstream code calling <code className="font-mono">.errors.map()</code> crashes with unhandled TypeError.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-slate-800 bg-surface-card">
            <h4 className="font-semibold text-slate-200 mb-1">Coercion Semantics</h4>
            <p className="text-slate-400">
              Error phrasing and type identification change (e.g. <code className="font-mono">&quot;nan&quot;</code> vs <code className="font-mono">&quot;NaN&quot;</code>).
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Difference vs Defect */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-emerald-400" />
          2. Distinguishing Behavioral Difference from Defect
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          A fundamental principle of differential testing is that <strong>a difference in observable output is not automatically a bug</strong>. Libraries frequently intentionally modernize error phrasings, performance characteristics, or tree-shaking APIs.
        </p>

        <div className="p-5 rounded-xl border border-surface-border bg-surface-card space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            ShadowBump AI Four-Tier Classification Matrix
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <strong>MATCH:</strong> Identical parsed output, identical validation success boolean, and identical error codes across both runtime environments.
              </div>
            </div>

            <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <strong>BEHAVIORAL_DIFFERENCE:</strong> Observable change in error phrasing or output formatting, but no contract or oracle violation detected.
              </div>
            </div>

            <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <strong>POTENTIAL_REGRESSION:</strong> Success/failure status inversion, removal of a required property (e.g. <code className="font-mono">error.errors</code>), discarded custom error strings, or direct violation of an explicit test oracle.
              </div>
            </div>

            <div className="p-2.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-300 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <strong>EXECUTION_ERROR:</strong> Subprocess crashed, exceeded the 5,000ms timeout guard, or threw an unhandled internal runtime exception.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Isolation Architecture */}
      <section id="isolation" className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Lock className="h-5 w-5 text-amber-400" />
          3. Twin Sandbox Isolation & Security Boundary
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Executing dependency code requires rigorous containment to prevent prototype pollution, memory leaks, and credential leakage:
        </p>

        <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-300">
          <li>
            <strong>Separate Node.js Processes:</strong> The baseline and candidate versions are installed in completely isolated directories (<code className="text-sky-300 font-mono">environments/v3</code> and <code className="text-violet-300 font-mono">environments/v4</code>) with independent <code className="font-mono">node_modules</code>.
          </li>
          <li>
            <strong>Environment Sanitization:</strong> Subprocesses are spawned with stripped environment variables (<code className="font-mono">NODE_ENV: &apos;test&apos;</code>), ensuring zero application secrets or Nebius tokens are accessible to the runner.
          </li>
          <li>
            <strong>Deterministic Stdin Stream:</strong> Payloads are serialized as JSON over standard input; no temporary files or shared memory states are created between runs.
          </li>
          <li>
            <strong>Timeouts & Resource Guards:</strong> Child processes are terminated forcefully after 5,000ms to mitigate accidental infinite loops.
          </li>
        </ul>
      </section>

      {/* Section 4: Nebius & NVIDIA Open-Source Model */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Cpu className="h-5 w-5 text-sky-400" />
          4. Nebius Token Factory & NVIDIA Nemotron Integration
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          ShadowBump AI connects to Nebius Token Factory using an OpenAI-compatible interface querying <strong>nvidia/Llama-3.1-Nemotron-70B-Instruct-HF</strong>.
        </p>

        <div className="p-4 rounded-xl border border-sky-500/20 bg-slate-900/80 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] border-b border-slate-800 pb-2">
            <span>Endpoint: https://api.tokenfactory.nebius.com/v1/chat/completions</span>
            <span>Temperature: 0.1</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            The AI model receives only the <strong>smallest useful empirical evidence package</strong> (scenario schema snippet, exact input vector, version old result, and version new result). It does not replace the deterministic diff engine; rather, it synthesizes the root cause, evaluates blast radius, and generates a concrete migration code snippet.
          </p>
        </div>
      </section>

      {/* Section 5: Limitations */}
      <section className="space-y-4 border-t border-surface-border pt-8">
        <h2 className="text-xl font-bold text-slate-100">
          5. Soundness & Scientific Limitations
        </h2>
        <div className="p-4 rounded-xl border border-slate-800 bg-surface-card space-y-2 text-xs text-slate-300">
          <p className="leading-relaxed">
            • <strong>No Difference ≠ Guarantee of Correctness:</strong> If a test corpus of 20 vectors produces zero differences, it proves only that the two dependency versions behaved identically for those specific 20 vectors under the tested runtime.
          </p>
          <p className="leading-relaxed">
            • <strong>Input Coverage Bound:</strong> Differential testing effectiveness is bounded by the quality and diversity of the input test vectors.
          </p>
          <p className="leading-relaxed">
            • <strong>Environment Scope:</strong> The MVP currently isolates TypeScript/Node.js dependencies (specifically Zod v3 vs v4). Arbitrary repositories or untrusted multi-language packages require additional containerization before execution.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="pt-4 flex items-center justify-between">
        <Link
          href="/workspace"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-all shadow-md"
        >
          <span>Run Differential Verification</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
