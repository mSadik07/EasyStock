const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  businessName: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);