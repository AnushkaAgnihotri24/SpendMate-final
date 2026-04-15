const router = require('express').Router();
const { getSuggestion, categorizeExpense } = require('../controllers/smartController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/suggest', getSuggestion);
router.post('/categorize', categorizeExpense);

module.exports = router;
