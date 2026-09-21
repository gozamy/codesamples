import {
  boolean,
  decimal,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: text('name').notNull(),

  description: text('description'),

  sku: text('sku').notNull().unique(),

  price: decimal('price', {
    precision: 10,
    scale: 2,
  }).notNull(),

  active: boolean('active').notNull().default(true),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).notNull().defaultNow(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  }).notNull().defaultNow(),
});