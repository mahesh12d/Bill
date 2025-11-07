import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Bill line item type (stored as JSONB in bills table)
export const billLineItemSchema = z.object({
  srNo: z.number().int().positive(),
  description: z.string().min(1),
  qty: z.number().positive(),
  rate: z.number().positive(),
  amount: z.number().positive(),
});

export type BillLineItem = z.infer<typeof billLineItemSchema>;

// Bills table
export const bills = pgTable("bills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  billNo: text("bill_no").notNull(),
  date: text("date").notNull(),
  customerName: text("customer_name").notNull(),
  lineItems: jsonb("line_items").$type<BillLineItem[]>().notNull(),
  total: doublePrecision("total").notNull(),
  amountInWords: text("amount_in_words").notNull(),
});

export const insertBillSchema = createInsertSchema(bills).omit({
  id: true,
});

export type InsertBill = z.infer<typeof insertBillSchema>;
export type Bill = typeof bills.$inferSelect;

// Leisure item types
export interface LeisureItem {
  id: number;
  srNo: number;
  description: string;
  laborWork: string;
  materialSpecs: string;
  rateWithMaterial: string;
}

export const createLeisureItemSchema = z.object({
  srNo: z.number().int().positive(),
  description: z.string().min(1),
  laborWork: z.string().min(1),
  materialSpecs: z.string().min(1),
  rateWithMaterial: z.string().min(1),
});

export const updateLeisureItemSchema = z.object({
  srNo: z.number().int().positive().optional(),
  description: z.string().min(1).optional(),
  laborWork: z.string().min(1).optional(),
  materialSpecs: z.string().min(1).optional(),
  rateWithMaterial: z.string().min(1).optional(),
});

export type CreateLeisureItem = z.infer<typeof createLeisureItemSchema>;
export type UpdateLeisureItem = z.infer<typeof updateLeisureItemSchema>;
