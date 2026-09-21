import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { buildApp } from '../../../src/app/app.js';
import { db } from '../../../src/infrastructure/database/client.js';
import { products } from '../../../src/infrastructure/database/schema.js';

import type { FastifyInstance } from 'fastify';

describe('Product API', () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = buildApp();
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
        await db.delete(products);
    });

    it('returns an empty product list', async () => {
        await db.delete(products);

        const response = await app.inject({
            method: 'GET',
            url: '/api/v1/products',
        });

        expect(response.statusCode).toBe(200);

        expect(response.json()).toEqual({
            data: [],
        });
    });

    it('creates a product', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/v1/products',
            payload: {
                name: 'API Test Product',
                description: 'Created through the API',
                sku: `API-${crypto.randomUUID()}`,
                price: '24.99',
                active: true,
            },
        });

        expect(response.statusCode).toBe(201);

        const body = response.json();

        expect(body.data).toMatchObject({
            name: 'API Test Product',
            description: 'Created through the API',
            price: '24.99',
            active: true,
        });

        expect(body.data.id).toBeDefined();
    });

    it('rejects invalid product data', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/v1/products',
            payload: {
                name: '',
                sku: '',
                price: 'not-a-price',
            },
        });

        expect(response.statusCode).toBe(400);

        expect(response.json()).toMatchObject({
            error: {
                code: 'VALIDATION_ERROR',
            },
        });
    });

    it('returns a product by ID', async () => {
        const createResponse = await app.inject({
            method: 'POST',
            url: '/api/v1/products',
            payload: {
                name: 'Find Test Product',
                sku: `FIND-${crypto.randomUUID()}`,
                price: '15.50',
            },
        });

        expect(createResponse.statusCode).toBe(201);

        const created = createResponse.json().data;

        const response = await app.inject({
            method: 'GET',
            url: `/api/v1/products/${created.id}`,
        });

        expect(response.statusCode).toBe(200);

        expect(response.json()).toMatchObject({
            data: {
                id: created.id,
                name: 'Find Test Product',
            },
        });
    });

    it('returns 404 for a product that does not exist', async () => {
        const response = await app.inject({
            method: 'GET',
            url: `/api/v1/products/${crypto.randomUUID()}`,
        });

        expect(response.statusCode).toBe(404);

        expect(response.json()).toEqual({
            error: {
                code: 'NOT_FOUND',
                message: 'Product not found',
            },
        });
    });

    it('updates a product', async () => {
        const createResponse = await app.inject({
            method: 'POST',
            url: '/api/v1/products',
            payload: {
                name: 'Original Product',
                sku: `UPDATE-${crypto.randomUUID()}`,
                price: '20.00',
            },
        });

        const created = createResponse.json().data;

        const response = await app.inject({
            method: 'PATCH',
            url: `/api/v1/products/${created.id}`,
            payload: {
                name: 'Updated Product',
                price: '25.00',
            },
        });

        expect(response.statusCode).toBe(200);

        expect(response.json()).toMatchObject({
            data: {
                id: created.id,
                name: 'Updated Product',
                price: '25.00',
            },
        });
    });

    it('deletes a product', async () => {
        const createResponse = await app.inject({
            method: 'POST',
            url: '/api/v1/products',
            payload: {
                name: 'Delete Test Product',
                sku: `DELETE-${crypto.randomUUID()}`,
                price: '10.00',
            },
        });

        const created = createResponse.json().data;

        const deleteResponse = await app.inject({
            method: 'DELETE',
            url: `/api/v1/products/${created.id}`,
        });

        expect(deleteResponse.statusCode).toBe(204);

        const getResponse = await app.inject({
            method: 'GET',
            url: `/api/v1/products/${created.id}`,
        });

        expect(getResponse.statusCode).toBe(404);
    });

    it('rejects a duplicate SKU', async () => {
        const sku = `DUPLICATE-${crypto.randomUUID()}`;

        const firstResponse = await app.inject({
            method: 'POST',
            url: '/api/v1/products',
            payload: {
                name: 'First Product',
                sku,
                price: '10.00',
            },
        });

        expect(firstResponse.statusCode).toBe(201);

        const secondResponse = await app.inject({
            method: 'POST',
            url: '/api/v1/products',
            payload: {
                name: 'Second Product',
                sku,
                price: '20.00',
            },
        });

        expect(secondResponse.statusCode).toBe(409);

        expect(secondResponse.json()).toEqual({
            error: {
                code: 'CONFLICT',
                message: 'Product SKU already exists',
            },
        });
    });

    it('rejects an invalid product ID', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/api/v1/products/not-a-uuid',
        });

        expect(response.statusCode).toBe(400);

        expect(response.json()).toMatchObject({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid product ID',
            },
        });
    });

    it('rejects an empty PATCH request', async () => {
        const response = await app.inject({
            method: 'PATCH',
            url: `/api/v1/products/${crypto.randomUUID()}`,
            payload: {},
        });

        expect(response.statusCode).toBe(400);

        expect(response.json()).toMatchObject({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid product data',
            },
        });
    });

    it('rejects a product with an invalid price', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/v1/products',
            payload: {
                name: 'Invalid Price Product',
                sku: `PRICE-${crypto.randomUUID()}`,
                price: '-10.00',
            },
        });

        expect(response.statusCode).toBe(400);

        expect(response.json()).toMatchObject({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid product data',
            },
        });
    });

    it('returns 404 when updating a non-existent product', async () => {
        const response = await app.inject({
            method: 'PATCH',
            url: `/api/v1/products/${crypto.randomUUID()}`,
            payload: {
                name: 'Updated Product',
            },
        });

        expect(response.statusCode).toBe(404);

        expect(response.json()).toEqual({
            error: {
                code: 'NOT_FOUND',
                message: 'Product not found',
            },
        });
    });

    it('returns 404 when deleting a non-existent product', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: `/api/v1/products/${crypto.randomUUID()}`,
        });

        expect(response.statusCode).toBe(404);

        expect(response.json()).toEqual({
            error: {
                code: 'NOT_FOUND',
                message: 'Product not found',
            },
        });
    });
});