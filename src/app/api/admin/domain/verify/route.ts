import { NextResponse } from "next/server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { supabaseAdmin } from "@/lib/supabase-server";
import dns from "dns/promises";

export async function POST() {
  let client;
  try {
    client = await requireAdminClient();
  } catch {
    return NextResponse.json({}, { status: 401 });
  }

  const domain = client.domain;
  if (!domain) {
    return NextResponse.json(
      { verified: false, error: "no_domain" },
      { status: 400 }
    );
  }

  try {
    const records = await dns.resolveCname(domain);
    const isVerified = records.some(
      (r) => r.toLowerCase() === "cname.vercel-dns.com"
    );

    if (isVerified) {
      await supabaseAdmin
        .from("clientes")
        .update({ domain_verified: true })
        .eq("id", client.id);
    }

    return NextResponse.json({ verified: isVerified, records });
  } catch (err: any) {
    // DNS lookup failed — domain not configured yet
    if (err.code === "ENOTFOUND" || err.code === "ENODATA") {
      return NextResponse.json({ verified: false, error: "dns_not_found" });
    }
    return NextResponse.json({ verified: false, error: "dns_error" });
  }
}
