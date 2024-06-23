const express = require("exprss");
const router = express.Router();

router.get("/", (req, res) => {
  const { userId, username, role } = req.user;
  res.status(200).json({ user: { userId, username, role } });
});

module.exports = router;
