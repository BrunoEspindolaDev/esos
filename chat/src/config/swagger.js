const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chat Service API',
      version: '1.0.0',
      description:
        'API documentation for Chat Service - handles messaging and group management'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Chat Service API endpoints'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Message: {
          type: 'object',
          required: ['content', 'groupId', 'userId'],
          properties: {
            id: {
              type: 'string',
              description: 'Message unique identifier'
            },
            content: {
              type: 'string',
              description: 'Message content'
            },
            groupId: {
              type: 'string',
              description: 'Group identifier'
            },
            userId: {
              type: 'string',
              description: 'User identifier'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Update timestamp'
            }
          }
        },
        Group: {
          type: 'object',
          required: ['userId', 'groupId'],
          properties: {
            userId: {
              type: 'string',
              description: 'User identifier'
            },
            groupId: {
              type: 'string',
              description: 'Group identifier'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
