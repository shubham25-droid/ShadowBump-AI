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
          border: 'border-status-success/30 hover:border-status-success/50',
          text: 'text-status-success',
          iconBg: 'bg-status-successBg text-status-success border border-status-success/30'
        };
      case 'diff':
        return {
          border: 'border-status-warning/30 hover:border-status-warning/50',
          text: 'text-status-warning',
          iconBg: 'bg-status-warningBg text-status-warning border border-status-warning/30'
        };
      case 'regression':
        return {
          border: 'border-status-error/40 hover:border-status-error/60',
          text: 'text-status-error',
          iconBg: 'bg-status-errorBg text-status-error border border-status-error/40'
        };
      case 'brand':
        return {
          border: 'border-line hover:border-accent',
          text: 'text-accent',
          iconBg: 'bg-accent/10 text-accent border border-accent/25'
        };
      default:
        return {
          border: 'border-line hover:border-lineSubtle',
          text: 'text-ink-primary',
          iconBg: 'bg-hero text-ink-secondary border border-line'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`p-4 sm:p-5 rounded-card border ${styles.border} bg-card shadow-card transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono font-bold text-ink-secondary uppercase tracking-wider">
          {label}
        </span>
        <div className={`p-2 rounded ${styles.iconBg}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className={`font-heading text-2xl sm:text-3xl font-extrabold ${styles.text}`}>
        {value}
      </div>

      {subtext && (
        <div className="text-[11px] text-ink-muted mt-1 font-mono truncate">
          {subtext}
        </div>
      )}
    </div>
  );
}
