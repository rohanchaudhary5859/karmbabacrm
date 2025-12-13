
const router = require("express").Router();
const escrow = require("../controllers/escrowController");

router.post("/create", escrow.create);
router.post("/fund", escrow.fund);
router.post("/release", escrow.release);
router.post("/dispute", escrow.dispute);

module.exports = router;
