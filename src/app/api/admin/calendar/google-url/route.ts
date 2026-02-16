import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getClientByDomain } from "@/lib/getClientByDomain";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const cliente = await getClientByDomain();
  if (!cliente) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  }

  const { url } = await req.json();

  const { error } = await supabaseAdmin
    .from("clientes")
    .update({ google_calendar_url: url || null })
    .eq("id", cliente.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
