const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  clockInTime: Date,
  clockOutTime: Date,
  workHistory: [
    {
      start: Date,
      end: Date,
    },
  ],
});

module.exports = mongoose.model('user', userSchema);
