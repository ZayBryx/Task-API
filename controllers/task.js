const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Task = require("../models/task");

const getAll = async (req, res) => {
  const { userId } = req.user;

  const tasks = await Task.find({ createdBy: userId })
    .populate("createdBy", "username")
    .select("_id title description status createdBy");

  res.status(StatusCodes.OK).json(tasks);
};

const getOne = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const tasks = await Task.findOne({ _id: id, createdBy: userId })
    .populate("createdBy", "username")
    .select("_id title description status createdBy");

  res.status(StatusCodes.OK).json(tasks === null ? [] : tasks);
};

const create = async (req, res) => {
  const { userId } = req.user;
  const { title, description } = req.body;

  const tasks = await Task.create({ title, description, createdBy: userId });
  res.status(StatusCodes.CREATED).json(tasks);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { title, description, status } = req.body;

  const tasks = await Task.findOneAndUpdate(
    { _id: id, createdBy: userId },
    { title, description, status },
    { new: true }
  )
    .populate("createdBy", "username")
    .select("_id title description status createdBy");

  if (!tasks) {
    throw new BadRequestError("Task not found");
  }

  res.status(StatusCodes.OK).json(tasks);
};

const remove = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const tasks = await Task.findOneAndDelete({ _id: id, createdBy: userId })
    .populate("createdBy", "username")
    .select("_id title description status createdBy");

  if (!tasks) {
    throw new BadRequestError("Task not found");
  }

  res.status(StatusCodes.OK).json({ message: "Removed successfully" });
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
