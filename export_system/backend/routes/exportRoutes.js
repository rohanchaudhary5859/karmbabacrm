
const router = require("express").Router();
const pdf = require("../controllers/pdfController");

router.post("/invoice", pdf.generateInvoice);

module.exports = router;
