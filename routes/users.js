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

  let txInfo = {
      nTxType: 2,         //REGISTER_ACCOUNT_TX
      nVersion: 1,
      nValidHeight: 219831,
      fees: 10,
      pubkey: privateKey.toPublicKey().toString(),
      minerPubkey: ''
  };

    // console.log(api.REGISTER_ACCOUNT_TX)
  let rawTx =  api.createSignTransaction(privateKey, 2, txInfo)
    console.log("reg app tx raw: ")
    console.log(rawTx)

  res.send(strMne);
});

module.exports = router;
