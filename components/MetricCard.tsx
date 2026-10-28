import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  icon: LucideIcon;
  variant?: 'neutral' | 'match' | 'diff' | 'regression' | 'brand';
}

export default function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'neutral'
}: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'match':
        return {
          border: 'border-emerald-500/30 hover:border-emerald-500/50',
          gradient: 'from-emerald-950/20 via-panel to-panel',
          text: 'text-emerald-400',
          iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
          glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
        };
      case 'diff':
        return {
          border: 'border-amber-500/30 hover:border-amber-500/50',
          gradient: 'from-amber-950/20 via-panel to-panel',
          text: 'text-amber-400',
          iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
          glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
        };
      case 'regression':
        return {
          border: 'border-rose-500/40 hover:border-rose-500/60',
          gradient: 'from-rose-950/20 via-panel to-panel',
          text: 'text-rose-400',
          iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
          glow: 'hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]'
        };
      case 'brand':
        return {
          border: 'border-cyan-500/40 hover:border-cyan-500/60',
          gradient: 'from-cyan-950/20 via-panel to-panel',
          text: 'text-cyan-400',
          iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
          glow: 'hover:shadow-[0_0_20px_rgba(0,242,254,0.2)]'
        };
      default:
        return {
          border: 'border-border/80 hover:border-slate-600',
          gradient: 'from-canvas via-panel to-panel',
          text: 'text-white',
          iconBg: 'bg-canvas text-slate-400 border border-border',
          glow: 'hover:shadow-card'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border ${styles.border} bg-gradient-to-b ${styles.gradient} shadow-panel transition-all ${styles.glow}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <div className={`p-2 rounded-xl ${styles.iconBg}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${styles.text}`}>
        {value}
      </div>
      {subtext && (
        <div className="text-xs text-slate-300 mt-1.5 font-medium">
          {subtext}
        </div>
      )}
    </div>
  );
}
