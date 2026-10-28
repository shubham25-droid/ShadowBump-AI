import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ExternalLink, GitBranch, Cpu, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-300 py-10 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          {/* Col 1 */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-sky-400" />
              <span className="font-semibold text-slate-200">ShadowBump AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A high-precision differential testing harness designed to surface silent behavioral changes, breaking error structures, and type coercion regressions before software dependency bumps reach production.
            </p>
            <div className="mt-4 flex items-center space-x-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-800 bg-slate-900/60 font-mono text-[11px]">
                <Cpu className="h-3 w-3 text-sky-400" /> Nebius Token Factory
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-800 bg-slate-900/60 font-mono text-[11px]">
                <Terminal className="h-3 w-3 text-emerald-400" /> NVIDIA Nemotron-70B
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Engine & Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/workspace" className="hover:text-slate-200 transition-colors">
                  Zod v3 vs v4 Suite
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-slate-200 transition-colors">
                  Soundness & Oracle Theory
                </Link>
              </li>
              <li>
                <Link href="/methodology#isolation" className="hover:text-slate-200 transition-colors">
                  Twin Sandbox Isolation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Hackathon Track
            </h4>
            <p className="text-xs text-slate-400 mb-2 leading-relaxed">
              Nebius x NVIDIA Global AI Hackathon (Coding and Agentic Engineering).
            </p>
            <a
              href="https://nebiusglobalaihackathon.devpost.com/rules"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-sky-400 hover:text-sky-300 transition-colors gap-1"
            >
              <span>Devpost Official Rules</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div>
            © {new Date().getFullYear()} ShadowBump AI. Released under the Apache 2.0 Open Source License.
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Empirically Verified Differential Testing</span>
            <span>•</span>
            <Link href="/methodology" className="hover:text-slate-300">
              Limitations
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
