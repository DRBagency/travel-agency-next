import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;
  if (!clienteId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("notifications")
    .select("*")
    .eq("cliente_id", clienteId)
    .eq("read", false)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ notifications: data || [] });
}

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;
  if (!clienteId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { ids, markAllRead } = body as { ids?: string[]; markAllRead?: boolean };

  if (markAllRead) {
    await supabaseAdmin
      .from("notifications")
      .update({ read: true })
      .eq("cliente_id", clienteId)
      .eq("read", false);
  } else if (ids?.length) {
    await supabaseAdmin
      .from("notifications")
      .update({ read: true })
      .eq("cliente_id", clienteId)
      .in("id", ids);
  }

  return NextResponse.json({ success: true });
}
