
const express = require("express");
const app = express();
const escrow = require("./routes/escrowRoutes");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use("/api/escrow", escrow);

app.listen(4300, ()=> console.log("Escrow system running on 4300"));
