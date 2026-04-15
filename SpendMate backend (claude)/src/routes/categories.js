const router = require('express').Router();
const { getCategories } = require('../controllers/categoryController');
const auth = require('../middleware/auth');

router.get('/', auth, getCategories);

module.exports = router;
