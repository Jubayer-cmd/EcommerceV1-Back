import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Multi Purpose E-commerce API Documentation',
      version: '1.0.0',
      description: 'Documentation for E-commerce REST API',
      contact: {
        name: 'API Support',
        email: 'sheikhabujubayer@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:9000/api/v1',
        description: 'Local Development Server',
      },
      {
        url: 'http://127.0.0.1:9000/api/v1',
        description: 'Alternative Local Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            errorMessages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/app/modules/**/*route.ts'],
};
