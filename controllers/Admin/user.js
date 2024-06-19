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

  res.status(StatusCodes.OK).json(user);
};

const getAllUser = async (req, res) => {
  const user = await User.find({ role: "user" }).select("_id username role");

  res.status(StatusCodes.OK).json(user);
};

module.exports = {
  getOneUser,
  getAllUser,
};
