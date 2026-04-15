import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GoalCard } from '@/components/ui/GoalCard';
import { ArrowLeft, Plus, Target, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';

export const Goals: React.FC = () => {
  const navigate = useNavigate();
  const [showAddGoal, setShowAddGoal] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [goals, setGoals] = useState<any[]>([]);

  React.useEffect(() => {
    api.get('/extra/goals').then(res => setGoals(res.data)).catch(console.error);
  }, []);

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  const handleAddGoal = async () => {
    try {
      const res = await api.post('/extra/goals', { 
        title, 
        targetAmount: Number(targetAmount), 
        targetDate 
      });
      setGoals([res.data, ...goals]);
      setShowAddGoal(false);
      setTitle('');
      setTargetAmount('');
      setTargetDate('');
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
            <h1 className="text-lg font-display font-bold text-foreground">Savings Goals</h1>
          </div>
          <Button
            onClick={() => setShowAddGoal(true)}
            size="sm"
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Goal
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto pb-24">
        {/* Summary */}
        <div className="gradient-primary rounded-2xl p-5 mb-6 text-primary-foreground">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-80">Total Progress</p>
              <p className="text-2xl font-display font-bold">
                ₹{totalSaved.toLocaleString()} / ₹{totalTarget.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${(totalSaved / totalTarget) * 100}%` }}
            />
          </div>
          <p className="text-sm opacity-80 mt-2">
            {Math.round((totalSaved / totalTarget) * 100)}% of all goals achieved
          </p>
        </div>

        {/* Add Goal Form */}
        {showAddGoal && (
          <div className="card-elevated p-5 mb-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">New Savings Goal</h3>
              <button
                onClick={() => setShowAddGoal(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., New Laptop, Trip to Goa"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Target Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="0"
                    className="input-field pl-10 text-xl font-display font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Target Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="input-field"
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              <Button
                onClick={handleAddGoal}
                disabled={!title || !targetAmount || !targetDate}
                className="w-full btn-primary"
              >
                Create Goal
              </Button>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-4">
          <h2 className="font-semibold text-foreground">Active Goals</h2>
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              title={goal.title}
              targetAmount={goal.targetAmount}
              currentAmount={goal.currentAmount}
              targetDate={new Date(goal.targetDate)}
              color={goal.color}
            />
          ))}
        </div>

        {goals.length === 0 && !showAddGoal && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No goals yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Start saving for something special!
            </p>
            <Button onClick={() => setShowAddGoal(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
