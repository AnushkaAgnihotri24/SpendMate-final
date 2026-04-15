import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { avatarPresets } from '@/data/mockData';
import { Camera, ArrowRight } from 'lucide-react';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { data, updateData, setCurrentStep } = useOnboarding();
  const [name, setName] = useState(data.profileName);
  const [selectedAvatar, setSelectedAvatar] = useState(data.avatar || avatarPresets[0]);

  const handleNext = () => {
    updateData({ profileName: name, avatar: selectedAvatar });
    setCurrentStep(3);
    navigate('/onboarding/student-type');
  };

  const isValid = name.trim().length >= 2;

  return (
    <div className="flex flex-col h-full pt-8 animate-fade-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Create Your Profile
        </h1>
        <p className="text-muted-foreground">
          Let's personalize your experience
        </p>
      </div>

      {/* Avatar Selection */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-5xl border-4 border-primary/20">
            {selectedAvatar}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-lg">
            <Camera className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">Choose an avatar</p>
        <div className="flex flex-wrap justify-center gap-2 max-w-xs">
          {avatarPresets.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelectedAvatar(emoji)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-200 ${
                selectedAvatar === emoji
                  ? 'bg-primary/20 ring-2 ring-primary scale-110'
                  : 'bg-muted hover:bg-secondary'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Name Input */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-foreground mb-2">
          What should we call you?
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="input-field text-lg"
          autoFocus
        />
      </div>

      <div className="mt-auto">
        <Button
          onClick={handleNext}
          disabled={!isValid}
          className="w-full btn-primary h-14 text-lg disabled:opacity-50"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Profile;
