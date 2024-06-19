const CustomError = require("./custom-error");
const BadRequestError = require("./badRequest");
const NotFoundError = require("./notFound");
const UnathenticatedError = require("./unathenticated");

module.exports = {
  BadRequestError,
  NotFoundError,
  UnathenticatedError,
  CustomError,
};
