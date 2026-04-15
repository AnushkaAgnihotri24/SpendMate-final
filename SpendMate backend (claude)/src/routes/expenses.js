const router = require('express').Router();
const { createExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/', createExpense);
router.get('/', getExpenses);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
