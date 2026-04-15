import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { mockFriends, mockSharedExpenses } from '@/data/mockData';
import { ArrowLeft, Plus, Users, Check, Send, X } from 'lucide-react';
import { format } from 'date-fns';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  share: number;
}

export const SharedSplit: React.FC = () => {
  const navigate = useNavigate();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 'me', name: 'Me', avatar: '😊', share: 0 },
  ]);
  const [showAddFriend, setShowAddFriend] = useState(false);

  const addFriend = (friend: typeof mockFriends[0]) => {
    if (!participants.find(p => p.id === friend.id)) {
      setParticipants([...participants, { ...friend, share: 0 }]);
    }
    setShowAddFriend(false);
  };

  const removeFriend = (id: string) => {
    if (id !== 'me') {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const splitEvenly = () => {
    const amount = parseFloat(totalAmount) || 0;
    const share = Math.round(amount / participants.length);
    setParticipants(participants.map(p => ({ ...p, share })));
  };

  const updateShare = (id: string, share: number) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, share } : p
    ));
  };

  const myShare = participants.find(p => p.id === 'me')?.share || 0;
  const totalShares = participants.reduce((sum, p) => sum + p.share, 0);
  const isBalanced = totalShares === parseFloat(totalAmount);

  const handleSave = () => {
    // Mock save
    setShowAddExpense(false);
    setTitle('');
    setTotalAmount('');
    setParticipants([{ id: 'me', name: 'Me', avatar: '😊', share: 0 }]);
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
            <h1 className="text-lg font-display font-bold text-foreground">Shared Split</h1>
          </div>
          <Button
            onClick={() => setShowAddExpense(true)}
            size="sm"
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Split
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto pb-24">
        {/* Add Expense Form */}
        {showAddExpense ? (
          <div className="animate-fade-up space-y-4">
            <div className="card-elevated p-5">
              <h2 className="font-semibold text-foreground mb-4">New Shared Expense</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    What's this for?
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Pizza Party, Movie Night"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Total Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">₹</span>
                    <input
                      type="number"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      placeholder="0"
                      className="input-field pl-10 text-2xl font-display font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="card-elevated p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Split Between</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={splitEvenly}
                    disabled={!totalAmount}
                  >
                    Split Evenly
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddFriend(true)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-3 bg-muted rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-lg">
                      {participant.avatar || participant.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{participant.name}</p>
                    </div>
                    <div className="relative w-24">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                      <input
                        type="number"
                        value={participant.share || ''}
                        onChange={(e) => updateShare(participant.id, parseFloat(e.target.value) || 0)}
                        className="input-field py-2 pl-6 text-right font-medium"
                      />
                    </div>
                    {participant.id !== 'me' && (
                      <button
                        onClick={() => removeFriend(participant.id)}
                        className="p-1 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Friend Dropdown */}
              {showAddFriend && (
                <div className="mt-3 p-3 bg-secondary rounded-xl animate-scale-in">
                  <p className="text-sm font-medium text-foreground mb-2">Add Friend</p>
                  <div className="space-y-2">
                    {mockFriends
                      .filter(f => !participants.find(p => p.id === f.id))
                      .map(friend => (
                        <button
                          key={friend.id}
                          onClick={() => addFriend(friend)}
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            {friend.avatar}
                          </div>
                          <span className="text-foreground">{friend.name}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {totalAmount && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Total Shares</span>
                    <span className={`font-medium ${isBalanced ? 'text-success' : 'text-warning'}`}>
                      ₹{totalShares} / ₹{totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground font-medium">Your Share</span>
                    <span className="text-xl font-display font-bold text-primary">₹{myShare}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAddExpense(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!title || !totalAmount || !isBalanced}
                className="flex-1 btn-primary"
              >
                <Send className="w-4 h-4 mr-2" />
                Save & Notify
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Past Shared Expenses */}
            <div className="space-y-4">
              <h2 className="font-semibold text-foreground">Recent Splits</h2>
              
              {mockSharedExpenses.map((expense) => (
                <div key={expense.id} className="card-elevated p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{expense.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(expense.date, 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-display font-bold text-foreground">
                        ₹{expense.totalAmount}
                      </p>
                      {expense.settled ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success font-medium">
                          Settled
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning font-medium">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {expense.participants.length} people
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {expense.participants.map((p, i) => (
                      <div
                        key={i}
                        className="px-3 py-1 bg-muted rounded-full text-sm"
                      >
                        <span className="text-foreground">{p.name}</span>
                        <span className="text-muted-foreground ml-1">₹{p.share}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-muted-foreground">Your Share</span>
                    <span className="text-lg font-display font-bold text-primary">
                      ₹{expense.yourShare}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SharedSplit;
