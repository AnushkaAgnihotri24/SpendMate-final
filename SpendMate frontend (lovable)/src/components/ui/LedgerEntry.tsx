import React from 'react';
import { format } from 'date-fns';
import { Check, Bell } from 'lucide-react';
import { Button } from './button';

interface LedgerEntryProps {
  name: string;
  amount: number;
  date: Date;
  reason: string;
  status: 'pending' | 'settled';
  type: 'owe' | 'owedToMe';
  onSettle?: () => void;
  onRemind?: () => void;
  className?: string;
}

export const LedgerEntry: React.FC<LedgerEntryProps> = ({
  name,
  amount,
  date,
  reason,
  status,
  type,
  onSettle,
  onRemind,
  className = '',
}) => {
  const isSettled = status === 'settled';

  return (
    <div className={`card-elevated p-4 ${isSettled ? 'opacity-60' : ''} ${className}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${
          type === 'owe' 
            ? 'bg-destructive/10 text-destructive' 
            : 'bg-success/10 text-success'
        }`}>
          {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{name}</h3>
            {isSettled && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-success/20 text-success font-medium">
                Settled
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{reason}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {format(date, 'MMM d, yyyy')}
          </p>
        </div>
        <div className="text-right">
          <p className={`font-display font-bold ${
            type === 'owe' ? 'text-destructive' : 'text-success'
          }`}>
            {type === 'owe' ? '-' : '+'}₹{amount}
          </p>
        </div>
      </div>
      
      {!isSettled && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onSettle}
            className="flex-1"
          >
            <Check className="w-4 h-4 mr-1" />
            Mark Settled
          </Button>
          {type === 'owedToMe' && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRemind}
              className="flex-1"
            >
              <Bell className="w-4 h-4 mr-1" />
              Remind
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
