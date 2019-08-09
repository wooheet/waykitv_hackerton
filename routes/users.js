const express = require('express');
const router = express.Router();
const wicc = require('wicc-wallet-lib');
let arg = {network: 'testnet'}
let api = new wicc.WiccApi(arg)
let password = '1234567890'

// var privateKey = new wicc.PrivateKey();
// var address = privateKey.toAddress();

router.get('/', function(req, res, next) {

  // Wallet
  let strMne = api.createAllCoinMnemonicCode()
  let ret = api.checkMnemonicCode(strMne)
  let address = api.getAddressFromMnemonicCode(strMne)
  let privateKey = new wicc.PrivateKey.fromWIF(api.getPriKeyFromMnemonicCode(strMne))
  let walletInfo = api.createWallet(strMne, password)

  // Transaction
  var registeraccounttxInfo = {
      nTxType: 2,         //REGISTER_ACCOUNT_TX
      nVersion: 1,
      nValidHeight: 219831,
      fees: 10000,
      minerPubkey: '',
      pubkey: address
  }

 // let rawTx =  api.createSignTransaction(privateKey, api.REGISTER_ACCOUNT_TX, registeraccounttxInfo)



  res.send(strMne);
});

module.exports = router;
