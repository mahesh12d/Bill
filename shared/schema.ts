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

// Rate card types
export interface RateCard {
  id: string;
  name: string;
  createdDate: string;
  items: RateCardItem[];
}

export interface RateCardItem {
  id: number;
  rateCardId: string;
  srNo: number;
  description: string;
  laborWork: string;
  materialSpecs: string;
  rateWithMaterial: string;
  displayOrder: number;
}

export const createRateCardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  createdDate: z.string(),
});

export const createRateCardItemSchema = z.object({
  rateCardId: z.string().uuid(),
  srNo: z.number().int().positive(),
  description: z.string().min(1),
  laborWork: z.string(),
  materialSpecs: z.string(),
  rateWithMaterial: z.string(),
  displayOrder: z.number().int().nonnegative(),
});

export type CreateRateCard = z.infer<typeof createRateCardSchema>;
export type CreateRateCardItem = z.infer<typeof createRateCardItemSchema>;
