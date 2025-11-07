import { type Bill, type InsertBill } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Bill operations
  getBill(id: string): Promise<Bill | undefined>;
  getAllBills(): Promise<Bill[]>;
  createBill(bill: InsertBill): Promise<Bill>;
  updateBill(id: string, bill: Partial<InsertBill>): Promise<Bill | undefined>;
  deleteBill(id: string): Promise<boolean>;
  getNextBillNumber(): Promise<string>;
}

export class MemStorage implements IStorage {
  private bills: Map<string, Bill>;
  private billCounter: number;

  constructor() {
    this.bills = new Map();
    this.billCounter = 1;
  }

  async getBill(id: string): Promise<Bill | undefined> {
    return this.bills.get(id);
  }

  async getAllBills(): Promise<Bill[]> {
    return Array.from(this.bills.values()).sort((a, b) => 
      parseInt(b.billNo) - parseInt(a.billNo)
    );
  }

  async createBill(insertBill: InsertBill): Promise<Bill> {
    const id = randomUUID();
    const bill: Bill = {
      id,
      billNo: insertBill.billNo,
      date: insertBill.date,
      customerName: insertBill.customerName,
      lineItems: insertBill.lineItems as any,
      total: insertBill.total,
      amountInWords: insertBill.amountInWords,
    };
    this.bills.set(id, bill);
    
    // Update counter if this bill number is higher
    const billNum = parseInt(insertBill.billNo);
    if (!isNaN(billNum) && billNum >= this.billCounter) {
      this.billCounter = billNum + 1;
    }
    
    return bill;
  }

  async updateBill(id: string, updates: Partial<InsertBill>): Promise<Bill | undefined> {
    const existingBill = this.bills.get(id);
    if (!existingBill) {
      return undefined;
    }
    
    const updatedBill: Bill = {
      ...existingBill,
      ...updates,
      lineItems: (updates.lineItems || existingBill.lineItems) as any,
    };
    this.bills.set(id, updatedBill);
    return updatedBill;
  }

  async deleteBill(id: string): Promise<boolean> {
    return this.bills.delete(id);
  }

  async getNextBillNumber(): Promise<string> {
    return this.billCounter.toString();
  }
}

export const storage = new MemStorage();
