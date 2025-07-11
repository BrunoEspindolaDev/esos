const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Moderation Service API',
      version: '1.0.0',
      description:
        'API documentation for Moderation Service - handles message content moderation and censorship'
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Moderation Service API endpoints'
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
        MessageAnalysis: {
          type: 'object',
          required: ['content'],
          properties: {
            content: {
              type: 'string',
              description: 'Message content to be analyzed'
            },
            groupId: {
              type: 'string',
              description: 'Group identifier'
            },
            userId: {
              type: 'string',
              description: 'User identifier'
            }
          }
        },
        ModerationResult: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Moderation result message'
            },
            data: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Message identifier'
                },
                content: {
                  type: 'string',
                  description: 'Original message content'
                },
                invalidTerms: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'List of invalid terms found in the message'
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Analysis timestamp'
                }
              }
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
        ApprovalResult: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description:
                'Approval message (using error field for consistency)'
            }
          }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js')
  ]
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
