const router = require('express').Router();
const rest = require('../core/rest');
const constants = require('../constants');
const util = require('./utils');

const fs = require('fs');
const path = require('path');
const wicc = require('wicc-wallet-lib');

var wiccApi = new wicc.WiccApi({network: 'testnet'});

let roomList = [];


router.post('/', async (req, res) => {


  let hostVote = {
    key: constants.VOTE_HOST,
    regid: req.body.contract,
    returndatatype: 'NUMBER'
  };

  let guestVote= {
    key: constants.VOTE_GUEST,
    regid: req.body.contract,
    returndatatype: 'NUMBER'
  };

  let result = {
    host: undefined,
    guest: undefined
  };

  await rest.tx.getGameData(hostVote)
    .then(resp => {
      console.log(resp);
      result.host = resp.data.value;
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error);
    })

  await rest.tx.getGameData(guestVote)
    .then(resp => {
      console.log(resp);
      result.guest = resp.data.value;
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error);
    })

  result['total'] = result.host + result.guest;
  res.status(200).send(result);
});

router.post('/hosting', async (req, res) => {

  console.log("game", req.body.privateKey)
  let privateKey = wicc.PrivateKey.fromWIF(req.body.privateKey);
  let pkaddr = privateKey.toAddress();
  let account = pkaddr.toString()

  try {
    let userInfo = await rest.account.getAccount(account);
    let block = await rest.block.getHeight();
    let script = fs.readFileSync(path.join(__dirname, '../../contract/demo.lua') , 'utf8');
    let contractTx = util.createGame(userInfo.data.regid, block.data, script);

    // test key
    // var privateKey = wicc.PrivateKey.fromWIF('Y9x4iimB6AYp3b73nRzaJHHZdEHcwb1A61LVyvpXVTgfbbdUj172')

    let rawTx = wiccApi.createSignTransaction(privateKey, 5, contractTx);

    // console.log(rawTx);
    let txHash = await rest.tx.sendRawTx(rawTx);
    console.log("game txHash.data.hash", txHash.data.hash);

    let roomInfo = {
      host: account,
      contract: undefined,
      hash: txHash.data.hash,
      voter: 0
    };

    roomList.push(roomInfo);

    res.send(txHash.data.hash);

    // let contractId = await rest.contract.getContractId(txHash.data.hash);
    // console.log(contractId);
    // console.log(txHash);

  } catch (e) {
    console.error(e);
  }
});

router.post('/init', async (req, res) => {
  let contract = req.body.contract; //1111137-1
  let host = req.body.host;
  let guest = req.body.guest;
  // let privateKey = wicc.PrivateKey.fromWIF(req.body.privateKey);



  try {
    let userInfo = await rest.account.getAccount(host);
    let block = await rest.block.getHeight();

    let message = util.initMessage(host, guest);

    let txBody = util.createTx(userInfo.data.regid, block.data, contract, 0, message);

    console.log(txBody);

    var privateKey = wicc.PrivateKey.fromWIF('Y9x4iimB6AYp3b73nRzaJHHZdEHcwb1A61LVyvpXVTgfbbdUj172')

    let rawTx = wiccApi.createSignTransaction(privateKey, 4, txBody);

    let response = rest.tx.sendRawTx(rawTx);

    res.send(response);

  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }


});

router.get('/number/:hash', async (req, res) => {
  try {
    let contract = await rest.contract.getContractId(req.params.hash);
    if (contract.data) {
      return res.send(contract.data.regid);
    }
    res.send('uncomfirmed');

  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }

});



router.post('/vote', async (req, res) => {
  let account = req.body.account;
  let value = req.body.value;
  let contract = req.body.contract;
  let target = req.body.target;

  console.log(account);
  console.log(contract);

  try {
    let userInfo = await rest.account.getAccount(account);
    let block = await rest.block.getHeight();

    let message = util.voteMessage(target);

    let txBody = util.createTx(userInfo.data.regid, block.data, contract, value, message);

    var privateKey = wicc.PrivateKey.fromWIF('Y9x4iimB6AYp3b73nRzaJHHZdEHcwb1A61LVyvpXVTgfbbdUj172')

    let rawTx = wiccApi.createSignTransaction(privateKey, 4, txBody);

    let result = await rest.tx.sendRawTx(rawTx);

    console.log(result);

    res.send(result);

  } catch (e) {
    console.error(e);
  }
});

router.get('/end', async (req, res) => {
  let account = req.body.account;
  let value = req.body.value;
  let contract = req.body.contract;

  try {
    let userInfo = await rest.account.getAccount(account);
    let block = await rest.block.getHeight();

    let message = constants.END_METHOD;

    let txBody = util.createTx(userInfo.data.regid, block.data, contract, value, message);

    console.log(txBody);

    var privateKey = wicc.PrivateKey.fromWIF('Y9x4iimB6AYp3b73nRzaJHHZdEHcwb1A61LVyvpXVTgfbbdUj172')

    let rawTx = wiccApi.createSignTransaction(privateKey, 4, txBody);

    let result = await rest.tx.sendRawTx(rawTx);

    console.log(result);

    res.send(result);

  } catch (e) {
    console.error(e);
  }


})

router.get('/rooms', async (req, res) => {
  res.send(roomList);
});


module.exports = router;
