const router = require('express').Router();
const rest = require('../core/rest');
const constants = require('../constants');
const util = require('./utils');

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



})


router.post('/vote', async (req, res) => {

});


module.exports = router;
