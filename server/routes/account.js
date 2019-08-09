const router = require('express').Router();
const rest = require('../core/rest');

router.get('/', (req, res) => {
  res.send('');
});

router.get('/register', (req, res) => {


});

router.get('/login', (req, res) => {
    res.send("test");
});

router.get('/:account', async (req, res) => {
    await rest.account.getAccount(req.params.account)
      .then(resp => {
        res.status(200).send(resp);
      })
      .catch(error => {
        res.status(500).send(error);
      })
})


router.post('/faucet', async (req, res) => {
  await rest.tx.faucet(req.body.account)
    .then(resp => {
      res.status(200).send(resp);
    })
    .catch(error => {
      res.status(500).send(error.error);
    })
});


module.exports = router;
