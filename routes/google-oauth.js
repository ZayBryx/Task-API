const express = require("express");
const router = express.Router();
const { authToken } = require("../controllers/oauth");

router.post("/auth", authToken);

module.exports = router;
