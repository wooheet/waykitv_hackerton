const app = require("express");
const router = app.Router();

const _ = require('lodash');

const rest = require('../core/rest');

var bitcore = require('wicc-wallet-lib');

var privateKey = bitcore.PrivateKey.fromWIF('Y9x4iimB6AYp3b73nRzaJHHZdEHcwb1A61LVyvpXVTgfbbdUj172')

var arg = {network: 'testnet'}
var wiccApi = new bitcore.WiccApi(arg)


router.get("/", async function (req, res) {
  // let commonTx = new bitcore.Transaction.CommonTx(createCommonTx());
  // // console.log(commonTx);
  //
  // let tx = bitcore.Transaction.ContractTx(createContractTx());
  //
  // console.log(tx);
  //
  // let hex = commonTx.SerializeTx(privateKey);
  //
  // let raw = tx.SerializeTx(privateKey);
  //
  // // let raw = wiccApi.createSignTransaction(privateKey, bitcore.WiccApi.CONTRACT_TX, tx);
  //
  // await rest.sendRawTx(raw)
  //   .then(resp => {
  //     res.status(200).send(resp)
  //   })
  //   .catch(reason => {
  //     res.status(400).send(reason)
  //   });

});





function createCommonTx() {
  return {
    nTxType: 3,
    nVersion: 1,
    nValidHeight: 1108210,
    fees: 10000,
    srcRegId: '1108180-1',
    destAddr: 'wWuHJyrBoX7kVsnxNNNT3iDwdAD47h4eLY',
    value:100000000,
    network: 'testnet'
  }

}

function createContractTx() {

  return {
    nTxType: bitcore.WiccApi.CONTRACT_TX,
    nVersion: 1,
    nValidHeight: 1108384,    // create height
    srcRegId: "1105782-2",    // sender's regId
    destRegId: "1108505-1",  // app regId
    fees: 1000000,         // fees pay for miner
    value: 8,              // amount of WICC to be sent to the app account
    vContract: "0001000000000000000000000000000000000000"      // contract method, hex format string
  }

}

router.use('/account', require('./account'));
router.use('/game', require('./game'));


module.exports = router;
