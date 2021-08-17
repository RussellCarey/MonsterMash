const AppError = require("../utils/AppError");

exports.sendSuccessData = (req, res, data) => {
  res.json({
    status: "success",
    data: data,
  });
};

exports.sendFailedStatus = (req, res, error, data) => {
  return new AppError("Generic caught error", 302);
};
