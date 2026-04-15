const router = require('express').Router();
const { getMonthlyInsights, getYearlyInsights } = require('../controllers/insightController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/monthly', getMonthlyInsights);
router.get('/yearly', getYearlyInsights);

module.exports = router;
