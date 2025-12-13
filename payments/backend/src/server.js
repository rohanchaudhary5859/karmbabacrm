const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const payments = require('./routes/payments');
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/payments', payments);

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log('Payments backend running on', port));
