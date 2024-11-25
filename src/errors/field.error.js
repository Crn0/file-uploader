import BaseError from './base.error';

class FieldError extends BaseError {
  constructor(message, errors, httpCode, name = 'Validation Error') {
    super(message, errors, httpCode, name);
  }
}

export default FieldError;
