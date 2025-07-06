require('module-alias/register');

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const RabbitMQConsumer = require('@services/RabbitMQConsumer');
const { swaggerUi, specs } = require('@config/swagger');
const LogRouter = require('@routes/LogRouter');

const app = express();
const port = 5002;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// Swagger configuration
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/', LogRouter);

// Swagger configuration
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/', LogRouter);

app.listen(port, () => {
  console.log(`Server running on the port: ${port}`);
  RabbitMQConsumer.listenChat();
});
