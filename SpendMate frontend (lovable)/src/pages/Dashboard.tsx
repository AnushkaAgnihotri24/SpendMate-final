import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatCard } from '@/components/ui/StatCard';
import { ExpenseCard } from '@/components/ui/ExpenseCard';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Users, 
  Target, 
  BookOpen, 
  TrendingUp,
  Settings,
  Moon,
  Sun,
  CreditCard,
  BarChart3
} from 'lucide-react';
import { mockExpenses, mockMonthlyReview } from '@/data/mockData';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useOnboarding();
  const { theme, toggleTheme } = useTheme();

  const dailyLimit = data.recommendedLimits.daily || 500;
  const todaySpent = 350;
  const remaining = dailyLimit - todaySpent;
  const spentPercentage = (todaySpent / dailyLimit) * 100;

  const quickActions = [
    { icon: Plus, label: 'Add Expense', path: '/add-expense', color: 'gradient-primary' },
    { icon: Users, label: 'Split', path: '/shared-split', color: 'gradient-accent' },
    { icon: Target, label: 'Goals', path: '/goals', color: 'gradient-success' },
    { icon: BookOpen, label: 'Ledger', path: '/ledger', color: 'bg-purple-500' },
  ];

  const recentExpenses = mockExpenses.slice(0, 3);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
            {data.avatar || '😊'}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Good morning,</p>
            <h1 className="text-xl font-display font-bold text-foreground">
              {data.profileName || 'Student'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-muted hover:bg-secondary transition-colors md:hidden"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-foreground" />
            )}
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 rounded-xl bg-muted hover:bg-secondary transition-colors"
          >
            <Settings className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Daily Budget Card */}
      <div className="card-elevated p-5 mb-6 animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Remaining Today</p>
            <p className={`text-3xl font-display font-bold ${
              remaining < 0 ? 'text-destructive' : 'text-foreground'
            }`}>
              ₹{remaining.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Spent</p>
            <p className="text-xl font-semibold text-foreground">₹{todaySpent}</p>
          </div>
        </div>
        <ProgressBar 
          value={todaySpent} 
          max={dailyLimit}
          variant={spentPercentage > 100 ? 'danger' : spentPercentage > 80 ? 'warning' : 'default'}
          showLabel
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {quickActions.map(({ icon: Icon, label, path, color }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card border border-border hover:shadow-md transition-all duration-200"
          >
            <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-foreground">{label}</span>
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          title="This Month"
          value={`₹${mockMonthlyReview.totalSpent.toLocaleString()}`}
          subtitle="spent so far"
          trend="down"
          trendValue="12% less than last month"
        />
        <StatCard
          title="Saved"
          value={`₹${mockMonthlyReview.totalSaved.toLocaleString()}`}
          subtitle="this month"
          trend="up"
          trendValue="Great progress!"
          variant="primary"
        />
      </div>

      {/* Mini Trend Chart */}
      <div className="card-elevated p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Weekly Trend</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/monthly-review')}
            className="text-primary"
          >
            View Report
            <BarChart3 className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="flex items-end justify-between gap-2 h-24">
          {mockMonthlyReview.dailySpendTrend.map((day, index) => {
            const maxAmount = Math.max(...mockMonthlyReview.dailySpendTrend.map(d => d.amount));
            const height = (day.amount / maxAmount) * 100;
            const isToday = index === mockMonthlyReview.dailySpendTrend.length - 1;
            
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    isToday ? 'gradient-primary' : 'bg-muted'
                  }`}
                  style={{ height: `${height}%` }}
                />
                <span className={`text-xs ${isToday ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => navigate('/subscriptions')}
          className="flex items-center gap-3 p-4 card-elevated hover:shadow-lg transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground text-sm">Subscriptions</p>
            <p className="text-xs text-muted-foreground">4 active</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/monthly-review')}
          className="flex items-center gap-3 p-4 card-elevated hover:shadow-lg transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground text-sm">Monthly Review</p>
            <p className="text-xs text-muted-foreground">Score: 78</p>
          </div>
        </button>
      </div>

      {/* Recent Expenses */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Recent Expenses</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/add-expense')}
            className="text-primary"
          >
            See All
          </Button>
        </div>
        <div className="space-y-3">
          {recentExpenses.map((expense, index) => (
            <ExpenseCard key={expense.id} {...expense} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
