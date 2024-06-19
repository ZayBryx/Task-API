const { StatusCodes } = require("http-status-codes");
const CustomError = require("./custom-error");

class UnathenticatedError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnathenticatedError;
