'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';

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
    { href: '/', label: 'Overview' },
    { href: '/workspace', label: 'Workspace' },
    { href: '/methodology', label: 'Methodology' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-panel">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center">
          <BrandLogo size={24} />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-ink-primary font-semibold bg-background'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Status & CTA */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 text-[11px] text-ink-secondary px-2.5 py-1 rounded border border-line bg-background">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                hasNebiusKey === true ? 'bg-status-success' : 'bg-status-warning'
              }`}
            />
            <span>NVIDIA Nemotron:</span>
            <span className="font-mono text-ink-primary">
              {hasNebiusKey === true ? 'Active' : 'Deterministic Mode'}
            </span>
          </div>

          <Link
            href="/workspace"
            className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-md bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors"
          >
            Analyze an Upgrade
          </Link>
        </div>
      </div>
    </header>
  );
}
