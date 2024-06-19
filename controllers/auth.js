const User = require("../models/user");
const Token = require("../models/token");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new BadRequestError("Incorrect Password");
  }

  const token = await user.generateToken();
  await Token.create({ token });

  res.status(StatusCodes.CREATED).json({
    token,
    user: { userId: user._id, username: user.username, role: user.role },
  });
};

const register = async (req, res) => {
  const { username, password } = req.body;

  const ifExist = await User.findOne({ username });

  if (ifExist) {
    throw new BadRequestError("Username is already taken");
  }

  const user = await User.create(req.body);
  const token = await user.generateToken();

  res.status(StatusCodes.CREATED).json({
    token,
    user: { userId: user._id, username: user.username, role: user.role },
  });
};

const logout = async (req, res) => {
  const jwt = req.headers["authorization"];

  if (!jwt || !jwt.startsWith("Bearer ")) {
    throw new UnathenticatedError("Invalid Token");
  }
  const token = jwt.split(" ")[1];

  const isExist = await Token.findOne({ token });
  if (!isExist) {
    throw new BadRequestError("");
  }

  req.user = undefined;

  res.status(StatusCodes.OK).json({ message: "logged out successfully" });
};

module.exports = {
  login,
  register,
  logout,
};
