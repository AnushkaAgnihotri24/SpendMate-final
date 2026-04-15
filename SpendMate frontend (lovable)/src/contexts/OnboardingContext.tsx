import React, { createContext, useContext, useState } from 'react';

interface OnboardingData {
  profileName: string;
  avatar: string;
  studentType: 'hosteler' | 'day-scholar' | '';
  monthlyBudget: number;
  fixedExpenses: {
    travel: number;
    food: number;
    subscriptions: { name: string; amount: number; renewalPeriod: string }[];
  };
  spendingBehavior: {
    eatingOut: number;
    shopping: number;
    weekendTrips: number;
    savingPreference: number;
  };
  recommendedLimits: {
    daily: number;
    monthly: number;
  };
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isCompleted: boolean;
  completeOnboarding: () => void;
}

const defaultData: OnboardingData = {
  profileName: '',
  avatar: '',
  studentType: '',
  monthlyBudget: 0,
  fixedExpenses: {
    travel: 0,
    food: 0,
    subscriptions: [],
  },
  spendingBehavior: {
    eatingOut: 50,
    shopping: 50,
    weekendTrips: 50,
    savingPreference: 50,
  },
  recommendedLimits: {
    daily: 0,
    monthly: 0,
  },
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<OnboardingData>(() => {
    const saved = localStorage.getItem('onboardingData');
    return saved ? JSON.parse(saved) : defaultData;
  });
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('onboardingStep');
    return saved ? parseInt(saved) : 1;
  });
  const [isCompleted, setIsCompleted] = useState(() => {
    return localStorage.getItem('onboardingCompleted') === 'true';
  });

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => {
      const newData = { ...prev, ...updates };
      localStorage.setItem('onboardingData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleSetCurrentStep = (step: number) => {
    setCurrentStep(step);
    localStorage.setItem('onboardingStep', step.toString());
  };

  const completeOnboarding = () => {
    setIsCompleted(true);
    localStorage.setItem('onboardingCompleted', 'true');
  };

  return (
    <OnboardingContext.Provider value={{
      data,
      updateData,
      currentStep,
      setCurrentStep: handleSetCurrentStep,
      isCompleted,
      completeOnboarding,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
