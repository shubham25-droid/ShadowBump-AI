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
    <header className="sticky top-0 z-50 border-b border-border/80 bg-[#101115]/90 backdrop-blur-xl">
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
                    ? 'bg-zinc-800 border border-zinc-600 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
                }`}
              >
                <Icon className="h-4 w-4 text-zinc-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status Pill & Action */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 text-xs text-zinc-400 px-3 py-1.5 rounded-full border border-zinc-750 bg-zinc-850 shadow-sm">
            <Cpu className="h-3.5 w-3.5 text-zinc-300" />
            <span>NVIDIA Nemotron:</span>
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                hasNebiusKey === true
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : 'bg-zinc-400'
              }`}
            />
            <span className="font-mono text-zinc-200 text-[11px]">
              {hasNebiusKey === true ? 'Nebius Active' : 'Deterministic Mode'}
            </span>
          </div>

          <Link
            href="/workspace"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-all shadow-sm hover:shadow-glowGrey"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Launch Analysis</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
