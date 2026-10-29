import React from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { ExternalLink, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-card/90 py-7 mt-auto text-xs text-ink-secondary backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <BrandLogo size={20} showText={false} />
            <span className="font-heading font-bold text-ink-primary text-sm">ShadowBump AI</span>
            <span>-</span>
            <span>Differential runtime testing harness for dependency upgrades</span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-primary px-2.5 py-0.5 rounded-full bg-hero border border-line">
              <Cpu className="h-3 w-3 text-tech" /> Nebius Token Factory
            </span>
            <span className="text-line">/</span>
            <Link href="/methodology" className="hover:text-ink-primary transition-colors">
              Methodology
            </Link>
            <span className="text-line">/</span>
            <Link href="/workspace" className="hover:text-ink-primary transition-colors">
              Workspace
            </Link>
            <span className="text-line">/</span>
            <a
              href="https://github.com/shubham25-droid/ShadowBump-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink-primary inline-flex items-center gap-1 transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
