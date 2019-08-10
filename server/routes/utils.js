const constant = require('../constants');

function createTx(accountId, height, contractId, value, message) {
  return {
    nTxType: 4,                 //bitcore.WiccApi.CONTRACT_TX,
    nVersion: 1,
    nValidHeight: height,    // create height
    srcRegId: accountId,    // sender's regId
    destRegId: contractId,  // app regId
    fees: 1000000,         // fees pay for miner
    value: value * 100000000,              // amount of WICC to be sent to the app account
    vContract: message      // contract method, hex format string
  }
}

function createGame(accountId, height, script) {

  return {
    nTxType: 5,
    nVersion: 1,
    nValidHeight: height,       // create height
    regAcctId: accountId,      // sender's regId
    script: script,            // contract scrypt content, string or buf
    scriptDesc: "",            // contract scrypt description, string or buf
    fees: 100000000,           // fees pay for miner
  };
}

function toHex(str) {
  var result = '';
  for (var i=0; i<str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
}

function initMessage(host, guest) {
  return constant.INITIALIZE_METHOD + toHex(host) + toHex(guest) + constant.END_TIME;
}

function voteMessage(target) {
  if (target === 'host') {
    return constant.VOTE_METHOD + constant.VOTING_TO_HOST;
  }

  return constant.VOTE_METHOD + constant.VOTING_TO_GUEST;




}

module.exports = {
  createTx: createTx,
  createGame: createGame,
  toHex: toHex,
  initMessage: initMessage,
  voteMessage: voteMessage
};

