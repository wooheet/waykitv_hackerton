// const wicc = require('wicc-wallet-lib');
// const api = new wicc.WiccApi({network : 'testnet'});
// const Transaction = wicc.Transaction;
//
// let privateKey = new wicc.PrivateKey(wicc.Networks.testnet);
//
// let address = privateKey.toAddress(wicc.Networks.testnet);
//
// console.log(address);
// console.log(privateKey);
//
// console.log(wicc.Address.isValid(address, wicc.Networks.testnet));
//
// let txInfo = {
//   "amount": 10000,
//   "recviver": "wZPQNFru7fWVyWqmcFEY6zZ51HudiKA29C",
//   "sender": "wdKQ6tn6AJ7URWdZ3W3UUejsBDRoDq5n9g"
// };
//
// let raw = api.createSignTr
//
// ansaction(privateKey, 2, txInfo);
//
// console.log(raw);
//
//
//

'use strict'

// const express = require("express");
var bitcore = require('wicc-wallet-lib');

var privateKey = bitcore.PrivateKey.fromWIF('Y9x4iimB6AYp3b73nRzaJHHZdEHcwb1A61LVyvpXVTgfbbdUj172')

var arg = {network: 'testnet'}
var wiccApi = new bitcore.WiccApi(arg)

// 验证地址
var ret = wiccApi.validateAddress('wPcHigM3Gbtbooxyd3YyBXiMintZnfD7cE')
console.log(ret)

/*
Build a transaction for common transfer
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when deploying a smart contract, >= 10000 sawi (0.0001 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
*/
/*
构建普通转账交易的交易单
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:发布合约时的手续费, >= 10000 sawi(0.0001 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
*/
var commonTxinfo = {
  nTxType: 3,
  nVersion: 1,
  nValidHeight: 1107498,
  fees: 10000,
  srcRegId: '1105782-2',
  destAddr: 'wZPQNFru7fWVyWqmcFEY6zZ51HudiKA29C',
  value:100000000,
  network: 'testnet'
};

var value = 10000000000
var tmp = (value >>> 7)


var commonTx = new bitcore.Transaction.CommonTx(commonTxinfo);
console.log(commonTx.network)

/*
  var ret = commonTx._SignatureHash()
var ret = commonTx._SignatureHash()
console.log(ret.toString('hex'))
commonTx._Signtx(privateKey);
*/

var hex = commonTx.SerializeTx(privateKey)
console.log(hex)

let t = "Hello";

console.log(toHex(t));

function toHex(str) {
  var result = '';
  for (var i=0; i<str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
}

var myBuffer = [];

var buffer = new Buffer(t, 'utf16le');
for (var i = 0; i < buffer.length; i++) {
  myBuffer.push(buffer[i]);
}

console.log(myBuffer);



// Wallet
// let strMne = api.createAllCoinMnemonicCode()
let strMne = 'such account wise drink slab any figure throw neither estate art series'
// //Check if the mnemonic is valid
api.checkMnemonicCode(strMne)
let address = api.getAddressFromMnemonicCode(strMne)
let privateKey = new wicc.PrivateKey.fromWIF(api.getPriKeyFromMnemonicCode(strMne))
// let address2 = privateKey.toAddress();
let walletInfo = api.createWallet(strMne, password)
