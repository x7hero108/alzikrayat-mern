const mongoose = require('mongoose');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// User schema: password always stores a bcrypt hash, never plain text
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First name is required'], trim: true },
  lastName: { type: String, required: [true, 'Last name is required'], trim: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailPattern, 'Please enter a valid email']
  },
  password: { type: String, required: [true, 'Password is required'], select: false },
  location: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  occupation: { type: String, trim: true, default: '' }
});

// Never leak the password hash in JSON responses
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
