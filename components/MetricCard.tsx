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
          border: 'border-line hover:border-status-success/40',
          text: 'text-status-success',
          iconBg: 'bg-status-success-bg text-status-success border border-status-success/20'
        };
      case 'diff':
        return {
          border: 'border-line hover:border-status-warning/40',
          text: 'text-status-warning',
          iconBg: 'bg-status-warning-bg text-status-warning border border-status-warning/20'
        };
      case 'regression':
        return {
          border: 'border-status-error/30 hover:border-status-error/50',
          text: 'text-status-error',
          iconBg: 'bg-status-error-bg text-status-error border border-status-error/20'
        };
      case 'brand':
        return {
          border: 'border-line hover:border-accent/40',
          text: 'text-accent',
          iconBg: 'bg-accent-subtle text-accent border border-accent/20'
        };
      default:
        return {
          border: 'border-line hover:border-ink-secondary/40',
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
        <div className={`p-2 rounded-button ${styles.iconBg}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${styles.text}`}>
        {value}
      </div>
      {subtext && (
        <div className="text-xs text-ink-secondary mt-1 font-sans">
          {subtext}
        </div>
      )}
    </div>
  );
}
