const User = require("../../models/user");
const Task = require("../../models/task");

const getDashboard = async (req, res) => {
  const usersWithTaskCount = await User.aggregate([
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "createdBy",
        as: "tasks",
      },
    },
    {
      $addFields: {
        doneTasks: {
          $filter: {
            input: "$tasks",
            as: "task",
            cond: { $eq: ["$$task.status", true] },
          },
        },
      },
    },
    {
      $project: {
        username: 1,
        role: 1,
        totalTasks: { $size: "$tasks" },
        doneTasks: { $size: "$doneTasks" },
      },
    },
    {
      $match: {
        role: "user",
      },
    },
  ]);

  res.status(200).json(usersWithTaskCount);
};

module.exports = { getDashboard };
