const express = require("express");
const router = express.Router();
const { authorizePermissions } = require("../middleware/authMiddleware");

const {
  getAll,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/task");

router
  .route("/")
  .get(authorizePermissions("user"), getAll)
  .post(authorizePermissions("user"), create);
router
  .route("/:id")
  .get(authorizePermissions("user"), getOne)
  .patch(authorizePermissions("user"), update)
  .delete(authorizePermissions("user"), remove);

module.exports = router;
