const AppError = require("../utils/AppError");

exports.sendSuccessData = (req, res, data) => {
  res.json({
    status: "success",
    data: data ? data : null,
  });
};
