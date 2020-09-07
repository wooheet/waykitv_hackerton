const logger = require('../core/logger');

const client = require('./axios/axios');

var http = require('http');

function options(account) {
  return {
    hostname: 'https://faucet.wiccdev.org/testnet/getwicc/',
    path: account
  }
}

function handleResponse(response) {
  var serverData = '';
  response.on('data', function (chunk) {
    serverData += chunk;
  });
  response.on('end', function () {
    console.log("received server data:");
    console.log(serverData);
  });
}

let account = {
  getAccount: async (account) => {
    return new Promise((resolve, reject) => {
      client.post(`/account/getaccountinfo`, {
        address: account
      }).then(response => {
        if (response.data) {
          // logger.info(response.data);
          resolve(response.data);
        } else
          reject(response);
      }).catch(error => {
        logger.error(error);
        reject(error);
      })
    })
  }
};

let tx = {
  sendRawTx: async (rawTx) => {
    return new Promise((resolve, reject) => {
      client.post(`/transaction/sendrawtx`, {
        rawtx: rawTx
      }).then(response => {
        if (response.data) {
          logger.info(response.data);
          resolve(response.data);
        } else
          reject(response);
      })
        .catch(error => {
          logger.error(error);
        })
    })
  },

  getGameData: async (body) => {
    return new Promise((resolve, reject) => {
      client.post(`/contract/getcontractdata`, body).then(response => {
        if (response.data) {
          resolve(response.data);
        } else
          reject(response);
      })
        .catch(error => {
          logger.error(error);
        })
    })
  },

  faucet: async (account) => {
    http.request(options(account), function (response) {
      handleResponse(response);
    }).end();
  }
};

let block = {
  getHeight: async () => {
    return new Promise((resolve, reject) => {
      client.post(`/block/getblockcount`)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else
            reject(response);
        })
        .catch(error => {
          reject(error);
        })
    })

  }

};

let contract = {
  getContractId: async (txhash) => {
    return new Promise((resolve, reject) => {
        client.post(`/contract/getcontractregid`, {
          txhash
        })
          .then(response => {
            if (response.data) {
              resolve(response.data);
            } else
              reject(response);
          })
          .catch(error => {
            reject(error);
          })
      })

  }
}


module.exports = {
  account: account,
  tx: tx,
  block: block,
  contract: contract
};


// module.exports = {
//     sendRawTx: async (rawTx) => {
//         return new Promise((resolve, reject) => {
//             client.post(`/transaction/sendrawtx`, {
//                 rawtx: rawTx
//             }).then(response => {
//                 if (response.data) {
//                     logger.info(response.data);
//                     resolve(response.data);
//                 }
//                 else
//                     reject(response);
//             })
//               .catch(error => {
//                   logger.error(error);
//               })
//         })
//
//     },
//
// };


