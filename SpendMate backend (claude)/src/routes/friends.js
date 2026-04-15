const router = require('express').Router();
const { sendRequest, getRequests, acceptRequest, getFriends, searchUsers } = require('../controllers/friendController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/request', sendRequest);
router.get('/requests', getRequests);
router.post('/accept', acceptRequest);
router.get('/', getFriends);
router.get('/search', searchUsers);

module.exports = router;
