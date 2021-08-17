class AppError extends Error {
  constructor(message, statusCode) {
    // Parent class is 'super and passes the message to our incomming message
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "Error";
    this.customMessage = message;
    this.isOperational = true;

    // Not add to the stack trace and pollute it.
    Error.captureStackTrace(this, this.constuctor);
  }
}

module.exports = AppError;
