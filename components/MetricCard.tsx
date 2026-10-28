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
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-500/5',
          text: 'text-emerald-400',
          iconBg: 'bg-emerald-500/10 text-emerald-400'
        };
      case 'diff':
        return {
          border: 'border-amber-500/30',
          bg: 'bg-amber-500/5',
          text: 'text-amber-400',
          iconBg: 'bg-amber-500/10 text-amber-400'
        };
      case 'regression':
        return {
          border: 'border-rose-500/30',
          bg: 'bg-rose-500/5',
          text: 'text-rose-400',
          iconBg: 'bg-rose-500/10 text-rose-400'
        };
      case 'brand':
        return {
          border: 'border-sky-500/30',
          bg: 'bg-sky-500/5',
          text: 'text-sky-400',
          iconBg: 'bg-sky-500/10 text-sky-400'
        };
      default:
        return {
          border: 'border-surface-border',
          bg: 'bg-surface-card',
          text: 'text-slate-100',
          iconBg: 'bg-slate-800 text-slate-300'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`p-4 rounded-xl border ${styles.border} ${styles.bg} shadow-sm transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${styles.iconBg}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className={`text-2xl font-bold font-mono ${styles.text}`}>
          {value}
        </span>
      </div>
      {subtext && (
        <span className="text-[11px] text-slate-400 block mt-1 font-mono">
          {subtext}
        </span>
      )}
    </div>
  );
}
