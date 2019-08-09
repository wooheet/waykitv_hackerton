const express = require('express');
const router = express.Router();

const wicc = require('wicc-wallet-lib');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var privateKey = new wicc.PrivateKey();
  var address = privateKey.toAddress();

  console.log(address);
  console.log(privateKey);
  res.send(address);
});

module.exports = router;
