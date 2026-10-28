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
          border: 'border-emerald-200',
          bg: 'bg-emerald-50/40',
          text: 'text-emerald-700',
          iconBg: 'bg-emerald-100 text-emerald-700'
        };
      case 'diff':
        return {
          border: 'border-amber-200',
          bg: 'bg-amber-50/40',
          text: 'text-amber-700',
          iconBg: 'bg-amber-100 text-amber-700'
        };
      case 'regression':
        return {
          border: 'border-rose-200',
          bg: 'bg-rose-50/40',
          text: 'text-rose-700',
          iconBg: 'bg-rose-100 text-rose-700'
        };
      case 'brand':
        return {
          border: 'border-sky-200',
          bg: 'bg-sky-50/40',
          text: 'text-sky-700',
          iconBg: 'bg-sky-100 text-sky-700'
        };
      default:
        return {
          border: 'border-slate-200',
          bg: 'bg-white',
          text: 'text-slate-900',
          iconBg: 'bg-slate-100 text-slate-700'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`p-4 rounded-xl border ${styles.border} ${styles.bg} shadow-xs transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${styles.iconBg}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className={`text-2xl font-extrabold font-mono ${styles.text}`}>
          {value}
        </span>
      </div>
      {subtext && (
        <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">
          {subtext}
        </span>
      )}
    </div>
  );
}
