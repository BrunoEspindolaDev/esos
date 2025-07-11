const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Logs Service API',
      version: '1.0.0',
      description:
        'API documentation for Logs Service - handles system logging and audit trails'
    },
    servers: [
      {
        url: 'http://localhost:5002',
        description: 'Logs Service API endpoints'
      }
    ],
    components: {
      schemas: {
        Log: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Log unique identifier'
            },
            userId: {
              type: 'string',
              description: 'User identifier who performed the action'
            },
            entity: {
              type: 'string',
              enum: ['MESSAGE', 'GROUP', 'USER'],
              description: 'Type of entity that was affected'
            },
            entityId: {
              type: 'string',
              description: 'Identifier of the affected entity'
            },
            action: {
              type: 'string',
              enum: ['CREATE', 'UPDATE', 'DELETE'],
              description: 'Action performed on the entity'
            },
            content: {
              type: 'object',
              description: 'Additional data related to the action'
            },
            deleted: {
              type: 'integer',
              description: 'Soft delete flag (0: active, 1: deleted)',
              default: 0
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Log creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Log update timestamp'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'Current page number'
            },
            limit: {
              type: 'integer',
              description: 'Number of items per page'
            },
            total: {
              type: 'integer',
              description: 'Total number of items'
            },
            totalPages: {
              type: 'integer',
              description: 'Total number of pages'
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
