import { NextRequest, NextResponse } from "next/server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { supabaseAdmin } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  let client;
  try {
    client = await requireAdminClient();
  } catch {
    return NextResponse.json({}, { status: 401 });
  }

  const body = await req.json();
  const domain = body.domain;

  if (!domain || typeof domain !== "string") {
    return NextResponse.json(
      { saved: false, error: "invalid_domain" },
      { status: 400 }
    );
  }

  // Sanitize: trim, lowercase, remove protocol
  const cleanDomain = domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");

  const { error } = await supabaseAdmin
    .from("clientes")
    .update({ domain: cleanDomain, domain_verified: false })
    .eq("id", client.id);

  if (error) {
    console.error("[domain/save] DB error:", error);
    return NextResponse.json(
      { saved: false, error: "db_error" },
      { status: 500 }
    );
  }

  revalidatePath("/admin/mi-web");

  return NextResponse.json({ saved: true, domain: cleanDomain });
}
