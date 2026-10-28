'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Play, Cpu, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [hasNebiusKey, setHasNebiusKey] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setHasNebiusKey(data.aiProvider?.isConfigured ?? false);
      })
      .catch(() => setHasNebiusKey(false));
  }, []);

  const navItems = [
    { href: '/', label: 'Overview', icon: Layers },
    { href: '/workspace', label: 'Analysis Workspace', icon: Play },
    { href: '/methodology', label: 'Methodology & Soundness', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-surface-300/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 group-hover:border-sky-500 transition-colors">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold text-slate-100 tracking-tight text-base group-hover:text-sky-300 transition-colors">
                ShadowBump <span className="text-sky-400 font-mono text-sm">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 bg-slate-900">
                v1.0 MVP
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-sky-400 border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Provider Status & Action */}
        <div className="flex items-center space-x-3">
          {/* Nebius Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-400 px-2.5 py-1 rounded-full border border-slate-800 bg-slate-900/90">
            <Cpu className="h-3.5 w-3.5 text-sky-400" />
            <span>NVIDIA Nemotron via Nebius:</span>
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                hasNebiusKey === true
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                  : 'bg-amber-400'
              }`}
              title={hasNebiusKey ? 'Nebius API Key configured' : 'Using deterministic fallback (Key not set in env)'}
            />
            <span className="text-[11px] font-mono text-slate-300">
              {hasNebiusKey === true ? 'Active' : 'Deterministic Mode'}
            </span>
          </div>

          <Link
            href="/workspace"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Launch Analysis</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
