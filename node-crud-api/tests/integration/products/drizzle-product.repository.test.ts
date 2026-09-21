import { afterEach, describe, expect, it } from 'vitest';

import { DrizzleProductRepository } from '../../../src/products/repositories/drizzle-product.repository.js';

describe('DrizzleProductRepository', () => {
  const repository = new DrizzleProductRepository();

  const createProduct = async () => {
    return repository.create({
      name: 'Integration Test Product',
      description: 'Created by repository integration tests',
      sku: `TEST-${crypto.randomUUID()}`,
      price: '19.99',
      active: true,
    });
  };

  const createdProductIds: string[] = [];

  afterEach(async () => {
    for (const id of createdProductIds) {
      await repository.delete(id);
    }

    createdProductIds.length = 0;
  });

  describe('create', () => {
    it('creates a product', async () => {
      const product = await createProduct();

      createdProductIds.push(product.id);

      expect(product.id).toBeDefined();
      expect(product.name).toBe('Integration Test Product');
      expect(product.description).toBe(
        'Created by repository integration tests',
      );
      expect(product.sku).toMatch(/^TEST-/);
      expect(product.price).toBe('19.99');
      expect(product.active).toBe(true);
      expect(product.createdAt).toBeInstanceOf(Date);
      expect(product.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('findById', () => {
    it('returns a product by ID', async () => {
      const created = await createProduct();

      createdProductIds.push(created.id);

      const product = await repository.findById(created.id);

      expect(product).not.toBeNull();
      expect(product?.id).toBe(created.id);
      expect(product?.sku).toBe(created.sku);
    });

    it('returns null when the product does not exist', async () => {
      const product = await repository.findById(
        crypto.randomUUID(),
      );

      expect(product).toBeNull();
    });
  });

  describe('findBySku', () => {
    it('returns a product by SKU', async () => {
      const created = await createProduct();

      createdProductIds.push(created.id);

      const product = await repository.findBySku(created.sku);

      expect(product).not.toBeNull();
      expect(product?.id).toBe(created.id);
    });

    it('returns null when the SKU does not exist', async () => {
      const product = await repository.findBySku(
        `NOT-FOUND-${crypto.randomUUID()}`,
      );

      expect(product).toBeNull();
    });
  });

  describe('findAll', () => {
    it('returns products', async () => {
      const first = await createProduct();
      const second = await createProduct();

      createdProductIds.push(first.id, second.id);

      const products = await repository.findAll();

      expect(products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: first.id,
            sku: first.sku,
          }),
          expect.objectContaining({
            id: second.id,
            sku: second.sku,
          }),
        ]),
      );
    });
  });

  describe('update', () => {
    it('updates a product', async () => {
      const created = await createProduct();

      createdProductIds.push(created.id);

      const updated = await repository.update(created.id, {
        name: 'Updated Product',
        price: '29.99',
        active: false,
      });

      expect(updated).not.toBeNull();
      expect(updated?.id).toBe(created.id);
      expect(updated?.name).toBe('Updated Product');
      expect(updated?.price).toBe('29.99');
      expect(updated?.active).toBe(false);
    });

    it('returns null when updating a product that does not exist', async () => {
      const updated = await repository.update(
        crypto.randomUUID(),
        {
          name: 'Updated Product',
        },
      );

      expect(updated).toBeNull();
    });
  });

  describe('delete', () => {
    it('deletes a product', async () => {
      const created = await createProduct();

      createdProductIds.push(created.id);

      const deleted = await repository.delete(created.id);

      expect(deleted).toBe(true);

      const product = await repository.findById(created.id);

      expect(product).toBeNull();

      // The cleanup no longer needs to delete this record.
      createdProductIds.splice(
        createdProductIds.indexOf(created.id),
        1,
      );
    });

    it('returns false when deleting a product that does not exist', async () => {
      const deleted = await repository.delete(
        crypto.randomUUID(),
      );

      expect(deleted).toBe(false);
    });
  });
});