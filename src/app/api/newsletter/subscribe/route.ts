import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { email, clienteId } = await req.json();

    if (!email || !clienteId) {
      return NextResponse.json(
        { error: "Email and clienteId are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .upsert(
        { cliente_id: clienteId, email, activo: true, subscribed_at: new Date().toISOString() },
        { onConflict: "cliente_id,email" }
      );

    if (error) {
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
