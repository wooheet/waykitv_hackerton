const app = require("express");
const router = app.Router();

router.get("/", async function (req, res) {
  console.log("route index")
});


router.use('/account', require('./account'));
router.use('/game', require('./game'));


module.exports = router;
