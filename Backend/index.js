const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./src/db_config/db.config');
const router = require('./src/router/router');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});