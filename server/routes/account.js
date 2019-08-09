const router = require('express').Router();
const rest = require('../core/rest');

router.get('/', (req, res) => {
  res.send('');
});

router.post('/', (req, res) => {
  let pwd = req.params.pwd;

});

router.post('/register', (req, res) => {


});

router.post('/login', (req, res) => {
    let pwd = req.params.pwd;

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
