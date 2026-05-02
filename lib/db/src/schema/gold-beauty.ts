import { pgTable, text, numeric, jsonb, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const gbOrdersTable = pgTable("gb_orders", {
  id: text("id").primaryKey(),
  customer: text("customer").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  items: jsonb("items").notNull().default([]),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
  deliveryFee: numeric("delivery_fee", { precision: 12, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
  status: text("status").notNull().default("Pending"),
  paymentMethod: text("payment_method").default("COD"),
  trackingNumber: text("tracking_number"),
  courierName: text("courier_name"),
  courierUrl: text("courier_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const gbSiteConfigTable = pgTable("gb_site_config", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const gbImagesTable = pgTable("gb_images", {
  id: serial("id").primaryKey(),
  fieldName: text("field_name").notNull(),
  url: text("url").notNull(),
  publicId: text("public_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertGbOrderSchema = createInsertSchema(gbOrdersTable);
export type InsertGbOrder = z.infer<typeof insertGbOrderSchema>;
export type GbOrder = typeof gbOrdersTable.$inferSelect;

export const insertGbImageSchema = createInsertSchema(gbImagesTable).omit({ id: true });
export type InsertGbImage = z.infer<typeof insertGbImageSchema>;
