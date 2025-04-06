require('module-alias/register');

const express = require('express');
const bodyParser = require('body-parser');
const MessageRouter = require('@routes/MessageRouter');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use('/', MessageRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
