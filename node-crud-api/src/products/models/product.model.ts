export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  description?: string | undefined;
  sku: string;
  price: string;
  active?: boolean | undefined;
}

export interface UpdateProductInput {
   name?: string | undefined;
  description?: string | null | undefined;
  sku?: string | undefined;
  price?: string | undefined;
  active?: boolean | undefined;
}