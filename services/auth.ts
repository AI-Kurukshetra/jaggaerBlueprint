import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function ensureUserAndTenant() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: existing } = await supabase
    .from("users")
    .select("id,tenant_id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) {
    return existing;
  }

  const tenantName = user.email ? `${user.email.split("@")[0]}'s Workspace` : "Default Workspace";
  const admin = createAdminClient();
  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .insert({ name: tenantName, owner_id: user.id })
    .select("id")
    .single();

  if (tenantError || !tenant) {
    throw new Error(tenantError?.message ?? "Failed to create tenant");
  }

  const { data: upsertedUser, error: userError } = await admin
    .from("users")
    .upsert(
      {
        id: user.id,
        tenant_id: tenant.id,
        email: user.email,
        role: "owner",
        status: "active"
      },
      { onConflict: "id" }
    )
    .select("id,tenant_id")
    .single();

  if (userError || !upsertedUser) {
    throw new Error(userError?.message ?? "Failed to upsert user");
  }

  return upsertedUser;
}
