const express = require("express");
const router = express.Router();
const { authorizePermissions } = require("../middleware/authMiddleware");

const {
  createTask,
  getAllTask,
  getOneTask,
  removeTask,
  updateTask,
} = require("../controllers/Admin/task");

const { getOneUser, getAllUser } = require("../controllers/Admin/user");

router
  .route("/task")
  .get(authorizePermissions("admin"), getAllTask)
  .post(authorizePermissions("admin"), createTask);
router
  .route("/task/:id")
  .get(authorizePermissions("admin"), getOneTask)
  .patch(authorizePermissions("admin"), updateTask)
  .delete(authorizePermissions("admin"), removeTask);

router.get("/user", authorizePermissions("admin"), getAllUser);
router.get("/user/:id", authorizePermissions("admin"), getOneUser);

module.exports = router;
