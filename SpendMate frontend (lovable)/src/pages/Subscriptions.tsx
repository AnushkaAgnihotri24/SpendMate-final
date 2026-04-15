import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SubscriptionCard } from '@/components/ui/SubscriptionCard';
import { ArrowLeft, Plus, CreditCard, X } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import api from '@/lib/api';

export const Subscriptions: React.FC = () => {
  const navigate = useNavigate();
  const [showAddSub, setShowAddSub] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [renewalDate, setRenewalDate] = useState('');
  const [icon, setIcon] = useState('📦');
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const { data } = useOnboarding();

  React.useEffect(() => {
    api.get('/extra/subscriptions').then(res => setSubscriptions(res.data)).catch(console.error);
  }, []);

  const onboardingSubs = data?.fixedExpenses?.subscriptions?.map((sub, idx) => {
    let daily = 0;
    let date = new Date();
    if (sub.renewalPeriod === 'monthly') { daily = sub.amount / 30; date.setMonth(date.getMonth() + 1); }
    else if (sub.renewalPeriod === 'yearly') { daily = sub.amount / 365; date.setFullYear(date.getFullYear() + 1); }
    return {
      id: `onboarding-${idx}`,
      name: sub.name,
      amount: sub.amount,
      billingCycle: sub.renewalPeriod,
      renewalDate: date.toISOString(),
      icon: '📦',
      dailyContribution: daily
    };
  }) || [];

  const allSubscriptions = [...subscriptions, ...onboardingSubs];

  const totalMonthly = allSubscriptions.reduce((sum, s) => sum + s.amount, 0);
  const dailyContribution = allSubscriptions.reduce((sum, s) => sum + s.dailyContribution, 0);

  const iconOptions = ['🎬', '🎵', '📦', '💪', '📚', '🎮', '☁️', '📱'];

  const handleAddSubscription = async () => {
    try {
      let daily = 0;
      let date = new Date();
      switch(billingCycle) {
        case 'monthly': daily = Number(amount) / 30; date.setMonth(date.getMonth() + 1); break;
        case '4 months': daily = Number(amount) / 120; date.setMonth(date.getMonth() + 4); break;
        case '6 months': daily = Number(amount) / 180; date.setMonth(date.getMonth() + 6); break;
        case 'yearly': daily = Number(amount) / 365; date.setFullYear(date.getFullYear() + 1); break;
        case 'set manually': daily = Number(amount) / 30; date = new Date(renewalDate || Date.now()); break;
      }
      const res = await api.post('/extra/subscriptions', { 
        name, 
        amount: Number(amount), 
        billingCycle,
        renewalDate: date.toISOString(),
        icon,
        dailyContribution: daily
      });
      setSubscriptions([res.data, ...subscriptions]);
      setShowAddSub(false);
      setName('');
      setAmount('');
      setBillingCycle('monthly');
      setRenewalDate('');
      setIcon('📦');
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-display font-bold text-foreground">Subscriptions</h1>
          </div>
          <Button
            onClick={() => setShowAddSub(true)}
            size="sm"
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto pb-24">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card-elevated p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Monthly Total</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">
              ₹{totalMonthly.toLocaleString()}
            </p>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Daily Set-aside</span>
            </div>
            <p className="text-2xl font-display font-bold text-primary">
              ₹{dailyContribution.toFixed(0)}/day
            </p>
          </div>
        </div>

        {/* Add Subscription Form */}
        {showAddSub && (
          <div className="card-elevated p-5 mb-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Add Subscription</h3>
              <button
                onClick={() => setShowAddSub(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Choose Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setIcon(emoji)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                        icon === emoji
                          ? 'bg-primary/20 ring-2 ring-primary'
                          : 'bg-muted hover:bg-secondary'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Subscription Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Netflix, Spotify"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Billing Cycle
                </label>
                <select
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                  className="input-field"
                >
                  <option value="monthly">Monthly</option>
                  <option value="4 months">Every 4 months</option>
                  <option value="6 months">Every 6 months</option>
                  <option value="yearly">Yearly</option>
                  <option value="set manually">Set Manually</option>
                </select>
              </div>

              <div>
              {billingCycle === 'set manually' && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Next Renewal Date
                  </label>
                  <input
                    type="date"
                    value={renewalDate}
                    onChange={(e) => setRenewalDate(e.target.value)}
                    className="input-field"
                  />
                </div>
              )}

              <Button
                onClick={handleAddSubscription}
                disabled={!name || !amount || (billingCycle === 'set manually' && !renewalDate)}
                className="w-full btn-primary"
              >
                Add Subscription
              </Button>
            </div>
          </div>
        </div>
        )}

        {/* Subscriptions List */}
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Active Subscriptions</h2>
          {allSubscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              name={sub.name}
              amount={sub.amount}
              renewalDate={new Date(sub.renewalDate)}
              icon={sub.icon}
              dailyContribution={sub.dailyContribution}
            />
          ))}
        </div>

        {/* Tip */}
        <div className="mt-6 p-4 bg-primary/10 rounded-2xl border border-primary/20">
          <p className="text-sm text-foreground">
            💡 <strong>Tip:</strong> Setting aside ₹{dailyContribution.toFixed(0)} daily helps cover all your subscriptions without surprises!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
