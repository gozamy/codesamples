import type { FastifyReply, FastifyRequest } from 'fastify';

import {
  createProductSchema,
  productIdSchema,
  updateProductSchema,
} from '../schemas/product.schema.js';

import type { ProductService } from '../services/product.service.js';

export class ProductController {
  constructor(
    private readonly service: ProductService,
  ) {}

  async findAll(
    _request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const products = await this.service.findAll();

    return reply.status(200).send({
      data: products,
    });
  }

  async findById(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const params = productIdSchema.safeParse(request.params);

    if (!params.success) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid product ID',
          details: params.error.issues,
        },
      });
    }

    const product = await this.service.findById(params.data.id);

    return reply.status(200).send({
      data: product,
    });
  }

  async create(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const body = createProductSchema.safeParse(request.body);

    if (!body.success) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid product data',
          details: body.error.issues,
        },
      });
    }

    const product = await this.service.create(body.data);

    return reply.status(201).send({
      data: product,
    });
  }

  async update(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const params = productIdSchema.safeParse(request.params);

    if (!params.success) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid product ID',
          details: params.error.issues,
        },
      });
    }

    const body = updateProductSchema.safeParse(request.body);

    if (!body.success) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid product data',
          details: body.error.issues,
        },
      });
    }

    const product = await this.service.update(
      params.data.id,
      body.data,
    );

    return reply.status(200).send({
      data: product,
    });
  }

  async delete(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const params = productIdSchema.safeParse(request.params);

    if (!params.success) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid product ID',
          details: params.error.issues,
        },
      });
    }

    await this.service.delete(params.data.id);

    return reply.status(204).send();
  }
}