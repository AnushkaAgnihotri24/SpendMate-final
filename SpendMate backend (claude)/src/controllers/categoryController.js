const STATIC_CATEGORIES = [
  'Food',
  'Travel',
  'Entertainment',
  'Shopping',
  'Health',
  'Education',
  'Utilities',
  'Rent',
  'Groceries',
  'Fuel',
  'Subscriptions',
  'Other'
];

exports.getCategories = (req, res) => {
  res.json(STATIC_CATEGORIES);
};
