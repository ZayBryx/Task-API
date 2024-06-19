const jwt = require("jsonwebtoken");
const {
  BadRequestError,
  NotFoundError,
  UnathenticatedError,
} = require("../errors");
const Token = require("../models/token");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnathenticatedError("Unathenticated");
  }

  const token = authHeader.split(" ")[1];

  const isRevoked = await Token.findOne({ token });

  if (isRevoked?.blackListed === true) {
    throw new UnathenticatedError("Token Invalid: Unathenticated");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      ...payload,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnathenticatedError("Token is expired");
    }
    throw new UnathenticatedError("Authentication Invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnathenticatedError("Unauthorized access to this route");
    }
    next();
  };
};

module.exports = { authMiddleware, authorizePermissions };
