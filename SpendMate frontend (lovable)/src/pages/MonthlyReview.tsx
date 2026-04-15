import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { mockMonthlyReview, categories } from '@/data/mockData';
import { ArrowLeft, ChevronRight, Share2, Trophy, Flame, Handshake } from 'lucide-react';
import { format } from 'date-fns';

const slides = [
  'welcome',
  'total-spent',
  'top-category',
  'best-day',
  'shared-day',
  'savings',
  'achievements',
  'score',
];

export const MonthlyReview: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case '🏆': return <Trophy className="w-8 h-8" />;
      case '🔥': return <Flame className="w-8 h-8" />;
      case '🤝': return <Handshake className="w-8 h-8" />;
      default: return <span className="text-3xl">{icon}</span>;
    }
  };

  const renderSlide = () => {
    const slideClass = `h-full flex flex-col items-center justify-center text-center p-6 ${
      isAnimating ? 'animate-fade-out' : 'animate-fade-up'
    }`;

    switch (slides[currentSlide]) {
      case 'welcome':
        return (
          <div className={slideClass}>
            <div className="text-6xl mb-6">📊</div>
            <h1 className="text-3xl font-display font-bold text-primary-foreground mb-4">
              Your January Wrapped
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Let's see how you did this month!
            </p>
          </div>
        );

      case 'total-spent':
        return (
          <div className={slideClass}>
            <p className="text-lg text-primary-foreground/80 mb-2">This month you spent</p>
            <h1 className="text-5xl font-display font-bold text-primary-foreground mb-4">
              ₹{mockMonthlyReview.totalSpent.toLocaleString()}
            </h1>
            <p className="text-primary-foreground/70">
              Across all categories
            </p>
          </div>
        );

      case 'top-category':
        const topCat = categories.find(c => c.name === mockMonthlyReview.topCategory.name);
        return (
          <div className={slideClass}>
            <p className="text-lg text-primary-foreground/80 mb-4">Your top spending category</p>
            <div className="text-7xl mb-4">{topCat?.icon || '📦'}</div>
            <h2 className="text-3xl font-display font-bold text-primary-foreground mb-2">
              {mockMonthlyReview.topCategory.name}
            </h2>
            <p className="text-2xl font-bold text-primary-foreground/90">
              ₹{mockMonthlyReview.topCategory.amount.toLocaleString()}
            </p>
            <p className="text-primary-foreground/70 mt-2">
              {mockMonthlyReview.topCategory.percentage}% of total spending
            </p>
          </div>
        );

      case 'best-day':
        return (
          <div className={slideClass}>
            <p className="text-lg text-primary-foreground/80 mb-4">Your best saving day was</p>
            <div className="text-6xl mb-4">💪</div>
            <h2 className="text-3xl font-display font-bold text-primary-foreground mb-2">
              {format(mockMonthlyReview.bestSavingDay.date, 'MMMM d')}
            </h2>
            <p className="text-2xl font-bold text-primary-foreground/90">
              Saved ₹{mockMonthlyReview.bestSavingDay.saved}
            </p>
          </div>
        );

      case 'shared-day':
        return (
          <div className={slideClass}>
            <p className="text-lg text-primary-foreground/80 mb-4">Biggest shared expense day</p>
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-3xl font-display font-bold text-primary-foreground mb-2">
              {format(mockMonthlyReview.highestSharedExpenseDay.date, 'MMMM d')}
            </h2>
            <p className="text-2xl font-bold text-primary-foreground/90">
              ₹{mockMonthlyReview.highestSharedExpenseDay.amount.toLocaleString()}
            </p>
            <p className="text-primary-foreground/70 mt-2">
              spent with friends
            </p>
          </div>
        );

      case 'savings':
        return (
          <div className={slideClass}>
            <p className="text-lg text-primary-foreground/80 mb-4">Total savings this month</p>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-5xl font-display font-bold text-primary-foreground mb-4">
              ₹{mockMonthlyReview.totalSaved.toLocaleString()}
            </h1>
            <p className="text-primary-foreground/70">
              Keep up the great work!
            </p>
          </div>
        );

      case 'achievements':
        return (
          <div className={slideClass}>
            <p className="text-lg text-primary-foreground/80 mb-6">You earned these badges!</p>
            <div className="space-y-4 w-full max-w-xs">
              {mockMonthlyReview.achievements.map((achievement, index) => (
                <div
                  key={achievement.id}
                  className="bg-white/10 backdrop-blur rounded-2xl p-4 flex items-center gap-4"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-primary-foreground">
                    {getAchievementIcon(achievement.icon)}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-primary-foreground">{achievement.title}</h3>
                    <p className="text-sm text-primary-foreground/70">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'score':
        return (
          <div className={slideClass}>
            <p className="text-lg text-primary-foreground/80 mb-4">Your Monthly Finance Score</p>
            <div className="relative w-40 h-40 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="12"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="white"
                  strokeWidth="12"
                  strokeDasharray={`${(mockMonthlyReview.monthlyScore / 100) * 440} 440`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-display font-bold text-primary-foreground">
                  {mockMonthlyReview.monthlyScore}
                </span>
              </div>
            </div>
            <h2 className="text-2xl font-display font-bold text-primary-foreground mb-2">
              Great Job! 🌟
            </h2>
            <p className="text-primary-foreground/70 mb-6">
              You're doing better than 65% of students
            </p>
            <Button
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Your Score
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </button>
          <div className="flex gap-1">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-6 bg-white' : 'w-1 bg-white/40'
                }`}
              />
            ))}
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div
        className="min-h-screen pt-16 pb-24 cursor-pointer"
        onClick={nextSlide}
      >
        {renderSlide()}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            disabled={currentSlide === 0}
            className="px-6 py-3 rounded-xl bg-white/10 text-primary-foreground font-medium disabled:opacity-30"
          >
            Back
          </button>
          
          {currentSlide === slides.length - 1 ? (
            <Button
              onClick={(e) => { e.stopPropagation(); navigate('/dashboard'); }}
              className="px-6 py-3 bg-white text-primary hover:bg-white/90"
            >
              Done
            </Button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="px-6 py-3 rounded-xl bg-white/20 text-primary-foreground font-medium flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyReview;
