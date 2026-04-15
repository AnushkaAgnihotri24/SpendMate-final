import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Calendar } from 'lucide-react';

interface SubscriptionCardProps {
  name: string;
  amount: number;
  renewalDate: Date;
  icon: string;
  dailyContribution: number;
  className?: string;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  name,
  amount,
  renewalDate,
  icon,
  dailyContribution,
  className = '',
}) => {
  const daysUntilRenewal = differenceInDays(renewalDate, new Date());
  const isUrgent = daysUntilRenewal <= 7;

  return (
    <div className={`card-elevated p-4 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Renews {format(renewalDate, 'MMM d')}</span>
            {isUrgent && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-warning/20 text-warning font-medium">
                {daysUntilRenewal} days
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="font-display font-bold text-foreground">₹{amount}</p>
          <p className="text-xs text-muted-foreground">₹{dailyContribution.toFixed(0)}/day</p>
        </div>
      </div>
    </div>
  );
};
