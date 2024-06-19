const { StatusCodes } = require("http-status-codes");
const Task = require("../../models/task");
const { BadRequestError, NotFoundError } = require("../../errors");

const createTask = async (req, res) => {
  const { title, description, createdBy } = req.body;

  const task = await Task.create({ title, description, createdBy });

  res.status(StatusCodes.CREATED).json(task);
};

const getAllTask = async (req, res) => {
  const { userId } = req.query;
  let query = {};

  if (userId) {
    query.createdBy = user;
  }

  const task = await Task.find(query)
    .populate("createdBy", "username")
    .select("_id title description status createdBy");

  res.status(StatusCodes.OK).json(task);
};

const getOneTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id)
    .populate("createdBy", "username")
    .select("_id title description status createdBy");

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  res.status(StatusCodes.OK).json(task);
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const task = await Task.findByIdAndUpdate(
    id,
    { title, description, status },
    { new: true }
  ).select("_id title description status createdBy");

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  res.status(StatusCodes.OK).json(task);
};

const removeTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findByIdAndDelete(id);

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  res.status(StatusCodes.OK).json({ message: "Deleted successfully" });
};

module.exports = {
  createTask,
  getAllTask,
  getOneTask,
  removeTask,
  updateTask,
};
