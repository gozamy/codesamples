import { eq } from 'drizzle-orm';

import { db } from '../../infrastructure/database/client.js';
import { products } from '../../infrastructure/database/schema.js';

import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../models/product.model.js';

import type { ProductRepository } from './product.repository.js';

export class DrizzleProductRepository implements ProductRepository {
  async findAll(): Promise<Product[]> {
    return db.select().from(products);
  }

  async findById(id: string): Promise<Product | null> {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    return result[0] ?? null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.sku, sku))
      .limit(1);

    return result[0] ?? null;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const result = await db
      .insert(products)
      .values({
        name: input.name,
        description: input.description ?? null,
        sku: input.sku,
        price: input.price,
        active: input.active ?? true,
      })
      .returning();

    const product = result[0];

    if (!product) {
      throw new Error('Failed to create product');
    }

    return product;
  }

  async update(
    id: string,
    input: UpdateProductInput,
  ): Promise<Product | null> {
    const result = await db
      .update(products)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    return result[0] ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning({
        id: products.id,
      });

    return result.length > 0;
  }
}