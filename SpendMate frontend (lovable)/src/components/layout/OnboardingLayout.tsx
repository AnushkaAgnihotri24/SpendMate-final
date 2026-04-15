import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ArrowLeft } from 'lucide-react';

export const OnboardingLayout: React.FC = () => {
  const { currentStep, setCurrentStep } = useOnboarding();
  const navigate = useNavigate();
  const totalSteps = 8;

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      const stepRoutes: Record<number, string> = {
        1: '/onboarding/welcome',
        2: '/onboarding/profile',
        3: '/onboarding/student-type',
        4: '/onboarding/budget',
        5: '/onboarding/fixed-expenses',
        6: '/onboarding/spending-behavior',
        7: '/onboarding/recommended',
      };
      
      navigate(stepRoutes[prevStep] || '/onboarding/welcome');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress dots and back button */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg py-4 px-6">
        <div className="relative flex items-center justify-center max-w-md mx-auto">
          {/* Back button - only show after first step */}
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="absolute left-0 p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`onboarding-dot ${index + 1 === currentStep ? 'active' : ''} ${
                  index + 1 < currentStep ? 'bg-primary' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-16 pb-8 px-4">
        <div className="max-w-md mx-auto h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
