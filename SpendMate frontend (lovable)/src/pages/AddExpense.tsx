import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { categories, subcategories } from '@/data/mockData';
import { ArrowLeft, Sparkles, Send, Calendar, Clock, Check } from 'lucide-react';
import { format } from 'date-fns';

export const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ai');
  
  // AI Input state
  const [aiInput, setAiInput] = useState('');
  const [aiParsed, setAiParsed] = useState<{
    amount: number;
    item: string;
    category: string;
    time: string;
  } | null>(null);

  // Manual Input state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));

  const handleAiParse = () => {
    // Mock AI parsing
    if (aiInput.toLowerCase().includes('burger') || aiInput.toLowerCase().includes('food')) {
      setAiParsed({
        amount: 180,
        item: 'Burger',
        category: 'food',
        time: '3:00 PM',
      });
    } else if (aiInput.toLowerCase().includes('auto') || aiInput.toLowerCase().includes('cab')) {
      setAiParsed({
        amount: 120,
        item: 'Auto ride',
        category: 'transport',
        time: '2:00 PM',
      });
    } else if (aiInput) {
      // Generic parse attempt
      const amountMatch = aiInput.match(/(\d+)/);
      setAiParsed({
        amount: amountMatch ? parseInt(amountMatch[1]) : 100,
        item: 'Expense',
        category: 'other',
        time: format(new Date(), 'h:mm a'),
      });
    }
  };

  const handleSave = () => {
    // Mock save - would normally save to state/backend
    navigate('/dashboard');
  };

  // Time-based category suggestions
  const getTimeSuggestions = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return ['food']; // Breakfast time
    if (hour >= 11 && hour < 15) return ['food', 'transport']; // Lunch
    if (hour >= 15 && hour < 18) return ['entertainment', 'shopping']; // Afternoon
    if (hour >= 18 && hour < 22) return ['food', 'entertainment']; // Evening
    return ['other'];
  };

  const suggestedCategories = getTimeSuggestions();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-display font-bold text-foreground">Add Expense</h1>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted p-1 rounded-xl">
            <TabsTrigger
              value="ai"
              className="rounded-lg data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Input
            </TabsTrigger>
            <TabsTrigger
              value="manual"
              className="rounded-lg data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground"
            >
              Manual
            </TabsTrigger>
          </TabsList>

          {/* AI Input Tab */}
          <TabsContent value="ai" className="animate-fade-up">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Tell us what you spent
                </label>
                <div className="relative">
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder='e.g., "I spent 180 on burger at 3 PM" or "Auto to college 50 rupees"'
                    className="input-field min-h-[100px] pr-12 resize-none"
                  />
                  <button
                    onClick={handleAiParse}
                    className="absolute right-3 bottom-3 p-2 rounded-lg gradient-primary text-primary-foreground"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {aiParsed && (
                <div className="card-elevated p-5 animate-scale-in">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">Parsed Expense</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="text-2xl font-display font-bold text-foreground">₹{aiParsed.amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Item</span>
                      <span className="font-medium text-foreground">{aiParsed.item}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium text-foreground capitalize">{aiParsed.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium text-foreground">{aiParsed.time}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSave}
                    className="w-full btn-primary mt-4"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Save Expense
                  </Button>
                </div>
              )}

              <div className="text-center text-sm text-muted-foreground">
                <p>Try natural language like:</p>
                <p className="text-foreground mt-1">"Coffee 80 rupees morning"</p>
                <p className="text-foreground">"Uber to mall 150"</p>
              </div>
            </div>
          </TabsContent>

          {/* Manual Input Tab */}
          <TabsContent value="manual" className="animate-fade-up">
            <div className="space-y-6">
              {/* Suggested Categories */}
              {!selectedCategory && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Suggested for this time
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories
                      .filter(c => suggestedCategories.includes(c.id))
                      .map(cat => (
                        <CategoryChip
                          key={cat.id}
                          icon={cat.icon}
                          label={cat.name}
                          onClick={() => setSelectedCategory(cat.id)}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* All Categories */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {selectedCategory ? 'Selected Category' : 'All Categories'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <CategoryChip
                      key={cat.id}
                      icon={cat.icon}
                      label={cat.name}
                      selected={selectedCategory === cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedSubcategory('');
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              {selectedCategory && subcategories[selectedCategory] && (
                <div className="animate-fade-up">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Subcategory
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {subcategories[selectedCategory].map(sub => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedSubcategory === sub
                            ? 'gradient-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-secondary'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Item Name */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Item / Description
                </label>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  placeholder="What did you spend on?"
                  className="input-field"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="input-field pl-10 text-2xl font-display font-bold"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={!selectedCategory || !amount}
                className="w-full btn-primary h-14 text-lg disabled:opacity-50"
              >
                <Check className="w-5 h-5 mr-2" />
                Save Expense
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AddExpense;
