const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  blackListed: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date(Date.now()) },
});

module.exports = mongoose.model("TokenBlackList", tokenSchema);
