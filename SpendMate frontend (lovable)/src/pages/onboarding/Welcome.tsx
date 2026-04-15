import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, Users, Target } from 'lucide-react';

const features = [
  { icon: Wallet, title: 'Track Expenses', desc: 'Log daily spending easily' },
  { icon: Users, title: 'Split Bills', desc: 'Share costs with friends' },
  { icon: Target, title: 'Set Goals', desc: 'Save for what matters' },
  { icon: TrendingUp, title: 'Insights', desc: 'Understand your habits' },
];

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentStep } = useOnboarding();

  const handleStart = () => {
    setCurrentStep(2);
    navigate('/onboarding/profile');
  };

  return (
    <div className="flex flex-col h-full pt-8 animate-fade-up">
      <div className="text-center mb-8">
        <div className="w-20 h-20 gradient-hero rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow">
          <span className="text-4xl">💰</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Student Finance
        </h1>
        <p className="text-lg text-muted-foreground">Companion</p>
      </div>

      <p className="text-center text-muted-foreground mb-8">
        Take control of your money. Track spending, split bills, and reach your savings goals.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="card-elevated p-4 text-center animate-scale-in"
          >
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-2">
              <Icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <Button
          onClick={handleStart}
          className="w-full btn-primary h-14 text-lg"
        >
          Get Started
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Setup takes less than 2 minutes
        </p>
      </div>
    </div>
  );
};

export default Welcome;
