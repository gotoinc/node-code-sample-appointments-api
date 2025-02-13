import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const ValidationErrorSchema: SchemaObject = {
  type: 'object',
  properties: {
    statusCode: {
      type: 'number',
      example: 400,
    },
    message: {
      type: 'array',
      items: {
        type: 'string',
      },
      example: [
        'email must be an email',
        'password must be longer than or equal to 8 characters',
      ],
    },
    error: {
      type: 'string',
      example: 'Bad Request',
    },
  },
};
