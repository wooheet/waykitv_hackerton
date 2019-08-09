'use strice';

class Response {

  constructor(success, data) {
    if (typeof success !== 'boolean') {
      throw new Error('success type is boolean');
    }

    this._success = success;
    this._data = data;

  }

  get data() {
    return this._data;
  }

  isSuccess() {
    return this._success;
  }

}


module.exports = Response;
