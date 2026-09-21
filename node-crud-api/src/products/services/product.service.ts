import {
  ConflictError,
  NotFoundError,
} from '../../app/errors.js';

import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../models/product.model.js';

import type { ProductRepository } from '../repositories/product.repository.js';

export class ProductService {
  constructor(
    private readonly repository: ProductRepository,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return product;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const existingProduct = await this.repository.findBySku(input.sku);

    if (existingProduct) {
      throw new ConflictError('Product SKU already exists');
    }

    return this.repository.create(input);
  }

  async update(
    id: string,
    input: UpdateProductInput,
  ): Promise<Product> {
    const existingProduct = await this.repository.findById(id);

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    if (input.sku && input.sku !== existingProduct.sku) {
      const productWithSku = await this.repository.findBySku(input.sku);

      if (productWithSku) {
        throw new ConflictError('Product SKU already exists');
      }
    }

    const updatedProduct = await this.repository.update(id, input);

    if (!updatedProduct) {
      throw new NotFoundError('Product not found');
    }

    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new NotFoundError('Product not found');
    }
  }
}