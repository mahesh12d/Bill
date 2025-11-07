import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBillSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all bills
  app.get("/api/bills", async (req, res) => {
    try {
      const bills = await storage.getAllBills();
      res.json(bills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bills" });
    }
  });

  // Get a specific bill
  app.get("/api/bills/:id", async (req, res) => {
    try {
      const bill = await storage.getBill(req.params.id);
      if (!bill) {
        return res.status(404).json({ error: "Bill not found" });
      }
      res.json(bill);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bill" });
    }
  });

  // Get next bill number
  app.get("/api/bills-next-number", async (req, res) => {
    try {
      const nextNumber = await storage.getNextBillNumber();
      res.json({ billNo: nextNumber });
    } catch (error) {
      res.status(500).json({ error: "Failed to get next bill number" });
    }
  });

  // Create a new bill
  app.post("/api/bills", async (req, res) => {
    try {
      const validatedData = insertBillSchema.parse(req.body);
      const bill = await storage.createBill(validatedData);
      res.status(201).json(bill);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create bill" });
      }
    }
  });

  // Update a bill
  app.patch("/api/bills/:id", async (req, res) => {
    try {
      const updates = insertBillSchema.partial().parse(req.body);
      const bill = await storage.updateBill(req.params.id, updates);
      if (!bill) {
        return res.status(404).json({ error: "Bill not found" });
      }
      res.json(bill);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to update bill" });
      }
    }
  });

  // Delete a bill
  app.delete("/api/bills/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBill(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Bill not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete bill" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
