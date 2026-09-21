import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import path from 'node:path';

export const registerSwagger = (app: FastifyInstance): void => {
  const openApiPath = path.resolve(
    process.cwd(),
    'src/docs/openapi/openapi.json',
  );

  app.register(swagger, {
    mode: 'static',
    specification: {
      path: openApiPath,
      baseDir: path.dirname(openApiPath),
    },
  });

  app.register(swaggerUi, {
    routePrefix: '/docs',
  });
};