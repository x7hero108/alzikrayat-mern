const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');

const uploadsDir = path.join(__dirname, '..', 'uploads');

// GET /api/photos
const getAll = async (req, res, next) => {
  try {
    const photos = await Photo.find()
      .populate('userId', 'firstName lastName')
      .sort({ dateTime: -1 });
    res.json(photos);
  } catch (err) {
    next(err);
  }
};

// GET /api/photos/:id
const getOne = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const photo = await Photo.findById(req.params.id).populate('userId', 'firstName lastName');
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.json(photo);
  } catch (err) {
    next(err);
  }
};

// POST /api/photos  (logged-in users only, multipart/form-data)
const create = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please select a photo', errors: ['Please select a photo'] });
    }

    const photo = await Photo.create({
      userId: req.user._id,
      fileName: req.file.filename,
      title: req.body.title,
      description: req.body.description
    });

    await photo.populate('userId', 'firstName lastName');
    res.status(201).json(photo);
  } catch (err) {
    // database failed: do not keep the orphan file
    if (req.file) {
      fs.unlink(path.join(uploadsDir, req.file.filename), () => {});
    }
    next(err);
  }
};

// DELETE /api/photos/:id  (owner only, checked on the server)
const remove = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (!photo.userId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You are not allowed to delete this photo' });
    }

    await photo.deleteOne();
    // same behaviour as ON DELETE CASCADE in the old MySQL version
    await Comment.deleteMany({ photoId: photo._id });
    fs.unlink(path.join(uploadsDir, photo.fileName), () => {});

    res.json({ message: 'Photo deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, remove };
