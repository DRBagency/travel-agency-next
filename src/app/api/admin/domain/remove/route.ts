import { NextRequest, NextResponse } from "next/server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { removeDomainFromVercel } from "@/lib/vercel/domains";

export async function POST(req: NextRequest) {
  try {
    await requireAdminClient();
  } catch {
    return NextResponse.json({}, { status: 401 });
  }

  const body = await req.json();
  const domain = body.domain;

  if (!domain || typeof domain !== "string") {
    return NextResponse.json(
      { removed: false, error: "invalid_domain" },
      { status: 400 }
    );
  }

  const result = await removeDomainFromVercel(domain);

  if (!result.removed) {
    return NextResponse.json(
      { removed: false, error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({ removed: true });
}
