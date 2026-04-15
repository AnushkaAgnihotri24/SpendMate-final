import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  variant?: 'default' | 'primary' | 'accent';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  className = '',
  variant = 'default',
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'gradient-primary text-primary-foreground';
      case 'accent':
        return 'gradient-accent text-accent-foreground';
      default:
        return 'bg-card';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={`stat-card ${getVariantClass()} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${variant === 'default' ? 'text-muted-foreground' : 'opacity-80'}`}>
            {title}
          </p>
          <p className="text-2xl font-display font-bold mt-1">{value}</p>
          {subtitle && (
            <p className={`text-xs mt-1 ${variant === 'default' ? 'text-muted-foreground' : 'opacity-70'}`}>
              {subtitle}
            </p>
          )}
          {trend && trendValue && (
            <p className={`text-xs mt-1 font-medium ${getTrendColor()}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2 rounded-xl ${variant === 'default' ? 'bg-muted' : 'bg-white/20'}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
