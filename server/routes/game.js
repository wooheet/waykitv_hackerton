const router = require('express').Router();
const rest = require('../core/rest');
const constants = require('../constants');
const util = require('./utils');

router.get('/', (req, res) => {
  res.send('');
});

router.post('/hosting', async (req, res) => {


  util.createTx()


})


router.post('/vote', async (req, res) => {

});


module.exports = router;
