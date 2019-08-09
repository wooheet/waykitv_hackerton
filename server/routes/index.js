const app = require("express");
const router = app.Router();

const _ = require('lodash');


router.get("/", async function (req, res) {
  res.send('aaa');
});

router.get("/login", async function (req, res) {

    res.send('login');
});

module.exports = router;
