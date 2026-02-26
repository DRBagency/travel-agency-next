import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;
  if (!clienteId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "png";
  const filename = `logos/${clienteId}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await supabaseAdmin.storage.createBucket("public-assets", {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
  });

  const { error: uploadError } = await supabaseAdmin.storage
    .from("public-assets")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabaseAdmin.storage
    .from("public-assets")
    .getPublicUrl(filename);

  const url = `${urlData.publicUrl}?t=${Date.now()}`;

  const { error: dbError } = await supabaseAdmin
    .from("clientes")
    .update({ logo_url: url })
    .eq("id", clienteId);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ url });
}
