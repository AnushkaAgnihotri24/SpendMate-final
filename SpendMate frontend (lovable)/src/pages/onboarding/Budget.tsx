import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wallet } from 'lucide-react';

const quickAmounts = [5000, 10000, 15000, 20000, 25000, 30000];

export const Budget: React.FC = () => {
  const navigate = useNavigate();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [budget, setBudget] = useState(data.monthlyBudget || 0);
  const [inputValue, setInputValue] = useState(data.monthlyBudget?.toString() || '');

  const handleInputChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setInputValue(numericValue);
    setBudget(parseInt(numericValue) || 0);
  };

  const handleQuickSelect = (amount: number) => {
    setBudget(amount);
    setInputValue(amount.toString());
  };

  const handleNext = () => {
    if (budget > 0) {
      updateData({ monthlyBudget: budget });
      setCurrentStep(5);
      navigate('/onboarding/fixed-expenses');
    }
  };

  return (
    <div className="flex flex-col h-full pt-8 animate-fade-up">
      <div className="text-center mb-8">
        <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
          <Wallet className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Monthly Budget
        </h1>
        <p className="text-muted-foreground">
          How much do you receive or plan to spend monthly?
        </p>
      </div>

      {/* Budget Input */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground font-display">
            ₹
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="0"
            className="input-field text-3xl font-display font-bold text-center pl-10 h-16"
          />
        </div>
      </div>

      {/* Quick Select */}
      <div className="mb-8">
        <p className="text-sm text-muted-foreground mb-3 text-center">Quick select</p>
        <div className="grid grid-cols-3 gap-2">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleQuickSelect(amount)}
              className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                budget === amount
                  ? 'gradient-primary text-primary-foreground shadow-glow'
                  : 'bg-muted text-muted-foreground hover:bg-secondary'
              }`}
            >
              ₹{(amount / 1000).toFixed(0)}K
            </button>
          ))}
        </div>
      </div>

      {budget > 0 && (
        <div className="card-elevated p-4 mb-6 animate-scale-in">
          <p className="text-sm text-muted-foreground text-center">
            Your daily limit would be approximately
          </p>
          <p className="text-2xl font-display font-bold text-primary text-center mt-1">
            ₹{Math.round(budget / 30).toLocaleString()}/day
          </p>
        </div>
      )}

      <div className="mt-auto">
        <Button
          onClick={handleNext}
          disabled={budget <= 0}
          className="w-full btn-primary h-14 text-lg disabled:opacity-50"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Budget;
