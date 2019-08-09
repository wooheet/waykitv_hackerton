const router = require('express').Router();
const rest = require('../core/rest');
const constants = require('../constants');
const util = require('./utils');

const fs = require('fs');
const path = require('path');
const wicc = require('wicc-wallet-lib');

var wiccApi = new wicc.WiccApi({network: 'testnet'});

router.get('/', async (req, res) => {
  let hostVote = {
    key: constants.VOTE_HOST,
    regid: constants.HOSTING_CONTRACT,
    returndatatype: 'HEX'
  };

  let guestVote= {
    key: constants.VOTE_GUEST,
    regid: constants.HOSTING_CONTRACT,
    returndatatype: 'HEX'
  };

  await rest.tx.getGameData(hostVote)
    .then(resp => {
      console.log(resp);
    })
    .catch(error => {
      console.log(error);
    })

  await rest.tx.getGameData(guestVote)
    .then(resp => {
      console.log(resp);
    })
    .catch(error => {
      console.log(error);
    })

  res.end();
});

router.post('/hosting', async (req, res) => {

  let account = req.body.account;

  try {
    let userInfo = await rest.account.getAccount(account);
    let block = await rest.block.getHeight();

    let script = fs.readFileSync(path.join(__dirname, '../../contract/demo.lua') , 'utf8');
    let contractTx = util.createGame(userInfo.data.regid, block.data, script);

    // test key
    var privateKey = wicc.PrivateKey.fromWIF('Y9x4iimB6AYp3b73nRzaJHHZdEHcwb1A61LVyvpXVTgfbbdUj172')

    let rawTx = wiccApi.createSignTransaction(privateKey, 5, contractTx);

    // console.log(rawTx);
    let txHash = await rest.tx.sendRawTx(rawTx);
    console.log(txHash.data.hash);

    res.send(txHash.data.hash);

    // let contractId = await rest.contract.getContractId(txHash.data.hash);
    // console.log(contractId);
    // console.log(txHash);

  } catch (e) {
    console.error(e);
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

})


router.post('/vote', async (req, res) => {
  let account = req.body.account;
  let value = req.body.value;
  let contract = req.body.contract;

  try {
    let userInfo = await rest.account.getAccount(account);
    let block = await rest.block.getHeight();

    let txBody = util.createTx(userInfo.data.regid, block.data, contract, value);

    var privateKey = wicc.PrivateKey.fromWIF('Y9x4iimB6AYp3b73nRzaJHHZdEHcwb1A61LVyvpXVTgfbbdUj172')

    let rawTx = wiccApi.createSignTransaction(privateKey, 4, txBody);

    let result = await rest.tx.sendRawTx(rawTx);

    console.log(result);

    res.send(result);

  } catch (e) {
    console.error(e);
  }
});


module.exports = router;
