import { NextResponse } from "next/server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { addDomainToVercel } from "@/lib/vercel/domains";

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
      { added: false, error: "no_domain" },
      { status: 400 }
    );
  }

  const result = await addDomainToVercel(domain);

  if (!result.added) {
    return NextResponse.json(
      { added: false, error: result.error, message: result.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    added: true,
    verified: result.verified,
    verification: result.verification,
  });
}
