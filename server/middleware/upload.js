const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const allowedTypes = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp'
};

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    // random file name, extension is taken from the MIME type (not from the user)
    cb(null, crypto.randomBytes(16).toString('hex') + allowedTypes[file.mimetype]);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!allowedTypes[file.mimetype]) {
      const err = new Error('Only JPG, PNG, GIF and WEBP images are allowed');
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  }
});

module.exports = upload;
