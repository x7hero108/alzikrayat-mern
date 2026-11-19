const mongoose = require('mongoose');
const User = require('../models/User');

// Basic authentication (Project 3): the client sends the logged-in user's id in the
// "x-user-id" header. We check that it belongs to a real user before any write operation.
// Token based auth (JWT) is the optional bonus of Project 4.
const requireUser = async (req, res, next) => {
  try {
    const userId = req.get('x-user-id');

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ message: 'Please login first' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: 'Please login first' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { requireUser };
