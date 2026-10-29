import React from 'react';

interface BrandSymbolProps {
  size?: number;
  className?: string;
}

/**
 * Native Warm-Neutral Brand Symbol for ShadowBump AI.
 * Isometric twin-plane mark rendered in charcoal and burnt-orange.
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
        {/* Top Plane: Baseline (Charcoal #292824) */}
        <path
          d="M 52.62 17.52 Q 55.61 15.70 58.66 17.41 L 81.68 30.30 Q 84.73 32.01 81.69 33.74 L 64.76 43.39 Q 61.72 45.12 58.66 43.42 L 51.68 39.54 Q 51.24 39.30 51.24 39.80 L 51.24 57.79 Q 51.24 61.29 48.19 59.57 L 17.59 42.33 Q 14.54 40.61 17.53 38.79 Z"
          fill="#292824"
        />
        {/* Bottom Plane: Candidate (Burnt Orange #C65D32) */}
        <path
          d="M 65.38 50.36 Q 68.42 48.62 71.34 50.55 L 84.43 59.21 Q 87.35 61.14 84.31 62.87 L 49.91 82.42 Q 46.87 84.15 43.77 82.53 L 15.60 67.86 Q 12.50 66.24 15.49 64.42 L 27.71 56.99 Q 30.70 55.17 33.79 56.82 L 55.02 68.18 Q 55.46 68.42 55.46 67.92 L 55.46 59.54 Q 55.46 56.04 58.50 54.30 Z"
          fill="#C65D32"
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
    <div className={`flex items-center space-x-2.5 ${className}`}>
      <BrandSymbol size={size} />
      {showText && (
        <div className="flex items-center space-x-1.5 leading-none">
          <span className="font-heading font-bold tracking-tight text-base sm:text-lg text-ink-primary">
            ShadowBump
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded font-bold bg-accent-subtle text-accent border border-accent/20">
            AI
          </span>
        </div>
      )}
    </div>
  );
}
