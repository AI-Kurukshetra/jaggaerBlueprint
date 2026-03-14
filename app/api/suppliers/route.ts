import { NextResponse } from "next/server";
import { getSuppliers } from "@/services/suppliers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? undefined;
  const suppliers = await getSuppliers(search);
  return NextResponse.json(suppliers);
}
