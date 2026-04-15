import React from 'react';
import { categories } from '@/data/mockData';
import { format } from 'date-fns';

interface ExpenseCardProps {
  category: string;
  subcategory: string;
  item: string;
  amount: number;
  date: Date;
  time: string;
  className?: string;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  category,
  subcategory,
  item,
  amount,
  date,
  time,
  className = '',
}) => {
  const categoryData = categories.find(c => c.id === category);

  return (
    <div className={`card-elevated p-4 flex items-center gap-4 animate-fade-up ${className}`}>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ backgroundColor: `${categoryData?.color}20` }}
      >
        {categoryData?.icon || '📦'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{item}</p>
        <p className="text-sm text-muted-foreground">
          {subcategory} • {format(date, 'MMM d')} at {time}
        </p>
      </div>
      <div className="text-right">
        <p className="font-display font-bold text-foreground">-₹{amount}</p>
      </div>
    </div>
  );
};
