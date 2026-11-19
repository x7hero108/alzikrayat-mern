const express = require('express');
const photoController = require('../controllers/photoController');
const { requireUser } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/api/photos', photoController.getAll);
router.get('/api/photos/:id', photoController.getOne);
router.post('/api/photos', requireUser, upload.single('photo'), validate('photo'), photoController.create);
router.delete('/api/photos/:id', requireUser, photoController.remove);

module.exports = router;
