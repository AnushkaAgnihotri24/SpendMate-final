import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LedgerEntry } from '@/components/ui/LedgerEntry';
import { mockLedger } from '@/data/mockData';
import { ArrowLeft, Plus, TrendingDown, TrendingUp } from 'lucide-react';

export const Ledger: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('owe');
  const [showAddEntry, setShowAddEntry] = useState(false);

  // Form state
  const [entryType, setEntryType] = useState<'owe' | 'owedToMe'>('owe');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const totalOwed = mockLedger.owe.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const totalOwedToMe = mockLedger.owedToMe.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalOwedToMe - totalOwed;

  const handleAddEntry = () => {
    // Mock add
    setShowAddEntry(false);
    setName('');
    setAmount('');
    setReason('');
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
            <h1 className="text-lg font-display font-bold text-foreground">Ledger</h1>
          </div>
          <Button
            onClick={() => setShowAddEntry(true)}
            size="sm"
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Entry
          </Button>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto pb-24">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card-elevated p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <span className="text-sm text-muted-foreground">I Owe</span>
            </div>
            <p className="text-2xl font-display font-bold text-destructive">
              ₹{totalOwed.toLocaleString()}
            </p>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Owed to Me</span>
            </div>
            <p className="text-2xl font-display font-bold text-success">
              ₹{totalOwedToMe.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Net Balance */}
        <div className={`card-elevated p-4 mb-6 ${
          netBalance >= 0 ? 'border-l-4 border-l-success' : 'border-l-4 border-l-destructive'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Net Balance</span>
            <span className={`text-xl font-display font-bold ${
              netBalance >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {netBalance >= 0 ? '+' : ''}₹{netBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Add Entry Form */}
        {showAddEntry && (
          <div className="card-elevated p-5 mb-6 animate-scale-in">
            <h3 className="font-semibold text-foreground mb-4">New Entry</h3>
            
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setEntryType('owe')}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                  entryType === 'owe'
                    ? 'bg-destructive/20 text-destructive border-2 border-destructive'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                I Owe
              </button>
              <button
                onClick={() => setEntryType('owedToMe')}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                  entryType === 'owedToMe'
                    ? 'bg-success/20 text-success border-2 border-success'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                Owed to Me
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Person's name"
                className="input-field"
              />
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="input-field pl-10"
                />
              </div>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason (e.g., lunch bill)"
                className="input-field"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddEntry(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddEntry}
                disabled={!name || !amount}
                className="flex-1 btn-primary"
              >
                Add Entry
              </Button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted p-1 rounded-xl">
            <TabsTrigger
              value="owe"
              className="rounded-lg data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive"
            >
              Money I Owe
            </TabsTrigger>
            <TabsTrigger
              value="owedToMe"
              className="rounded-lg data-[state=active]:bg-success/20 data-[state=active]:text-success"
            >
              Owed to Me
            </TabsTrigger>
          </TabsList>

          <TabsContent value="owe" className="space-y-3">
            {mockLedger.owe.map((entry) => (
              <LedgerEntry
                key={entry.id}
                {...entry}
                date={new Date(entry.date)}
                status={entry.status as 'pending' | 'settled'}
                type="owe"
                onSettle={() => {}}
              />
            ))}
          </TabsContent>

          <TabsContent value="owedToMe" className="space-y-3">
            {mockLedger.owedToMe.map((entry) => (
              <LedgerEntry
                key={entry.id}
                {...entry}
                date={new Date(entry.date)}
                status={entry.status as 'pending' | 'settled'}
                type="owedToMe"
                onSettle={() => {}}
                onRemind={() => {}}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Ledger;
