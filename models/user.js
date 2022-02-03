const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Name: { type: String, lowercase: true },
  Email: String,
  ReferedUser: { type: String, default: null, lowercase: true },
  isPaymentMade: { type: Boolean, default: false },
  TotalEarnings: { type: Number, default: 0 },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
