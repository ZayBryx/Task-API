const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    minLength: [3, "Username must be minimum 3 characters"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password must be minimum 8 characters"],
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>ยง?|]).{8,}$/,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character",
    ],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// userSchema.methods.generateAccessToken = function () {
//   return jwt.sign(
//     { userId: this._id, username: this.username, role: this.role },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.ACCESS_LIFETIME }
//   );
// };

// userSchema.methods.generateRefreshToken = function () {
//   return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.REFRESH_LIFETIME,
//   });
// };

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { userId: this._id, username: this.username, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

userSchema.methods.isPasswordCorrect = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
