import React from 'react';
import { ProgressBar } from './ProgressBar';
import { format } from 'date-fns';
import { Target } from 'lucide-react';

interface GoalCardProps {
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  title,
  targetAmount,
  currentAmount,
  targetDate,
  color = 'hsl(168 65% 45%)',
  className = '',
  onClick,
}) => {
  const percentage = Math.round((currentAmount / targetAmount) * 100);
  const remaining = targetAmount - currentAmount;

  return (
    <div
      onClick={onClick}
      className={`card-elevated p-5 cursor-pointer hover:shadow-lg transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Target className="w-5 h-5" style={{ color }} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">
              Due {format(targetDate, 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <span
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {percentage}%
        </span>
      </div>

      <ProgressBar value={currentAmount} max={targetAmount} />

      <div className="flex justify-between mt-3 text-sm">
        <span className="text-muted-foreground">
          ₹{currentAmount.toLocaleString()} saved
        </span>
        <span className="font-medium text-foreground">
          ₹{remaining.toLocaleString()} to go
        </span>
      </div>
    </div>
  );
};
