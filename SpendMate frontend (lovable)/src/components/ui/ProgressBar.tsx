import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  className = '',
  showLabel = false,
  variant = 'default',
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getVariantClass = () => {
    switch (variant) {
      case 'success':
        return 'gradient-success';
      case 'warning':
        return 'bg-warning';
      case 'danger':
        return 'bg-destructive';
      default:
        return 'gradient-primary';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="progress-bar">
        <div
          className={`progress-bar-fill ${getVariantClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>₹{value.toLocaleString()}</span>
          <span>₹{max.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};
