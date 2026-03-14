import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const TARGET_EMAIL = "zeel.bhavsar@bacancy.com";
const TENANT_NAME = "Bacancy Supply Chain Operations";

const supplierSeeds = [
  { name: "Global Steel Industries", category: "Raw Materials", country: "United States" },
  { name: "Precision Manufacturing Group", category: "Manufacturing", country: "Germany" },
  { name: "Smart Logistics Solutions", category: "Logistics", country: "Singapore" },
  { name: "Green Energy Components", category: "Industrial Equipment", country: "Denmark" },
  { name: "Titanium Tools Corporation", category: "Industrial Equipment", country: "Japan" },
  { name: "Advanced Micro Parts Ltd", category: "Electronics", country: "South Korea" },
  { name: "Urban Construction Materials", category: "Raw Materials", country: "United States" },
  { name: "Eco Packaging Industries", category: "Packaging", country: "Netherlands" },
  { name: "Quantum Electronics Supply", category: "Electronics", country: "Taiwan" },
  { name: "Prime Industrial Components", category: "Manufacturing", country: "Canada" },
  { name: "Velocity Freight Services", category: "Logistics", country: "United Kingdom" },
  { name: "Reliable Hardware Suppliers", category: "Manufacturing", country: "Mexico" },
  { name: "NextGen Mechanical Systems", category: "Industrial Equipment", country: "United States" },
  { name: "Blue Ocean Shipping", category: "Logistics", country: "United Arab Emirates" },
  { name: "Vertex Industrial Systems", category: "Industrial Equipment", country: "Switzerland" },
  { name: "Summit Industrial Equipment", category: "Industrial Equipment", country: "United States" },
  { name: "Atlas Engineering Works", category: "Manufacturing", country: "India" },
  { name: "Fusion Electronic Components", category: "Electronics", country: "China" }
];

const certificationNames = ["ISO 9001", "ISO 14001", "SOC 2", "CE Certification", "RoHS Compliance"];
const documentTypes = [
  "Supplier Agreement",
  "Compliance Certificate",
  "Quality Certification",
  "Service Contract"
];
const activityTemplates = [
  "Supplier created",
  "Supplier profile updated",
  "Certification uploaded",
  "Scorecard updated",
  "Compliance reviewed",
  "Contract uploaded"
];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function compareDates(a: string, b: string) {
  const aTime = new Date(a).getTime();
  const bTime = new Date(b).getTime();
  if (aTime < bTime) return -1;
  if (aTime > bTime) return 1;
  return 0;
}

async function getAuthUserId(email: string) {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) {
    throw new Error(error.message);
  }
  const user = (data?.users ?? []).find((entry) => entry.email?.toLowerCase() === email.toLowerCase());
  return user?.id ?? null;
}

async function ensureTenantForUser(userId: string) {
  const { data: existingUser } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", userId)
    .maybeSingle();

  if (existingUser?.tenant_id) {
    return existingUser.tenant_id as string;
  }

  const { data: existingTenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("name", TENANT_NAME)
    .maybeSingle();

  if (existingTenant?.id) {
    return existingTenant.id as string;
  }

  const { data: tenant, error } = await supabase
    .from("tenants")
    .insert({ name: TENANT_NAME, owner_id: userId })
    .select("id")
    .single();

  if (error || !tenant) {
    throw new Error(error?.message ?? "Failed to create tenant");
  }
  return tenant.id as string;
}

async function upsertUserProfile(userId: string, tenantId: string, email: string) {
  const { error } = await supabase.from("users").upsert(
    {
      id: userId,
      tenant_id: tenantId,
      email,
      role: "admin",
      status: "active"
    },
    { onConflict: "id" }
  );
  if (error) {
    throw new Error(error.message);
  }
}

async function seedSuppliers(tenantId: string) {
  const { data: existing } = await supabase
    .from("suppliers")
    .select("id,name,risk_score")
    .eq("tenant_id", tenantId);
  const existingByName = new Map((existing ?? []).map((row) => [row.name, row.id]));

  const rows = supplierSeeds.map((supplier, index) => {
    const slug = slugify(supplier.name);
    const baseRisk = 40 + (index * 3) % 55;
    const riskScore = clamp(baseRisk + randomInt(-8, 8), 30, 95);
    const status = riskScore >= 80 ? "at_risk" : riskScore >= 65 ? "monitor" : "active";
    return {
      tenant_id: tenantId,
      name: supplier.name,
      category: supplier.category,
      email: `procurement@${slug}.com`,
      contact_email: `operations@${slug}.com`,
      phone: "+1 555-01" + String(10 + index).padStart(2, "0"),
      location: supplier.country,
      country: supplier.country,
      risk_score: riskScore,
      status
    };
  });

  const inserts = rows.filter((row) => !existingByName.has(row.name));

  if (inserts.length > 0) {
    const { error } = await supabase.from("suppliers").upsert(inserts, {
      onConflict: "tenant_id,name"
    });
    if (error) {
      throw new Error(error.message);
    }
  }

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id,name,risk_score")
    .eq("tenant_id", tenantId);

  return {
    countInserted: inserts.length,
    suppliers: suppliers ?? []
  };
}

async function seedScorecards(tenantId: string, suppliers: { id: string; risk_score: number }[]) {
  const rows = suppliers.map((supplier) => {
    const riskPenalty = Math.round((supplier.risk_score - 50) / 5);
    const quality = clamp(92 - riskPenalty + randomInt(-4, 4), 70, 100);
    const delivery = clamp(90 - riskPenalty + randomInt(-5, 5), 70, 100);
    const service = clamp(88 - riskPenalty + randomInt(-6, 6), 70, 100);
    const overall = Math.round((quality + delivery + service) / 3);
    return {
      tenant_id: tenantId,
      supplier_id: supplier.id,
      quality_score: quality,
      delivery_score: delivery,
      service_score: service,
      overall_score: overall,
      created_at: new Date().toISOString()
    };
  });

  const { error } = await supabase.from("supplier_scorecards").upsert(rows, {
    onConflict: "tenant_id,supplier_id"
  });
  if (error) {
    throw new Error(error.message);
  }
  return rows.length;
}

async function seedCertifications(tenantId: string, suppliers: { id: string }[]) {
  const { data: existing } = await supabase
    .from("certifications")
    .select("supplier_id,name")
    .eq("tenant_id", tenantId);

  const existingKey = new Set((existing ?? []).map((row) => `${row.supplier_id}:${row.name}`));

  const rows = suppliers.flatMap((supplier, index) => {
    const max = index % 3 === 0 ? 2 : 1;
    return certificationNames.slice(0, max + 1).map((name, certIndex) => {
      const issueDate = daysFromNow(-420 - certIndex * 30 - index * 2);
      const expiryDate = daysFromNow(60 + certIndex * 30 + index);
      return {
        tenant_id: tenantId,
        supplier_id: supplier.id,
        name,
        issuer: name.includes("ISO") ? "International Standards Org" : "Compliance Board",
        issued_at: issueDate,
        expires_at: expiryDate
      };
    });
  });

  const inserts = rows.filter((row) => !existingKey.has(`${row.supplier_id}:${row.name}`));

  if (inserts.length > 0) {
    const { error } = await supabase.from("certifications").upsert(inserts, {
      onConflict: "tenant_id,supplier_id,name"
    });
    if (error) {
      throw new Error(error.message);
    }
  }
  return inserts.length;
}

async function seedDocuments(tenantId: string, suppliers: { id: string; name: string }[]) {
  const { data: existing } = await supabase
    .from("documents")
    .select("supplier_id,file_name")
    .eq("tenant_id", tenantId);

  const existingKey = new Set((existing ?? []).map((row) => `${row.supplier_id}:${row.file_name}`));

  const rows = suppliers.flatMap((supplier, index) => {
    const max = index % 3 === 0 ? 2 : 1;
    return documentTypes.slice(0, max + 1).map((docType) => {
      const fileName = `${docType.replace(/\s+/g, "_").toLowerCase()}_${slugify(supplier.name)}.pdf`;
      return {
        tenant_id: tenantId,
        supplier_id: supplier.id,
        document_type: docType,
        file_name: fileName,
        file_path: `seed/${supplier.id}/${fileName}`,
        expires_at: docType === "Compliance Certificate" ? daysFromNow(120) : null
      };
    });
  });

  const inserts = rows.filter((row) => !existingKey.has(`${row.supplier_id}:${row.file_name}`));

  if (inserts.length > 0) {
    const { error } = await supabase.from("documents").upsert(inserts, {
      onConflict: "tenant_id,supplier_id,file_name"
    });
    if (error) {
      throw new Error(error.message);
    }
  }
  return inserts.length;
}

async function seedComplianceRecords(tenantId: string, suppliers: { id: string }[]) {
  const { data: existing } = await supabase
    .from("compliance_records")
    .select("supplier_id,certification_name")
    .eq("tenant_id", tenantId);

  const existingKey = new Set((existing ?? []).map((row) => `${row.supplier_id}:${row.certification_name}`));

  const rows = suppliers.map((supplier, index) => {
    const cert = certificationNames[index % certificationNames.length];
    const issueDate = daysFromNow(-300 - index * 2);
    const expiryDate = daysFromNow(30 + index);
    const status = compareDates(expiryDate, daysFromNow(30)) <= 0 ? "flagged" : "approved";
    return {
      tenant_id: tenantId,
      supplier_id: supplier.id,
      policy_name: `${cert} Compliance Review`,
      certification_name: cert,
      issue_date: issueDate,
      expiry_date: expiryDate,
      status,
      notes: "Reviewed as part of quarterly compliance cadence.",
      reviewed_at: status === "approved" ? daysFromNow(-10) : null
    };
  });

  const inserts = rows.filter((row) => !existingKey.has(`${row.supplier_id}:${row.certification_name}`));

  if (inserts.length > 0) {
    const { error } = await supabase.from("compliance_records").upsert(inserts, {
      onConflict: "tenant_id,supplier_id,certification_name"
    });
    if (error) {
      throw new Error(error.message);
    }
  }
  return inserts.length;
}

async function seedActivityLogs(tenantId: string, suppliers: { id: string; name: string }[]) {
  const { count } = await supabase
    .from("activity_logs")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId);

  const existingCount = count ?? 0;
  const targetCount = 60;
  if (existingCount >= targetCount) {
    return 0;
  }

  const rows = Array.from({ length: targetCount - existingCount }).map((_, index) => {
    const supplier = suppliers[index % suppliers.length];
    const summary = activityTemplates[index % activityTemplates.length];
    return {
      tenant_id: tenantId,
      supplier_id: supplier.id,
      activity_type: summary.toLowerCase().replace(/\s+/g, "_"),
      summary: `${summary} for ${supplier.name}`,
      created_at: new Date(Date.now() - index * 60 * 60 * 1000).toISOString()
    };
  });

  const { error } = await supabase.from("activity_logs").insert(rows);
  if (error) {
    throw new Error(error.message);
  }
  return rows.length;
}

async function seed() {
  const userId = await getAuthUserId(TARGET_EMAIL);
  if (!userId) {
    throw new Error(`Auth user not found for ${TARGET_EMAIL}`);
  }

  const tenantId = await ensureTenantForUser(userId);
  await upsertUserProfile(userId, tenantId, TARGET_EMAIL);

  const supplierResult = await seedSuppliers(tenantId);
  const suppliers = supplierResult.suppliers;

  const scorecardsInserted = await seedScorecards(
    tenantId,
    suppliers.map((s) => ({ id: s.id, risk_score: s.risk_score }))
  );
  const certificationsInserted = await seedCertifications(
    tenantId,
    suppliers.map((s) => ({ id: s.id }))
  );
  const documentsInserted = await seedDocuments(
    tenantId,
    suppliers.map((s) => ({ id: s.id, name: s.name }))
  );
  const complianceInserted = await seedComplianceRecords(
    tenantId,
    suppliers.map((s) => ({ id: s.id }))
  );
  const activitiesInserted = await seedActivityLogs(
    tenantId,
    suppliers.map((s) => ({ id: s.id, name: s.name }))
  );

  console.log("Seed complete for:", TARGET_EMAIL);
  console.log(`Tenants: 0 (reused existing)`);
  console.log(`Users: 1 (upserted)`);
  console.log(`Suppliers inserted: ${supplierResult.countInserted}`);
  console.log(`Supplier scorecards upserted: ${scorecardsInserted}`);
  console.log(`Certifications inserted: ${certificationsInserted}`);
  console.log(`Documents inserted: ${documentsInserted}`);
  console.log(`Compliance records inserted: ${complianceInserted}`);
  console.log(`Activity logs inserted: ${activitiesInserted}`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
