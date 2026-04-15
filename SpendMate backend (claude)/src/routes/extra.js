const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getGoals, addGoal,
  getSubscriptions, addSubscription,
  getLedger, addLedger, settleLedger,
  getSharedExpenses, addSharedExpense, settleSharedExpense
} = require('../controllers/extraController');

router.use(auth);

// Goals
router.get('/goals', getGoals);
router.post('/goals', addGoal);

// Subscriptions
router.get('/subscriptions', getSubscriptions);
router.post('/subscriptions', addSubscription);

// Ledger
router.get('/ledger', getLedger);
router.post('/ledger', addLedger);
router.put('/ledger/:id/settle', settleLedger);

// Shared Expenses
router.get('/shared', getSharedExpenses);
router.post('/shared', addSharedExpense);
router.put('/shared/:id/settle', settleSharedExpense);

module.exports = router;
