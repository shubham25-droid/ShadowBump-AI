'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';
import { Play, Cpu, Layers, BookOpen, ArrowRight, HelpCircle, Video } from 'lucide-react';

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
    { href: '/#demo', label: 'Watch Demo', icon: Video },
    { href: '/#guide', label: 'How to Use', icon: HelpCircle },
    { href: '/workspace', label: 'Analysis Workspace', icon: Play },
    { href: '/methodology', label: 'Methodology & Soundness', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center group">
          <BrandLogo size={26} />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-button text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-hero text-ink-primary font-semibold border border-line'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-hero/60'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-accent' : 'text-ink-muted'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status Pill & Primary CTA */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 text-xs text-ink-secondary px-3 py-1 rounded-full border border-line bg-hero/70">
            <Cpu className="h-3.5 w-3.5 text-tech" />
            <span className="text-[11px] font-medium">NVIDIA Nemotron:</span>
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                hasNebiusKey === true
                  ? 'bg-status-success'
                  : 'bg-tech'
              }`}
            />
            <span className="font-mono text-ink-primary text-[11px]">
              {hasNebiusKey === true ? 'Nebius Active' : 'Deterministic Mode'}
            </span>
          </div>

          <Link
            href="/workspace"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-button bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors shadow-subtle"
          >
            <span>Analyze an Upgrade</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
