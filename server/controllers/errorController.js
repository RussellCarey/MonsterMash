const AppError = require("../utils/AppError");

//? Notes
//? In prod it gets a custom message to display when using CREATE APP ERROR, blank is a generic message.
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  //! IN production decide what to do with the errors.
  if (process.env.NODE_ENV === "production") {
    const error = { ...err };
    let errorMessage;

    if (error.customMessage) {
      errorMessage = error.customMessage;
    } else {
      errorMessage =
        "Something unusual seems to have occured. Please try again or contact us if it persists!";
    }

    //! Render an error page.. or something..
    return res.status(err.statusCode).render("errorPage", {
      title: "Error",
      errorCode: err.statusCode,
      errorMessage: errorMessage,
    });
  }

  if (process.env.NODE_ENV === "development") {
    const errorMessage = error.message;
    return next(new AppError(`Something went wrong!::: ${errorMessage}, 111`));
  }
};
