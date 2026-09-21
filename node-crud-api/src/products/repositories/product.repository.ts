import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../models/product.model.js';

export interface ProductRepository {
  findAll(): Promise<Product[]>;

  findById(id: string): Promise<Product | null>;

  findBySku(sku: string): Promise<Product | null>;

  create(input: CreateProductInput): Promise<Product>;

  update(
    id: string,
    input: UpdateProductInput,
  ): Promise<Product | null>;

  delete(id: string): Promise<boolean>;
}