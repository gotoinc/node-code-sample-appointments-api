import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiServiceUnavailableResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiLoginDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'User login',
      description: 'Logs in a user and returns an access token.',
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid email or password',
      schema: {
        example: {
          message: 'Invalid email or password',
          statusCode: 401,
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Validation failed',
      schema: {
        $ref: '#/components/schemas/ValidationError',
      },
    }),
    ApiHeader({
      name: 'Authorization',
      description: 'JWT token is returned in the header',
      required: false,
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid email or password',
    }),
  );
}

export function ApiRegisterDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'User registration',
      description: 'Registers a new user and returns user data.',
    }),
    ApiBadRequestResponse({
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: {
            oneOf: [
              {
                $ref: '#/components/schemas/ValidationError',
              },
              {
                type: 'object',
                required: ['statusCode', 'message', 'error'],
                properties: {
                  statusCode: {
                    type: 'number',
                    example: 400,
                  },
                  message: {
                    type: 'string',
                    example: 'Error while creating user',
                  },
                  error: {
                    type: 'string',
                    example: 'Bad Request',
                  },
                },
              },
            ],
          },
        },
      },
    }),
    ApiServiceUnavailableResponse(),
  );
}
