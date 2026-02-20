import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getClientByDomain } from "@/lib/getClientByDomain";

export async function POST(req: Request) {
  try {
    const client = await getClientByDomain();

    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Rate limit: max 5 messages per email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("cliente_id", client.id)
      .eq("sender_email", email)
      .gte("created_at", oneHourAgo);

    if ((count ?? 0) >= 5) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 }
      );
    }

    const { error } = await supabaseAdmin.from("contact_messages").insert({
      cliente_id: client.id,
      sender_name: name.slice(0, 200),
      sender_email: email.slice(0, 200),
      message: message.slice(0, 5000),
    });

    if (error) {
      console.error("Error inserting contact message:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.message === "Dominio no autorizado") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
