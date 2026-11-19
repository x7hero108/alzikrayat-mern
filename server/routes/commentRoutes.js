const express = require('express');
const commentController = require('../controllers/commentController');
const { requireUser } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.get('/api/photos/:id/comments', commentController.getByPhoto);
router.post('/api/photos/:id/comments', requireUser, validate('comment'), commentController.create);

module.exports = router;
