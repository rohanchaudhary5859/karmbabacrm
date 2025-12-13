
const express = require("express");
const app = express();
const exportRoutes = require("./routes/exportRoutes");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use("/api/export", exportRoutes);

app.listen(4200, ()=> console.log("Export system running on 4200"));
