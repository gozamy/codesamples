import { z } from 'zod';

const productName = z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(200, 'Name must not exceed 200 characters');

const productDescription = z
    .string()
    .trim()
    .max(2000, 'Description must not exceed 2000 characters');

const productSku = z
    .string()
    .trim()
    .min(1, 'SKU is required')
    .max(50, 'SKU must not exceed 50 characters');

const productPrice = z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid monetary amount')
    .refine((value) => Number(value) > 0, {
        message: 'Price must be greater than zero',
    });

export const createProductSchema = z.object({
    name: productName,
    description: productDescription.optional(),
    sku: productSku,
    price: productPrice,
    active: z.boolean().optional(),
});

export const updateProductSchema = z
    .object({
        name: productName.optional(),
        description: productDescription.nullable().optional(),
        sku: productSku.optional(),
        price: productPrice.optional(),
        active: z.boolean().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
        message: 'At least one field must be provided',
    });

export const productIdSchema = z.object({
    id: z.string().uuid('Invalid product ID'),
});

export type CreateProductRequest = z.infer<typeof createProductSchema>;

export type UpdateProductRequest = z.infer<typeof updateProductSchema>;