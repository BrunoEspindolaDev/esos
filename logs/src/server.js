require('module-alias/register');

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const RabbitMQConsumer = require('@services/RabbitMQConsumer');
const path = require('path');
require('dotenv').config({
  path: path.resolve(
    __dirname,
    '../../.env.' + (process.env.NODE_ENV || 'development')
  )
});

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

app.listen(port, () => {
  RabbitMQConsumer.listenChat();
  console.log(`Server running on the port: ${port}`);
});
