'use strict';
const config = require('../../config');
const logger = require('../logger');

const url = `${config.wayki.host}`;

const axios = require('axios');

logger.info(`Request to ProxyNode Address : ${url}`);

const client = axios.create({
    baseURL: url,
    timeout: 3000,
});

module.exports = client;




