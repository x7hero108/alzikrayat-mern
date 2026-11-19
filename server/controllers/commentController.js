const mongoose = require('mongoose');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');

// GET /api/photos/:id/comments
const getByPhoto = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const comments = await Comment.find({ photoId: req.params.id })
      .populate('userId', 'firstName lastName')
      .sort({ dateTime: 1 });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// POST /api/photos/:id/comments  (logged-in users only)
const create = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id) || !(await Photo.exists({ _id: req.params.id }))) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const comment = await Comment.create({
      photoId: req.params.id,
      userId: req.user._id,
      comment: req.body.comment
    });

    await comment.populate('userId', 'firstName lastName');
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

module.exports = { getByPhoto, create };
