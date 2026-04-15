export const categories = [
  { id: 'food', name: 'Food & Drinks', icon: '🍔', color: 'hsl(15 85% 60%)' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: 'hsl(200 70% 50%)' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'hsl(280 70% 60%)' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'hsl(330 70% 55%)' },
  { id: 'education', name: 'Education', icon: '📚', color: 'hsl(168 65% 45%)' },
  { id: 'health', name: 'Health', icon: '💊', color: 'hsl(145 60% 45%)' },
  { id: 'utilities', name: 'Utilities', icon: '💡', color: 'hsl(45 90% 50%)' },
  { id: 'other', name: 'Other', icon: '📦', color: 'hsl(220 15% 50%)' },
];

export const subcategories: Record<string, string[]> = {
  food: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Groceries'],
  transport: ['Bus', 'Auto', 'Cab', 'Metro', 'Fuel', 'Parking'],
  shopping: ['Clothes', 'Electronics', 'Books', 'Accessories', 'Home'],
  entertainment: ['Movies', 'Games', 'Concerts', 'Streaming', 'Sports'],
  education: ['Books', 'Courses', 'Stationery', 'Printing', 'Software'],
  health: ['Medicine', 'Doctor', 'Gym', 'Personal Care'],
  utilities: ['Phone', 'Internet', 'Electricity', 'Water'],
  other: ['Gifts', 'Donations', 'Miscellaneous'],
};

export const avatarPresets = [
  '😊', '🤓', '😎', '🥳', '🤗', '😇', '🦄', '🐱', '🐶', '🦊', '🐼', '🐨'
];

export const mockExpenses = [
  { id: '1', category: 'food', subcategory: 'Lunch', item: 'Burger', amount: 180, date: new Date(), time: '15:00' },
  { id: '2', category: 'transport', subcategory: 'Auto', item: 'College to Mall', amount: 120, date: new Date(), time: '14:00' },
  { id: '3', category: 'entertainment', subcategory: 'Movies', item: 'Cinema Ticket', amount: 350, date: new Date(Date.now() - 86400000), time: '19:00' },
  { id: '4', category: 'food', subcategory: 'Dinner', item: 'Pizza', amount: 450, date: new Date(Date.now() - 86400000), time: '21:00' },
  { id: '5', category: 'shopping', subcategory: 'Books', item: 'Novel', amount: 299, date: new Date(Date.now() - 172800000), time: '16:00' },
];

export const mockFriends = [
  { id: '1', name: 'Rahul', avatar: '🤓' },
  { id: '2', name: 'Priya', avatar: '😊' },
  { id: '3', name: 'Amit', avatar: '😎' },
  { id: '4', name: 'Sneha', avatar: '🥳' },
];

export const mockSharedExpenses = [
  { 
    id: '1', 
    title: 'Pizza Party', 
    totalAmount: 1200, 
    date: new Date(), 
    participants: [
      { friendId: '1', name: 'Rahul', share: 300 },
      { friendId: '2', name: 'Priya', share: 300 },
      { friendId: 'me', name: 'Me', share: 600 },
    ],
    yourShare: 600,
    settled: false,
  },
  { 
    id: '2', 
    title: 'Movie Night', 
    totalAmount: 800, 
    date: new Date(Date.now() - 86400000), 
    participants: [
      { friendId: '1', name: 'Rahul', share: 400 },
      { friendId: 'me', name: 'Me', share: 400 },
    ],
    yourShare: 400,
    settled: true,
  },
];

export const mockLedger = {
  owe: [
    { id: '1', name: 'Rahul', amount: 500, date: new Date(Date.now() - 172800000), reason: 'Lunch bill', status: 'pending' },
    { id: '2', name: 'Priya', amount: 200, date: new Date(Date.now() - 259200000), reason: 'Movie ticket', status: 'pending' },
  ],
  owedToMe: [
    { id: '3', name: 'Amit', amount: 350, date: new Date(Date.now() - 86400000), reason: 'Shared cab', status: 'pending' },
    { id: '4', name: 'Sneha', amount: 150, date: new Date(Date.now() - 432000000), reason: 'Coffee', status: 'settled' },
  ],
};

export const mockGoals = [
  { id: '1', title: 'New Laptop', targetAmount: 50000, currentAmount: 12000, targetDate: new Date('2024-06-01'), color: 'hsl(168 65% 45%)' },
  { id: '2', title: 'Trip to Goa', targetAmount: 15000, currentAmount: 8000, targetDate: new Date('2024-03-15'), color: 'hsl(15 85% 60%)' },
  { id: '3', title: 'Emergency Fund', targetAmount: 10000, currentAmount: 4500, targetDate: new Date('2024-04-01'), color: 'hsl(145 60% 45%)' },
];

export const mockSubscriptions = [
  { id: '1', name: 'Netflix', amount: 199, renewalDate: new Date('2024-02-15'), icon: '🎬', dailyContribution: 6.63 },
  { id: '2', name: 'Spotify', amount: 119, renewalDate: new Date('2024-02-20'), icon: '🎵', dailyContribution: 3.97 },
  { id: '3', name: 'Amazon Prime', amount: 179, renewalDate: new Date('2024-03-01'), icon: '📦', dailyContribution: 5.97 },
  { id: '4', name: 'Gym Membership', amount: 1500, renewalDate: new Date('2024-02-28'), icon: '💪', dailyContribution: 50 },
];

export const mockMonthlyReview = {
  totalSpent: 18500,
  totalSaved: 3500,
  topCategory: { name: 'Food & Drinks', amount: 6200, percentage: 33.5 },
  bestSavingDay: { date: new Date('2024-01-15'), saved: 450 },
  highestSharedExpenseDay: { date: new Date('2024-01-20'), amount: 1200 },
  achievements: [
    { id: '1', title: 'Budget Master', description: 'Stayed under budget for 15 days', icon: '🏆' },
    { id: '2', title: 'Saver\'s Streak', description: '7-day saving streak', icon: '🔥' },
    { id: '3', title: 'Split Expert', description: 'Settled all splits on time', icon: '🤝' },
  ],
  monthlyScore: 78,
  dailySpendTrend: [
    { day: 'Mon', amount: 450 },
    { day: 'Tue', amount: 320 },
    { day: 'Wed', amount: 580 },
    { day: 'Thu', amount: 290 },
    { day: 'Fri', amount: 720 },
    { day: 'Sat', amount: 890 },
    { day: 'Sun', amount: 410 },
  ],
};
