import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(2, "Category is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Phone is required"),
  location: z.string().min(2, "Location is required"),
  risk_score: z.number().min(0).max(100)
});

export const supplierScorecardSchema = z.object({
  delivery_score: z.number().min(0).max(100),
  quality_score: z.number().min(0).max(100),
  service_score: z.number().min(0).max(100)
});

export const supplierCertificationSchema = z.object({
  name: z.string().min(2, "Certification name required"),
  issuer: z.string().min(2, "Issuer required"),
  expires_at: z.string().min(8, "Expiry date required")
});

export const supplierDocumentSchema = z.object({
  document_type: z.string().min(2, "Document type required"),
  file_path: z.string().min(2),
  file_name: z.string().min(2),
  expires_at: z.string().optional()
});

export type SupplierInput = z.infer<typeof supplierSchema>;
export type SupplierScorecardInput = z.infer<typeof supplierScorecardSchema>;
export type SupplierCertificationInput = z.infer<typeof supplierCertificationSchema>;
export type SupplierDocumentInput = z.infer<typeof supplierDocumentSchema>;
