const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
