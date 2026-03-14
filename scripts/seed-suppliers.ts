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

const categories = [
  "Manufacturing",
  "Electronics",
  "Logistics",
  "Raw Materials",
  "Packaging",
  "Industrial Equipment"
];

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
  "Supplier added",
  "Supplier profile updated",
  "Certification uploaded",
  "Performance score updated",
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

async function ensureTenant(userId: string) {
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id")
    .eq("name", TENANT_NAME)
    .maybeSingle();

  if (tenant?.id) {
    return tenant.id as string;
  }

  const { data: created, error } = await supabase
    .from("tenants")
    .insert({ name: TENANT_NAME, owner_id: userId })
    .select("id")
    .single();

  if (error || !created) {
    throw new Error(error?.message ?? "Failed to create tenant");
  }

  console.log("Created tenant:", TENANT_NAME);
  return created.id as string;
}

async function ensureUserProfile(userId: string, tenantId: string, email: string) {
  const { data: existing } = await supabase
    .from("users")
    .select("id,tenant_id,role")
    .eq("id", userId)
    .maybeSingle();

  if (!existing) {
    const { error } = await supabase
      .from("users")
      .insert({ id: userId, tenant_id: tenantId, email, role: "admin", status: "active" });
    if (error) {
      throw new Error(error.message);
    }
    console.log("Created user profile for:", email);
    return;
  }

  const updates: { tenant_id?: string; role?: string } = {};
  if (existing.tenant_id !== tenantId) {
    updates.tenant_id = tenantId;
  }
  if (existing.role !== "admin") {
    updates.role = "admin";
  }

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase.from("users").update(updates).eq("id", userId);
    if (error) {
      throw new Error(error.message);
    }
    console.log("Updated user profile:", email);
  }
}

async function seedSuppliers(tenantId: string) {
  const { data: existingSuppliers } = await supabase
    .from("suppliers")
    .select("id,name")
    .eq("tenant_id", tenantId);

  const existingByName = new Map((existingSuppliers ?? []).map((row) => [row.name, row.id]));

  const suppliersToInsert = supplierSeeds
    .filter((supplier) => !existingByName.has(supplier.name))
    .map((supplier, index) => {
      const nameSlug = slugify(supplier.name);
      const baseRisk = 40 + (index * 3) % 55;
      const riskScore = clamp(baseRisk + randomInt(-8, 8), 30, 95);
      const status = riskScore >= 80 ? "at_risk" : riskScore >= 65 ? "monitor" : "active";
      return {
        tenant_id: tenantId,
        name: supplier.name,
        category: supplier.category,
        email: `procurement@${nameSlug}.com`,
        contact_email: `operations@${nameSlug}.com`,
        phone: "+1 555-01" + String(10 + index).padStart(2, "0"),
        location: supplier.country,
        country: supplier.country,
        risk_score: riskScore,
        status
      };
    });

  if (suppliersToInsert.length > 0) {
    const { error } = await supabase.from("suppliers").upsert(suppliersToInsert, {
      onConflict: "tenant_id,name"
    });
    if (error) {
      throw new Error(error.message);
    }
    console.log(`Inserted ${suppliersToInsert.length} suppliers.`);
  } else {
    console.log("Suppliers already seeded.");
  }

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id,name,risk_score")
    .eq("tenant_id", tenantId);

  return suppliers ?? [];
}

async function seedScorecards(
  tenantId: string,
  suppliers: { id: string; risk_score: number }[]
) {
  const { data: existing } = await supabase
    .from("supplier_scorecards")
    .select("supplier_id")
    .eq("tenant_id", tenantId);

  const existingSupplierIds = new Set((existing ?? []).map((row) => row.supplier_id));

  const scorecards = suppliers
    .filter((supplier) => !existingSupplierIds.has(supplier.id))
    .map((supplier) => {
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

  if (scorecards.length > 0) {
    const { error } = await supabase.from("supplier_scorecards").upsert(scorecards, {
      onConflict: "tenant_id,supplier_id"
    });
    if (error) {
      throw new Error(error.message);
    }
    console.log(`Inserted ${scorecards.length} supplier scorecards.`);
  } else {
    console.log("Supplier scorecards already seeded.");
  }
}

async function seedCertifications(tenantId: string, suppliers: { id: string; name: string }[]) {
  const { data: existing } = await supabase
    .from("certifications")
    .select("supplier_id,name")
    .eq("tenant_id", tenantId);

  const existingKey = new Set((existing ?? []).map((row) => `${row.supplier_id}:${row.name}`));

  const rows = suppliers.flatMap((supplier, index) => {
    const baseOffset = index % 4;
    return certificationNames.map((name, certIndex) => {
      if (certIndex > 1 && index % 2 === 0) {
        return null;
      }
      const issueDate = daysFromNow(-400 - baseOffset * 30 - certIndex * 20);
      const expiryDate = daysFromNow(60 + baseOffset * 20 + certIndex * 25);
      return {
        tenant_id: tenantId,
        supplier_id: supplier.id,
        name,
        issuer: name.includes("ISO") ? "International Standards Org" : "Compliance Board",
        issued_at: issueDate,
        expires_at: expiryDate
      };
    }).filter(Boolean) as Record<string, unknown>[];
  });

  const inserts = rows.filter((row) => !existingKey.has(`${row.supplier_id}:${row.name}`));

  if (inserts.length > 0) {
    const { error } = await supabase.from("certifications").upsert(inserts, {
      onConflict: "tenant_id,supplier_id,name"
    });
    if (error) {
      throw new Error(error.message);
    }
    console.log(`Inserted ${inserts.length} certifications.`);
  } else {
    console.log("Certifications already seeded.");
  }
}

async function seedDocuments(tenantId: string, suppliers: { id: string; name: string }[]) {
  const { data: existing } = await supabase
    .from("documents")
    .select("supplier_id,file_name")
    .eq("tenant_id", tenantId);

  const existingKey = new Set((existing ?? []).map((row) => `${row.supplier_id}:${row.file_name}`));

  const rows = suppliers.flatMap((supplier) =>
    documentTypes.map((docType) => {
      const fileName = `${docType.replace(/\s+/g, "_").toLowerCase()}_${slugify(supplier.name)}.pdf`;
      return {
        tenant_id: tenantId,
        supplier_id: supplier.id,
        document_type: docType,
        file_name: fileName,
        file_path: `seed/${supplier.id}/${fileName}`,
        expires_at: docType === "Compliance Certificate" ? daysFromNow(120) : null
      };
    })
  );

  const inserts = rows.filter((row) => !existingKey.has(`${row.supplier_id}:${row.file_name}`));

  if (inserts.length > 0) {
    const { error } = await supabase.from("documents").upsert(inserts, {
      onConflict: "tenant_id,supplier_id,file_name"
    });
    if (error) {
      throw new Error(error.message);
    }
    console.log(`Inserted ${inserts.length} documents.`);
  } else {
    console.log("Documents already seeded.");
  }
}

async function seedComplianceRecords(tenantId: string, suppliers: { id: string }[]) {
  const { data: existing } = await supabase
    .from("compliance_records")
    .select("supplier_id,certification_name")
    .eq("tenant_id", tenantId);

  const existingKey = new Set((existing ?? []).map((row) => `${row.supplier_id}:${row.certification_name}`));

  const rows = suppliers.flatMap((supplier, index) =>
    certificationNames.map((cert, certIndex) => {
      if (certIndex > 1 && index % 2 !== 0) {
        return null;
      }
      const issueDate = daysFromNow(-300 - certIndex * 20 - index * 2);
      const expiryDate = daysFromNow(30 + certIndex * 40 + index);
      const status = compareDates(expiryDate, daysFromNow(30)) <= 0
        ? "flagged"
        : certIndex % 2 === 0
          ? "approved"
          : "pending";
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
    }).filter(Boolean) as Record<string, unknown>[]
  );

  const inserts = rows.filter((row) => !existingKey.has(`${row.supplier_id}:${row.certification_name}`));

  if (inserts.length > 0) {
    const { error } = await supabase.from("compliance_records").upsert(inserts, {
      onConflict: "tenant_id,supplier_id,certification_name"
    });
    if (error) {
      throw new Error(error.message);
    }
    console.log(`Inserted ${inserts.length} compliance records.`);
  } else {
    console.log("Compliance records already seeded.");
  }
}

async function seedActivityLogs(tenantId: string, suppliers: { id: string; name: string }[]) {
  const { count } = await supabase
    .from("activity_logs")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId);

  if ((count ?? 0) >= 50) {
    console.log("Activity logs already seeded.");
    return;
  }

  const rows = Array.from({ length: 60 }).map((_, index) => {
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
  console.log(`Inserted ${rows.length} activity logs.`);
}

async function seed() {
  const userId = await getAuthUserId(TARGET_EMAIL);
  if (!userId) {
    throw new Error(`Auth user not found for ${TARGET_EMAIL}`);
  }

  const tenantId = await ensureTenant(userId);
  await ensureUserProfile(userId, tenantId, TARGET_EMAIL);

  const suppliers = await seedSuppliers(tenantId);
  await seedScorecards(tenantId, suppliers.map((s) => ({ id: s.id, risk_score: s.risk_score })));
  await seedCertifications(tenantId, suppliers.map((s) => ({ id: s.id, name: s.name })));
  await seedDocuments(tenantId, suppliers.map((s) => ({ id: s.id, name: s.name })));
  await seedComplianceRecords(tenantId, suppliers.map((s) => ({ id: s.id })));
  await seedActivityLogs(tenantId, suppliers.map((s) => ({ id: s.id, name: s.name })));

  console.log("Seed suppliers complete for:", TARGET_EMAIL);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
