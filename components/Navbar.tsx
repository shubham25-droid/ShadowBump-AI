'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';
import { Play, Cpu, Layers, BookOpen } from 'lucide-react';

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
    <header className="sticky top-0 z-50 border-b border-border bg-[#07090e]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center group">
          <BrandLogo size={32} glow={true} />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-300 font-semibold'
                    : 'text-ink-secondary hover:text-white hover:bg-panel'
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
          <div className="hidden lg:flex items-center space-x-2 text-xs text-ink-secondary px-3 py-1.5 rounded-full border border-border bg-panel shadow-sm">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>NVIDIA Nemotron:</span>
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                hasNebiusKey === true
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : 'bg-amber-400'
              }`}
            />
            <span className="font-mono text-white text-[11px]">
              {hasNebiusKey === true ? 'Nebius Active' : 'Deterministic Mode'}
            </span>
          </div>

          <Link
            href="/workspace"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-glow hover:shadow-[0_0_30px_rgba(56,189,248,0.4)]"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Launch Analysis</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
