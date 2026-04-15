const router = require('express').Router();
const { createGroup, addExpense, getGroup, getUserGroups } = require('../controllers/groupController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/', createGroup);
router.get('/', getUserGroups);
router.get('/:id', getGroup);
router.post('/:id/addExpense', addExpense);

module.exports = router;
