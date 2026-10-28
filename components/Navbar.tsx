'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Play, Cpu, BookOpen, Layers } from 'lucide-react';

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
    { href: '/workspace', label: 'Workspace', icon: Play },
    { href: '/methodology', label: 'Methodology', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 border border-sky-200 text-sky-600 group-hover:bg-sky-100 transition-colors">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-base group-hover:text-sky-600 transition-colors">
                ShadowBump
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded font-semibold">
                AI
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
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-sky-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status Pill & Action */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50">
            <Cpu className="h-3.5 w-3.5 text-sky-600" />
            <span className="font-medium">NVIDIA Nemotron:</span>
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                hasNebiusKey === true
                  ? 'bg-emerald-500'
                  : 'bg-amber-500'
              }`}
            />
            <span className="font-mono text-[11px] text-slate-500">
              {hasNebiusKey === true ? 'Connected' : 'Deterministic Mode'}
            </span>
          </div>

          <Link
            href="/workspace"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-all shadow-sm"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Start Analysis</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
