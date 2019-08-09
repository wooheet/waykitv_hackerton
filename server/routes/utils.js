

function createTx(accountId, contractId, fee, value) {
  return {
    nTxType: 4,                 //bitcore.WiccApi.CONTRACT_TX,
    nVersion: 1,
    nValidHeight: 1108384,    // create height
    srcRegId: "1105782-2",    // sender's regId
    destRegId: "1108505-1",  // app regId
    fees: 1000000,         // fees pay for miner
    value: 8,              // amount of WICC to be sent to the app account
    vContract: "0001000000000000000000000000000000000000"      // contract method, hex format string
  }
}

module.exports = {
  createTx: createTx
};

