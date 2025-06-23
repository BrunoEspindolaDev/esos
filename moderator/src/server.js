require('module-alias/register');

const session = require('express-session');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { initKeycloak, memoryStore } = require('@config/keycloak');
const RabbitMQConsumer = require('@services/RabbitMQConsumer');
const path = require('path');

require('dotenv').config({
  path: path.resolve(
    __dirname,
    '../../.env.' + (process.env.NODE_ENV || 'development')
  )
});

const keycloak = initKeycloak();

const MessageRouter = require('@routes/MessageRouter');

const app = express();
const port = process.env.PORT || 5002;

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-123456789',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  })
);

app.use(keycloak.middleware());

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

app.use('/', MessageRouter);

app.listen(port, () => {
  console.log(`Server running on the port: ${port}`);
  RabbitMQConsumer.listenChat();
});
