class BaseError extends Error {
  constructor(message, errors, httpCode, name) {
    super(message);
    this.errors = errors;
    this.httpCode = httpCode;
    this.name = name;
  }
}

export default BaseError;
