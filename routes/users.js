const express = require('express');
const router = express.Router();
const wicc = require('wicc-wallet-lib');
let arg = {network: 'testnet'}
let api = new wicc.WiccApi(arg)
let password = '1234567890'

router.get('/', function(req, res, next) {
  let strMne = api.createAllCoinMnemonicCode()
  console.log('New MnemonicCode='+ strMne)

  let ret = api.checkMnemonicCode(strMne)
  console.log('Check MnemonicCode Result=' + ret)

  let privateKey1 = api.getPriKeyFromMnemonicCode(strMne)
  console.log('privateKey1='+privateKey1)

  let walletInfo = api.createWallet(strMne, password)
  console.log(walletInfo)

  res.send(strMne);
});

module.exports = router;
