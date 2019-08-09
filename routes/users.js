const express = require('express');
const router = express.Router();
const wicc = require('wicc-wallet-lib');
const fs = require("fs")
const path = require("path")
let arg = {network: 'testnet'}
let api = new wicc.WiccApi(arg)
let password = '1234567890'

router.get('/', function(req, res, next) {

  // Wallet
  // let strMne = api.createAllCoinMnemonicCode()
    let strMne = 'such account wise drink slab any figure throw neither estate art series'
  // //Check if the mnemonic is valid
  api.checkMnemonicCode(strMne)
  let address = api.getAddressFromMnemonicCode(strMne)
  let privateKey = new wicc.PrivateKey.fromWIF(api.getPriKeyFromMnemonicCode(strMne))
  // let address2 = privateKey.toAddress();
  let walletInfo = api.createWallet(strMne, password)

  // //Check if the address is valid
  // api.validateAddress(address)

  // Transaction
    // REGISTER CONTRACT
  //   const contractLocation =  path.join(__dirname, "../contract/contract-hello.lua");
  // let script = fs.readFileSync(contractLocation);

    /*
    WiccApi.PROTOCAL_VERSION = 1;
      WiccApi.REGISTER_ACCOUNT_TX = 2;
      WiccApi.COMMON_TX = 3;
      WiccApi.CONTRACT_TX = 4;
      WiccApi.REG_APP_TX = 5,   	//!< register app
      WiccApi.DELEGATE_TX = 6;
     */

    //REGISTER_ACCOUNT_TX 2
  let txInfo = {
      nTxType: 2,         //REGISTER_ACCOUNT_TX
      nVersion: 1,
      nValidHeight: 219831,
      fees: 10000000,
      pubkey: privateKey.toPublicKey().toString(),
      minerPubkey: ''
  };

    //COMMON_TX 3

    var commonTxinfo = {
        nTxType: 3,
        nVersion: 1,
        nValidHeight: 602371,
        fees: 10000,
        srcRegId: '54528-1',
        destAddr: 'wZPQNFru7fWVyWqmcFEY6zZ51HudiKA29C',
        value:1,
        network: 'testnet'
    };

    let data = {
      "code": 0,
      "msg": "success",
      "data": {
        "ver": 1,
        "fees": 10004,
        "desregid": " ",
        "money": 100000000,
        "desaddr": "wZPQNFru7fWVyWqmcFEY6zZ51HudiKA29C",
        "regid": "1105782-2",
        "arguments": null,
        "addr": "wdKQ6tn6AJ7URWdZ3W3UUejsBDRoDq5n9g",
        "txtype": "COMMON_TX",
        "hash": "eef4962931ddf809c47377def4d35bcaa71f741a7f4bb71a6c19dbfc8026e07f",
        "height": 1107498
      }
    }

    //CONTRACT_TX 4
    // var regAppInfo = {
    //     nTxType: 4,
    //     nVersion: 1,
    //     nValidHeight: 34400,    // create height
    //     srcRegId: "22030-2",    // sender's regId
    //     destRegId: "24555-1",  // app regId
    //     fees: 1000000,         // fees pay for miner
    //     value: 1,              // amount of WICC to be sent to the app account
    //     vContract: "f018"      // contract method, hex format string
    // };

    // let commonTx = wicc.Transaction.CommonTx(commonTxinfo)
    // let hex = commonTx.SerializeTx(privateKey)
    // let ret = commonTx._SignatureHash()
    // console.log(ret.toString('hex'))
    // let result = commonTx._Signtx(privateKey);
    // console.log(result)

    let rawTx =  api.createSignTransaction(privateKey, 3, commonTxinfo)
    console.log("reg app tx raw: ")
    console.log(rawTx)

  res.send(strMne);
});

module.exports = router;
