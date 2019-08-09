'use strice';

class UserException {

  constructor(namespace, errorCode, method, error) {
    this._namespace = NAMESPACE[namespace] || namespace;
    this._message = ERROR_MESSAGE[errorCode] || errorCode;
    this._method = method;
    this._error = error;
  }
}


const NAMESPACE = {
  query: 'elasticsearch-query',
  ygg: 'yggdrash-client',
  parser: 'elasticsearch-parser'

};

const ERROR_MESSAGE = {
  PARSE_EXCEPTION: 'Elastic Search Parse Exception. See server/es/parser.js'

};


module.exports = UserException;
