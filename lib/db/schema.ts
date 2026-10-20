import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  varchar,
} from "drizzle-orm/pg-core"

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
])

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }).notNull().default("Admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull().default(""),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 12, scale: 2 }),
  imageUrl: text("image_url").notNull(),
  category: varchar("category", { length: 80 }).notNull().default("Gifts"),
  badge: varchar("badge", { length: 60 }),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 32 }).notNull().unique(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),
  status: orderStatusEnum("status").notNull().default("pending"),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  shippingFee: numeric("shipping_fee", { precision: 12, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  billingName: varchar("billing_name", { length: 200 }).notNull(),
  billingEmail: varchar("billing_email", { length: 255 }).notNull(),
  billingPhone: varchar("billing_phone", { length: 40 }).notNull(),
  billingAddress: text("billing_address").notNull(),
  billingCity: varchar("billing_city", { length: 120 }).notNull(),
  billingArea: varchar("billing_area", { length: 120 }),
  shippingName: varchar("shipping_name", { length: 200 }).notNull(),
  shippingPhone: varchar("shipping_phone", { length: 40 }).notNull(),
  shippingAddress: text("shipping_address").notNull(),
  shippingCity: varchar("shipping_city", { length: 120 }).notNull(),
  shippingArea: varchar("shipping_area", { length: 120 }),
  notes: text("notes"),
  giftMessage: text("gift_message"),
  trackingNote: text("tracking_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productImage: text("product_image"),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  lineTotal: numeric("line_total", { precision: 12, scale: 2 }).notNull(),
})

export type Admin = typeof admins.$inferSelect
export type Customer = typeof customers.$inferSelect
export type Product = typeof products.$inferSelect
export type Order = typeof orders.$inferSelect
export type OrderItem = typeof orderItems.$inferSelect
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number]
