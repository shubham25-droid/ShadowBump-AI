import React from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { ExternalLink, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2.5">
            <BrandLogo size={22} showText={false} />
            <span className="font-bold text-slate-800">ShadowBump AI</span>
            <span>—</span>
            <span>Differential runtime testing for dependency upgrades</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-600">
              <Cpu className="h-3 w-3 text-sky-600" /> Nebius Token Factory
            </span>
            <span>•</span>
            <Link href="/methodology" className="hover:text-slate-900 transition-colors">
              Methodology
            </Link>
            <span>•</span>
            <a
              href="https://nebiusglobalaihackathon.devpost.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 inline-flex items-center gap-0.5"
            >
              <span>Hackathon</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
