const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  clockInTime: Date,
  clockOutTime: Date,
  workHistory: [
    {
      date: Date,
      duration: Number, // In seconds
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
