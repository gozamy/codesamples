import Fastify from 'fastify';
import { registerSwagger } from '../docs/swagger.js';

import { registerErrorHandler } from '../middleware/error-handler.js';
import { DrizzleProductRepository } from '../products/repositories/drizzle-product.repository.js';
import { ProductController } from '../products/controllers/product.controller.js';
import { registerProductRoutes } from '../products/routes/product.routes.js';
import { ProductService } from '../products/services/product.service.js';

export const buildApp = () => {
  const app = Fastify({
    logger: true,
  });


  registerSwagger(app);

  registerErrorHandler(app);

  app.get('/health', async () => ({
    status: 'ok',
  }));

  const productRepository = new DrizzleProductRepository();
  const productService = new ProductService(productRepository);
  const productController = new ProductController(productService);

  registerProductRoutes(app, productController);

  return app;
};