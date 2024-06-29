const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../../errors");
const User = require("../../models/user");

const getOneUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id, { role: "user" }).select(
    "_id username role"
  );

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.status(StatusCodes.OK).json({ name: user.username, value: user._id });
};

const getAllUser = async (req, res) => {
  const user = await User.find({ role: "user" }).select("_id username");
  const option = [];
  user.map((u) => {
    option.push({ name: u.username, value: u._id });
  });

  res.status(StatusCodes.OK).json(option);
};

module.exports = {
  getOneUser,
  getAllUser,
};
