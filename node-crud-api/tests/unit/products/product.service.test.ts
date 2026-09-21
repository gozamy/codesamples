import { describe, expect, it } from 'vitest';

import { ConflictError, NotFoundError } from '../../../src/app/errors.js';

import { ProductService } from '../../../src/products/services/product.service.js';

import { InMemoryProductRepository } from './in-memory-product.repository.js';

describe('ProductService', () => {
  const createService = () => {
    const repository = new InMemoryProductRepository();
    const service = new ProductService(repository);

    return {
      repository,
      service,
    };
  };

  describe('create', () => {
    it('creates a product', async () => {
      const { service } = createService();

      const product = await service.create({
        name: 'Test Product',
        description: 'A test product',
        sku: 'TEST-001',
        price: '19.99',
        active: true,
      });

      expect(product.name).toBe('Test Product');
      expect(product.sku).toBe('TEST-001');
      expect(product.price).toBe('19.99');
    });

    it('rejects duplicate SKUs', async () => {
      const { service } = createService();

      await service.create({
        name: 'Product One',
        sku: 'TEST-001',
        price: '10.00',
      });

      await expect(
        service.create({
          name: 'Product Two',
          sku: 'TEST-001',
          price: '20.00',
        }),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('findById', () => {
    it('returns a product', async () => {
      const { service } = createService();

      const created = await service.create({
        name: 'Test Product',
        sku: 'TEST-001',
        price: '19.99',
      });

      const product = await service.findById(created.id);

      expect(product.id).toBe(created.id);
    });

    it('throws when the product does not exist', async () => {
      const { service } = createService();

      await expect(
        service.findById(crypto.randomUUID()),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('update', () => {
    it('updates a product', async () => {
      const { service } = createService();

      const created = await service.create({
        name: 'Original Name',
        sku: 'TEST-001',
        price: '19.99',
      });

      const updated = await service.update(created.id, {
        name: 'Updated Name',
      });

      expect(updated.name).toBe('Updated Name');
    });

    it('throws when updating a missing product', async () => {
      const { service } = createService();

      await expect(
        service.update(crypto.randomUUID(), {
          name: 'Updated Name',
        }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('deletes a product', async () => {
      const { service } = createService();

      const created = await service.create({
        name: 'Test Product',
        sku: 'TEST-001',
        price: '19.99',
      });

      await service.delete(created.id);

      await expect(
        service.findById(created.id),
      ).rejects.toThrow(NotFoundError);
    });

    it('throws when deleting a missing product', async () => {
      const { service } = createService();

      await expect(
        service.delete(crypto.randomUUID()),
      ).rejects.toThrow(NotFoundError);
    });
  });
});