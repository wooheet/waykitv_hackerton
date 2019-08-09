

function createTx(accountId, height, contractId, value, message) {
  return {
    nTxType: 4,                 //bitcore.WiccApi.CONTRACT_TX,
    nVersion: 1,
    nValidHeight: height,    // create height
    srcRegId: accountId,    // sender's regId
    destRegId: contractId,  // app regId
    fees: 1000000,         // fees pay for miner
    value: value * 100000000,              // amount of WICC to be sent to the app account
    vContract: "0001000000000000000000000000000000000000"      // contract method, hex format string
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
    fees: 500000000,           // fees pay for miner
  };





}

module.exports = {
  createTx: createTx,
  createGame: createGame
};

