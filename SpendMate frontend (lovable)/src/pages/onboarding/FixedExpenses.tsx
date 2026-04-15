import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus, X, Bus, Utensils, CreditCard } from 'lucide-react';

interface Subscription {
  name: string;
  amount: number;
  renewalPeriod: string;
}

export const FixedExpenses: React.FC = () => {
  const navigate = useNavigate();
  const { data, updateData, setCurrentStep } = useOnboarding();
  
  const [travel, setTravel] = useState(data.fixedExpenses.travel || 0);
  const [food, setFood] = useState(data.fixedExpenses.food || 0);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(data.fixedExpenses.subscriptions || []);
  const [showAddSub, setShowAddSub] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', amount: '', renewalPeriod: 'monthly' });

  const handleAddSubscription = () => {
    if (newSub.name && newSub.amount) {
      setSubscriptions([...subscriptions, {
        name: newSub.name,
        amount: parseFloat(newSub.amount),
        renewalPeriod: newSub.renewalPeriod,
      }]);
      setNewSub({ name: '', amount: '', renewalPeriod: 'monthly' });
      setShowAddSub(false);
    }
  };

  const removeSubscription = (index: number) => {
    setSubscriptions(subscriptions.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    updateData({
      fixedExpenses: {
        travel,
        food,
        subscriptions,
      },
    });
    setCurrentStep(6);
    navigate('/onboarding/spending-behavior');
  };

  const totalFixed = travel + food + subscriptions.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="flex flex-col h-full pt-8 animate-fade-up">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Fixed Expenses
        </h1>
        <p className="text-muted-foreground text-sm">
          Monthly expenses that don't change much
        </p>
      </div>

      <div className="space-y-4 mb-6 flex-1 overflow-y-auto">
        {/* Travel */}
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Bus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <label className="font-medium text-foreground">Travel / Commute</label>
              <p className="text-xs text-muted-foreground">Bus, metro, auto, fuel</p>
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
            <input
              type="number"
              value={travel || ''}
              onChange={(e) => setTravel(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="input-field pl-8"
            />
          </div>
        </div>

        {/* Food */}
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <label className="font-medium text-foreground">Food / Mess</label>
              <p className="text-xs text-muted-foreground">Regular meals, mess fees</p>
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
            <input
              type="number"
              value={food || ''}
              onChange={(e) => setFood(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="input-field pl-8"
            />
          </div>
        </div>

        {/* Subscriptions */}
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <label className="font-medium text-foreground">Subscriptions</label>
              <p className="text-xs text-muted-foreground">Netflix, Spotify, etc.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddSub(true)}
              className="rounded-full"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {subscriptions.length > 0 && (
            <div className="space-y-2 mb-3">
              {subscriptions.map((sub, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted rounded-lg px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{sub.name}</p>
                    <p className="text-xs text-muted-foreground">{sub.renewalPeriod}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">₹{sub.amount}</span>
                    <button
                      onClick={() => removeSubscription(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showAddSub && (
            <div className="border border-border rounded-lg p-3 mt-3 space-y-2 animate-scale-in">
              <input
                type="text"
                value={newSub.name}
                onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                placeholder="Subscription name"
                className="input-field text-sm py-2"
              />
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                  <input
                    type="number"
                    value={newSub.amount}
                    onChange={(e) => setNewSub({ ...newSub, amount: e.target.value })}
                    placeholder="Amount"
                    className="input-field text-sm py-2 pl-8"
                  />
                </div>
                <select
                  value={newSub.renewalPeriod}
                  onChange={(e) => setNewSub({ ...newSub, renewalPeriod: e.target.value })}
                  className="input-field text-sm py-2 w-28"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddSub(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddSubscription}
                  className="flex-1 btn-primary"
                >
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {totalFixed > 0 && (
        <div className="card-elevated p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Fixed Expenses</span>
            <span className="text-xl font-display font-bold text-foreground">
              ₹{totalFixed.toLocaleString()}/mo
            </span>
          </div>
        </div>
      )}

      <Button
        onClick={handleNext}
        className="w-full btn-primary h-14 text-lg"
      >
        Continue
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};

export default FixedExpenses;
