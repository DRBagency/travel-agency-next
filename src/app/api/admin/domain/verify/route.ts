import { NextResponse } from "next/server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { supabaseAdmin } from "@/lib/supabase-server";
import { verifyDomainOnVercel } from "@/lib/vercel/domains";
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
    // Step 1: DNS CNAME check (existing logic)
    const records = await dns.resolveCname(domain);
    const isDnsVerified = records.some(
      (r) => r.toLowerCase() === "cname.vercel-dns.com"
    );

    if (!isDnsVerified) {
      return NextResponse.json({ verified: false, error: "dns_not_verified", records });
    }

    // Step 2: Verify on Vercel API
    const vercelResult = await verifyDomainOnVercel(domain);

    // Step 3: Update DB if both DNS and Vercel are OK
    if (isDnsVerified) {
      await supabaseAdmin
        .from("clientes")
        .update({ domain_verified: true })
        .eq("id", client.id);
    }

    return NextResponse.json({
      verified: true,
      records,
      vercel: {
        verified: vercelResult.verified,
        verification: vercelResult.verification,
      },
    });
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    // DNS lookup failed — domain not configured yet
    if (code === "ENOTFOUND" || code === "ENODATA") {
      return NextResponse.json({ verified: false, error: "dns_not_found" });
    }
    return NextResponse.json({ verified: false, error: "dns_error" });
  }
}
