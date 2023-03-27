class HttpError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.code = errorCode;
  }
  // TODO; We can store error logs
}

module.exports = HttpError;