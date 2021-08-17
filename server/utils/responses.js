exports.sendSuccessData = (req, res, data) => {
  res.json({
    status: "success",
    data: data,
  });
};

exports.sendFailedStatus = (req, res, error, data) => {
  console.dir(error || "Error occured");
  res.json({
    status: "failed",
  });
};
