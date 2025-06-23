require('module-alias/register');

const session = require('express-session');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { initSocketIo } = require('@config/websocket');
const { initKeycloak, memoryStore } = require('@config/keycloak');
const { listenCensorships } = require('@services/RabbitMQConsumer');
const path = require('path');

require('dotenv').config({
  path: path.resolve(
    __dirname,
    '../.env.' + (process.env.NODE_ENV || 'development')
  )
});

const keycloak = initKeycloak();

const GroupRouter = require('@routes/GroupRouter');
const MessageRouter = require('@routes/MessageRouter');

const app = express();
const port = process.env.PORT || 5000;

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
app.use('/', GroupRouter);
app.use('/', MessageRouter);

const server = app.listen(port, () => {
  console.log(`Server running on the port: ${port}`);
  listenCensorships();
});

initSocketIo(server);
