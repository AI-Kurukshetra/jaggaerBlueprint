import { z } from "zod";

export const purchaseOrderSchema = z.object({
  supplier_id: z.string().uuid("Supplier is required"),
  po_number: z.string().min(2, "PO number is required"),
  status: z.enum(["draft", "pending", "approved", "issued", "closed", "cancelled"]),
  total_amount: z.number().min(0),
  currency: z.string().min(3).max(3)
});

export type PurchaseOrderInput = z.infer<typeof purchaseOrderSchema>;
