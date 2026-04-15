const FriendRequest = require('../models/FriendRequest');
const Friendship = require('../models/Friendship');
const User = require('../models/User');

exports.sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId) return res.status(400).json({ error: 'receiverId required' });
    if (receiverId === req.userId) return res.status(400).json({ error: 'Cannot add yourself' });

    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ error: 'User not found' });

    // Check if already friends
    const alreadyFriends = await Friendship.findOne({
      $or: [
        { user1: req.userId, user2: receiverId },
        { user1: receiverId, user2: req.userId }
      ]
    });
    if (alreadyFriends) return res.status(409).json({ error: 'Already friends' });

    const request = await FriendRequest.create({ senderId: req.userId, receiverId });
    res.status(201).json(request);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Request already sent' });
    res.status(500).json({ error: err.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      receiverId: req.userId,
      status: 'pending'
    }).populate('senderId', 'name email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await FriendRequest.findOne({
      _id: requestId,
      receiverId: req.userId,
      status: 'pending'
    });
    if (!request) return res.status(404).json({ error: 'Request not found' });

    request.status = 'accepted';
    await request.save();

    // Create friendship (ensure consistent ordering)
    const [u1, u2] = [request.senderId, request.receiverId].sort();
    await Friendship.create({ user1: u1, user2: u2 });

    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const friendships = await Friendship.find({
      $or: [{ user1: req.userId }, { user2: req.userId }]
    }).populate('user1', 'name email').populate('user2', 'name email');

    const friends = friendships.map(f => {
      const friend = f.user1._id.toString() === req.userId ? f.user2 : f.user1;
      return { ...friend.toObject(), friendshipId: f._id };
    });

    res.json(friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    const query = { _id: { $ne: req.userId } };
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('name email').limit(20);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
