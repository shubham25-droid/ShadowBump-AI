import React from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-panel py-6 mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-secondary">
          <div className="flex items-center space-x-2">
            <BrandLogo size={18} showText={false} />
            <span className="font-semibold text-ink-primary">ShadowBump AI</span>
            <span>—</span>
            <span>Controlled differential testing across dependency versions</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>Nebius Token Factory</span>
            <span>•</span>
            <Link href="/methodology" className="hover:text-ink-primary transition-colors">
              Methodology
            </Link>
            <span>•</span>
            <a
              href="https://nebiusglobalaihackathon.devpost.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink-primary transition-colors"
            >
              Nebius x NVIDIA Hackathon
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
