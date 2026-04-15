import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { PartyPopper, ArrowRight, CheckCircle2 } from 'lucide-react';

const features = [
  'Daily expense tracking',
  'Shared bill splitting',
  'Savings goal progress',
  'Subscription reminders',
  'Monthly spending insights',
];

export const Success: React.FC = () => {
  const navigate = useNavigate();
  const { data, completeOnboarding } = useOnboarding();
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFeatures(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGotoDashboard = () => {
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col h-full pt-8 animate-fade-up">
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="w-20 h-20 gradient-success rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow animate-bounce-in">
            <PartyPopper className="w-10 h-10 text-success-foreground" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-lg animate-bounce">
            🎉
          </div>
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          You're All Set, {data.profileName}!
        </h1>
        <p className="text-muted-foreground">
          SpendMate is ready to help you save
        </p>
      </div>

      <div className="card-elevated p-5 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Your Setup Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly Budget</span>
            <span className="font-medium text-foreground">₹{data.monthlyBudget.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Daily Limit</span>
            <span className="font-medium text-primary">₹{data.recommendedLimits.daily.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Student Type</span>
            <span className="font-medium text-foreground capitalize">{data.studentType.replace('-', ' ')}</span>
          </div>
        </div>
      </div>

      {showFeatures && (
        <div className="mb-8 animate-fade-up">
          <h3 className="font-semibold text-foreground mb-3 text-center">
            What you can do now:
          </h3>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div
                key={feature}
                className="flex items-center gap-3 text-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto">
        <Button
          onClick={handleGotoDashboard}
          className="w-full btn-primary h-14 text-lg"
        >
          Go to Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Success;
