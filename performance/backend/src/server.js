const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());

const perfRoutes = require('./routes/performance');
app.use('/api/performance', perfRoutes);

const port = process.env.PORT || 4100;
app.listen(port, ()=> console.log('Performance backend running on', port));
