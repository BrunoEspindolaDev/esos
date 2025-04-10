require('module-alias/register');

const session = require('express-session');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { initSocketIo } = require('@config/websocket');
const { initKeycloak, memoryStore } = require('@config/keycloak');

const keycloak = initKeycloak();

const GroupRouter = require('@routes/GroupRouter');
const MessageRouter = require('@routes/MessageRouter');

const app = express();
const port = 5000;

app.use(
  session({
    secret: 'dev-secret-123456789', // Add in .env
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
});

initSocketIo(server);
