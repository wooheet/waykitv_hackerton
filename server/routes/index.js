const app = require("express");
const router = app.Router();

const _ = require('lodash');


router.get("/", async function (req, res) {
  res.send('aaa');
});

module.exports = router;
