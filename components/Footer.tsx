import React from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { ExternalLink, Cpu, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/80 bg-[#101115] py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center space-x-3">
            <BrandLogo size={24} showText={false} />
            <span className="font-bold text-white text-sm">ShadowBump AI</span>
            <span>—</span>
            <span>Differential runtime testing harness for software dependency upgrades</span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-300 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">
              <Cpu className="h-3 w-3 text-zinc-400" /> Nebius Token Factory
            </span>
            <span>•</span>
            <Link href="/methodology" className="hover:text-white transition-colors">
              Methodology
            </Link>
            <span>•</span>
            <a
              href="https://nebiusglobalaihackathon.devpost.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white inline-flex items-center gap-1"
            >
              <span>Hackathon Track</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
