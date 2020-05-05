class CustomError extends Error {
  constructor(message, responseCode = 500) {
    super(message);
    this.name = 'CustomError';
    this.responseCode = responseCode;
    Error.captureStackTrace(this, CustomError);
  }
}

module.exports = CustomError;
