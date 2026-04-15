import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Edit3, Sparkles } from 'lucide-react';

export const Recommended: React.FC = () => {
  const navigate = useNavigate();
  const { data, updateData, setCurrentStep } = useOnboarding();
  
  const [isEditing, setIsEditing] = useState(false);
  const [daily, setDaily] = useState(data.recommendedLimits.daily);
  const [monthly, setMonthly] = useState(data.recommendedLimits.monthly);

  const handleAccept = () => {
    updateData({
      recommendedLimits: {
        daily: isEditing ? daily : data.recommendedLimits.daily,
        monthly: isEditing ? monthly : data.recommendedLimits.monthly,
      },
    });
    setCurrentStep(8);
    navigate('/onboarding/success');
  };

  const potentialSavings = data.monthlyBudget - monthly;

  return (
    <div className="flex flex-col h-full pt-8 animate-fade-up">
      <div className="text-center mb-8">
        <div className="w-16 h-16 gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse-soft">
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Your Smart Limits
        </h1>
        <p className="text-muted-foreground text-sm">
          Based on your inputs, we recommend:
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {/* Daily Limit */}
        <div className="card-elevated p-5 text-center">
          <p className="text-sm text-muted-foreground mb-1">Daily Spending Limit</p>
          {isEditing ? (
            <div className="relative inline-block">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">₹</span>
              <input
                type="number"
                value={daily}
                onChange={(e) => setDaily(parseInt(e.target.value) || 0)}
                className="text-4xl font-display font-bold text-center w-40 bg-muted rounded-xl pl-8 py-2 text-primary"
              />
            </div>
          ) : (
            <p className="text-4xl font-display font-bold text-primary">
              ₹{data.recommendedLimits.daily.toLocaleString()}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">per day</p>
        </div>

        {/* Monthly Limit */}
        <div className="card-elevated p-5 text-center">
          <p className="text-sm text-muted-foreground mb-1">Monthly Spending Budget</p>
          {isEditing ? (
            <div className="relative inline-block">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">₹</span>
              <input
                type="number"
                value={monthly}
                onChange={(e) => setMonthly(parseInt(e.target.value) || 0)}
                className="text-4xl font-display font-bold text-center w-44 bg-muted rounded-xl pl-8 py-2 text-primary"
              />
            </div>
          ) : (
            <p className="text-4xl font-display font-bold text-primary">
              ₹{data.recommendedLimits.monthly.toLocaleString()}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">per month</p>
        </div>

        {/* Potential Savings */}
        <div className="gradient-success rounded-2xl p-5 text-center text-success-foreground">
          <p className="text-sm opacity-80 mb-1">Potential Monthly Savings</p>
          <p className="text-3xl font-display font-bold">
            ₹{potentialSavings.toLocaleString()}
          </p>
          <p className="text-xs opacity-70 mt-1">
            {((potentialSavings / data.monthlyBudget) * 100).toFixed(0)}% of your budget
          </p>
        </div>
      </div>

      <div className="mt-auto space-y-3">
        {!isEditing ? (
          <>
            <Button
              onClick={handleAccept}
              className="w-full btn-primary h-14 text-lg"
            >
              <Check className="w-5 h-5 mr-2" />
              Accept & Continue
            </Button>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full h-14 text-lg"
            >
              <Edit3 className="w-5 h-5 mr-2" />
              Set Manually
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleAccept}
              className="w-full btn-primary h-14 text-lg"
            >
              Save & Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => {
                setDaily(data.recommendedLimits.daily);
                setMonthly(data.recommendedLimits.monthly);
                setIsEditing(false);
              }}
              variant="outline"
              className="w-full h-14 text-lg"
            >
              Reset to Recommended
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Recommended;
