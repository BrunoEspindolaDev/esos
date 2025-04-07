require('module-alias/register');

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { initSocketIo } = require('@config/websocket');

const GroupRouter = require('@routes/GroupRouter');
const MessageRouter = require('@routes/MessageRouter');

const app = express();
const port = 5000;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use('/', GroupRouter);
app.use('/', MessageRouter);

const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

initSocketIo(server);
