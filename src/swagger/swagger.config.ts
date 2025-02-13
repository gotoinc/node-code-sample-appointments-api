import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationErrorSchema } from './validation-error.schema';
import * as path from 'node:path';
import * as fs from 'node:fs';

export class SwaggerConfig {
  static setup(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Appointments service API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);

    document.components = {
      ...document.components,
      schemas: {
        ...document.components?.schemas,
        ValidationError: ValidationErrorSchema,
      },
    };

    Object.values(document.paths).forEach((path) => {
      Object.values(path).forEach((operation) => {
        if (
          ['post', 'put', 'patch'].includes(
            operation.operationId.split(' ')[0].toLowerCase(),
          )
        ) {
          operation.responses['400'] = {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationError',
                },
              },
            },
          };
        }
      });
    });

    SwaggerModule.setup('/api/docs', app, document);

    const outputPath = path.join(process.cwd(), 'swagger-spec.json');
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
  }
}
