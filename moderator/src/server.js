require('module-alias/register');

const session = require('express-session');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { initKeycloak, memoryStore } = require('@config/keycloak');
const RabbitMQConsumer = require('@services/RabbitMQConsumer');
const { swaggerUi, specs } = require('@config/swagger');

const keycloak = initKeycloak();

const MessageRouter = require('@routes/MessageRouter');

const app = express();
const port = 5001;

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

// Swagger configuration
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/', MessageRouter);

app.listen(port, () => {
  console.log(`Server running on the port: ${port}`);
  RabbitMQConsumer.listenChat();
});
