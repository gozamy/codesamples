import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../../../src/products/models/product.model.js';

import type { ProductRepository } from '../../../src/products/repositories/product.repository.js';

export class InMemoryProductRepository
  implements ProductRepository
{
  private products: Product[] = [];

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find((product) => product.id === id) ?? null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    return (
      this.products.find((product) => product.sku === sku) ?? null
    );
  }

  async create(input: CreateProductInput): Promise<Product> {
    const now = new Date();

    const product: Product = {
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description ?? null,
      sku: input.sku,
      price: input.price,
      active: input.active ?? true,
      createdAt: now,
      updatedAt: now,
    };

    this.products.push(product);

    return product;
  }

  async update(
    id: string,
    input: UpdateProductInput,
  ): Promise<Product | null> {
    const index = this.products.findIndex(
      (product) => product.id === id,
    );

    if (index === -1) {
      return null;
    }

    const existing = this.products[index];

    if (!existing) {
      return null;
    }

    const updated: Product = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    };

    this.products[index] = updated;

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.products.findIndex(
      (product) => product.id === id,
    );

    if (index === -1) {
      return false;
    }

    this.products.splice(index, 1);

    return true;
  }
}