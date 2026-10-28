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
          border: 'border-line',
          text: 'text-status-success',
          iconBg: 'bg-status-success-bg text-status-success'
        };
      case 'diff':
        return {
          border: 'border-line',
          text: 'text-status-warning',
          iconBg: 'bg-status-warning-bg text-status-warning'
        };
      case 'regression':
        return {
          border: 'border-status-error/40',
          text: 'text-status-error',
          iconBg: 'bg-status-error-bg text-status-error'
        };
      case 'brand':
        return {
          border: 'border-line',
          text: 'text-accent',
          iconBg: 'bg-accent-subtle text-accent'
        };
      default:
        return {
          border: 'border-line',
          text: 'text-ink-primary',
          iconBg: 'bg-background text-ink-secondary'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`p-3.5 rounded border ${styles.border} bg-panel shadow-panel transition-colors`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold text-ink-secondary uppercase tracking-wider">
          {label}
        </span>
        <div className={`h-6 w-6 rounded flex items-center justify-center ${styles.iconBg}`}>
          <Icon className="h-3 w-3" />
        </div>
      </div>
      <div className="flex items-baseline space-x-1.5">
        <span className={`text-xl font-bold font-mono ${styles.text}`}>
          {value}
        </span>
      </div>
      {subtext && (
        <span className="text-[11px] text-ink-secondary block mt-0.5 truncate">
          {subtext}
        </span>
      )}
    </div>
  );
}
