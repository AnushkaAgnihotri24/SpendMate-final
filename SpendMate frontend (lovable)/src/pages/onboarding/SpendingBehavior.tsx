import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Utensils, ShoppingBag, MapPin, PiggyBank } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const behaviors = [
  {
    id: 'eatingOut',
    icon: Utensils,
    title: 'Eating Out',
    labels: ['Rarely', 'Often'],
    color: 'text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  {
    id: 'shopping',
    icon: ShoppingBag,
    title: 'Shopping',
    labels: ['Minimal', 'Frequent'],
    color: 'text-pink-500',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
  {
    id: 'weekendTrips',
    icon: MapPin,
    title: 'Weekend Trips',
    labels: ['Home bound', 'Explorer'],
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    id: 'savingPreference',
    icon: PiggyBank,
    title: 'Saving Priority',
    labels: ['Flexible', 'Strict'],
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
];

export const SpendingBehavior: React.FC = () => {
  const navigate = useNavigate();
  const { data, updateData, setCurrentStep } = useOnboarding();
  
  const [values, setValues] = useState({
    eatingOut: data.spendingBehavior.eatingOut,
    shopping: data.spendingBehavior.shopping,
    weekendTrips: data.spendingBehavior.weekendTrips,
    savingPreference: data.spendingBehavior.savingPreference,
  });

  const handleChange = (id: string, value: number[]) => {
    setValues(prev => ({ ...prev, [id]: value[0] }));
  };

  const handleNext = () => {
    updateData({ spendingBehavior: values });
    
    // Calculate recommended limits
    const { monthlyBudget, fixedExpenses } = data;
    const totalFixed = fixedExpenses.travel + fixedExpenses.food + 
      fixedExpenses.subscriptions.reduce((sum, s) => sum + s.amount, 0);
    const disposable = monthlyBudget - totalFixed;
    
    // Adjust based on saving preference (0-100)
    const savingsRatio = (values.savingPreference / 100) * 0.3; // Max 30% savings
    const spendable = disposable * (1 - savingsRatio);
    
    const recommendedMonthly = Math.round(spendable);
    const recommendedDaily = Math.round(spendable / 30);
    
    updateData({
      recommendedLimits: {
        daily: recommendedDaily,
        monthly: recommendedMonthly,
      },
    });
    
    setCurrentStep(7);
    navigate('/onboarding/recommended');
  };

  return (
    <div className="flex flex-col h-full pt-8 animate-fade-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Spending Habits
        </h1>
        <p className="text-muted-foreground text-sm">
          Helps us suggest better limits for you
        </p>
      </div>

      <div className="space-y-6 mb-8 flex-1">
        {behaviors.map(({ id, icon: Icon, title, labels, color, bgColor }) => (
          <div key={id} className="card-elevated p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className="font-medium text-foreground">{title}</span>
            </div>
            
            <Slider
              value={[values[id as keyof typeof values]]}
              onValueChange={(value) => handleChange(id, value)}
              max={100}
              step={1}
              className="mb-2"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{labels[0]}</span>
              <span>{labels[1]}</span>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={handleNext}
        className="w-full btn-primary h-14 text-lg"
      >
        See Recommendations
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};

export default SpendingBehavior;
