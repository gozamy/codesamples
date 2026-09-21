import type { FastifyInstance } from 'fastify';

import type { ProductController } from '../controllers/product.controller.js';

export const registerProductRoutes = (
  app: FastifyInstance,
  controller: ProductController,
): void => {
  app.get('/api/v1/products', (request, reply) =>
    controller.findAll(request, reply),
  );

  app.get('/api/v1/products/:id', (request, reply) =>
    controller.findById(request, reply),
  );

  app.post('/api/v1/products', (request, reply) =>
    controller.create(request, reply),
  );

  app.patch('/api/v1/products/:id', (request, reply) =>
    controller.update(request, reply),
  );

  app.delete('/api/v1/products/:id', (request, reply) =>
    controller.delete(request, reply),
  );
};