import BaseError from './base.error';

export default class APIError extends BaseError {
  constructor(message, httpCode, errors = [], name = 'API Error') {
    super(message, errors, httpCode, name);
  }
}
