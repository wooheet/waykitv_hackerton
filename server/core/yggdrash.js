const config = require('../config');
const logger = require('../core/logger');

const _ = require('lodash');
const BigNumber = require('bignumber.js');

const {Ygg} = require('@yggdrash/sdk');

const url = `${config.yggdrash.node.protocol}${config.yggdrash.node.ip}:${config.yggdrash.node.port}`;
const ygg = new Ygg(new Ygg.providers.HttpProvider(url));

const client = require('./axios/axios');

const UserException = require('../model/exception');

const _namesapce = 'ygg';
const _message = 'request-error';
const _prefix = 'ygg-';

/**
 * todo: Improve this method for applying multi branch.
 * todo: Apply correct way in programming perspective.
 */
let branchId = config.yggdrash.branch.id;
let contractVersion = config.yggdrash.contract.version;

function parseBranch(data) {
    _.forIn(data, (value, key) => {
        // logger.info('branchId : %s', key);
        branchId = key;
        if (value.contracts) {
            let contract = _.find(value.contracts, (contract) => {
                return contract.name === 'YEED';
            });
            contractVersion = contract.contractVersion;
        }
    })
}

/**
 * @Desc SDK function caller.
 *
 */
module.exports = {
    getBranches: async () => {
        logger.info('Branch Id:%s\tContractVersion:%s', branchId, contractVersion);
        return new Promise(((resolve, reject) => {
            client.get('/branches')
                .then(response => {
                    if (response.data) {
                        parseBranch(response.data);
                        resolve(response.data);
                    } else
                        reject(response);
                })
                .catch(error => {
                    // if (error.response && error.response.data && error.response.data.error) {
                    //     console.error("REST request error!", error.response.data.error);
                    //     reject(error.response.data.error);
                    // } else
                    //     reject(error);
                    reject(new UserException(_namesapce, _message, `${_prefix}getBranches`, error));
                });

        }))


    },

    getBalance: async (account) => {
        logger.info('Branch Id:%s\tContractVersion:%s', branchId, contractVersion);

        return new Promise((resolve, reject) => {
            ygg.client.getBalance(branchId, contractVersion, account)
              .then(response => {
                  resolve(response);
              })
              .catch(error => {
                  reject(new UserException(_namesapce, _message, `${_prefix}geBalance`, error));
              })

        });

        // let response = await ygg.client.getBalance(branchId, contractVersion, account);
        // return new BigNumber(response).toFixed();
    },

    getTxReceipt: (txId) => {
        logger.info('Branch Id:%s\tContractVersion:%s', branchId, contractVersion);
        return new Promise((resolve, reject) => {
            client.get(`/branches/${branchId}/txr/${txId}`)
                .then(response => {
                    if (response.data)
                        resolve(response.data);
                    else
                        reject(response);
                })
                .catch(error => {
                    // if (error.response && error.response.data && error.response.data.error) {
                    //     console.error("REST request error!", error.response.data.error);
                    //     reject(error.response.data.error);
                    // } else
                    //     reject(error);
                    reject(new UserException(_namesapce, _message, `${_prefix}getTxReceipt`, error));
                });
        })
    },

    getAllContractList: async () => {
        logger.info('Branch Id:%s\tContractVersion:%s', branchId, contractVersion);
        return new Promise(((resolve, reject) => {
            client.get(`contract/${branchId}/search`)
                .then(response => {
                    if (response.data)
                        resolve(response.data);
                    else
                        reject(response);
                })
                .catch(error => {
                    reject(new UserException(_namesapce, _message, `${_prefix}getAllContractList`, error));
                })
        }))
    },


    getBlockById: async (id) => {
        return new Promise(((resolve, reject) => {
            client.get(`branches/${branchId}/blocks/${id}`)
                .then(response => {
                    if (response.data)
                        resolve(response.data);
                    else
                        reject(response);
                })
                .catch(error => {
                    reject(new UserException(_namesapce, _message, `${_prefix}getBlockById`, error));
                })
        }))

    },

    getBlockByIndex: async (index, limit) => {

        return new Promise(((resolve, reject) => {
            client.get(`branches/${branchId}/blocks?offset=${index}&limit=${limit || 1}`)
              .then(response => {
                  if (response.data)
                      resolve(response.data);
                  else
                      reject(response);
              })
              .catch(error => {
                  reject(new UserException(_namesapce, _message, `${_prefix}getBlockByIndex`, error));
              })
        }))



    },

    getTxById: async (id) => {

        return new Promise(((resolve, reject) => {
            client.get(`branches/${branchId}/txs/${id}`)
                .then(response => {
                    if (response.data)
                        resolve(response.data);
                    else
                        reject(response);
                })
                .catch(error => {
                    // if (error.response && error.response.data && error.response.data.error) {
                    //     console.error("REST request error!", error.response.data.error);
                    //     reject(error.response.data.error);
                    // } else
                    //     reject(error);
                    reject(new UserException(_namesapce, _message, `${_prefix}getTxById`, error));
                })
        }))

    }
};


