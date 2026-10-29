import React from 'react';

interface BrandSymbolProps {
  size?: number;
  className?: string;
}

/**
 * Geometric Brand Symbol for ShadowBump AI.
 * Isometric twin-plane mark in deep navy charcoal and sky-cyan accent.
 */
export function BrandSymbol({
  size = 28,
  className = ''
}: BrandSymbolProps) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 transition-transform duration-200"
        aria-label="ShadowBump AI Logo"
        role="img"
      >
        {/* Top Plane: Deep Navy Charcoal */}
        <path
          d="M 52.62 17.52 Q 55.61 15.70 58.66 17.41 L 81.68 30.30 Q 84.73 32.01 81.69 33.74 L 64.76 43.39 Q 61.72 45.12 58.66 43.42 L 51.68 39.54 Q 51.24 39.30 51.24 39.80 L 51.24 57.79 Q 51.24 61.29 48.19 59.57 L 17.59 42.33 Q 14.54 40.61 17.53 38.79 Z"
          fill="#142638"
        />
        {/* Bottom Plane: Sky Cyan Accent */}
        <path
          d="M 65.38 50.36 Q 68.42 48.62 71.34 50.55 L 84.43 59.21 Q 87.35 61.14 84.31 62.87 L 49.91 82.42 Q 46.87 84.15 43.77 82.53 L 15.60 67.86 Q 12.50 66.24 15.49 64.42 L 27.71 56.99 Q 30.70 55.17 33.79 56.82 L 55.02 68.18 Q 55.46 68.42 55.46 67.92 L 55.46 59.54 Q 55.46 56.04 58.50 54.30 Z"
          fill="#0284C7"
        />
      </svg>
    </div>
  );
}

interface BrandLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function BrandLogo({
  size = 28,
  showText = true,
  className = ''
}: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandSymbol size={size} />

      {showText && (
        <div className="flex items-center gap-1.5 select-none tracking-tight">
          <span className="font-heading text-base sm:text-lg font-bold text-ink-primary">
            ShadowBump
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-hero text-accent border border-line uppercase tracking-wider">
            AI
          </span>
        </div>
      )}
    </div>
  );
}
