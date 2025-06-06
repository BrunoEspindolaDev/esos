require('module-alias/register');

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const RabbitMQConsumer = require('@services/RabbitMQConsumer');

const app = express();
const port = 5001;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

app.listen(port, () => {
  RabbitMQConsumer.listenChat();
});
