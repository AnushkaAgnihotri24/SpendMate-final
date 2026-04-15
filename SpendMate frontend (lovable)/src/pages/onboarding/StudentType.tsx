import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home, Bus } from 'lucide-react';

const options = [
  {
    id: 'hosteler',
    icon: Home,
    title: 'Hosteler',
    description: 'I stay in a hostel or PG accommodation',
    emoji: '🏠',
  },
  {
    id: 'day-scholar',
    icon: Bus,
    title: 'Day Scholar',
    description: 'I commute from home daily',
    emoji: '🚌',
  },
];

export const StudentType: React.FC = () => {
  const navigate = useNavigate();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [selected, setSelected] = useState<'hosteler' | 'day-scholar' | ''>(data.studentType);

  const handleNext = () => {
    if (selected) {
      updateData({ studentType: selected });
      setCurrentStep(4);
      navigate('/onboarding/budget');
    }
  };

  return (
    <div className="flex flex-col h-full pt-8 animate-fade-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Tell us about yourself
        </h1>
        <p className="text-muted-foreground">
          This helps us tailor spending categories for you
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelected(option.id as 'hosteler' | 'day-scholar')}
            className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
              selected === option.id
                ? 'border-primary bg-primary/5 shadow-glow'
                : 'border-border bg-card hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                selected === option.id ? 'gradient-primary' : 'bg-muted'
              }`}>
                {option.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-foreground">{option.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{option.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selected === option.id
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground'
              }`}>
                {selected === option.id && (
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <Button
          onClick={handleNext}
          disabled={!selected}
          className="w-full btn-primary h-14 text-lg disabled:opacity-50"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default StudentType;
