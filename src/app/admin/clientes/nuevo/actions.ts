"use server";

import { supabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function createCliente(formData: FormData) {
  const payload = {
    nombre: formData.get("nombre") as string,
    slug: formData.get("slug") as string,
    domain: formData.get("domain") as string,
    primary_color: (formData.get("primary_color") as string) || null,
    hero_title: (formData.get("hero_title") as string) || null,
    hero_subtitle: (formData.get("hero_subtitle") as string) || null,
    hero_cta_text: (formData.get("hero_cta_text") as string) || null,
  };

  const { data: cliente, error } = await supabaseAdmin
    .from("clientes")
    .insert(payload)
    .select("id")
    .single();

  if (error || !cliente) {
    throw new Error("No se pudo crear el cliente");
  }

  const clienteId = cliente.id;

  await supabaseAdmin.from("opiniones").insert({
    cliente_id: clienteId,
    nombre: "Cliente Demo",
    ciudad: "Madrid",
    texto: "Excelente experiencia, todo fue rápido y claro.",
    rating: 5,
    activo: true,
  });

  await supabaseAdmin.from("paginas_legales").insert([
    {
      cliente_id: clienteId,
      titulo: "Aviso legal",
      slug: "aviso-legal",
      contenido: "<h2>Aviso legal</h2><p>Contenido pendiente.</p>",
      activo: true,
    },
    {
      cliente_id: clienteId,
      titulo: "Política de privacidad",
      slug: "privacidad",
      contenido: "<h2>Política de privacidad</h2><p>Contenido pendiente.</p>",
      activo: true,
    },
    {
      cliente_id: clienteId,
      titulo: "Política de cookies",
      slug: "cookies",
      contenido: "<h2>Política de cookies</h2><p>Contenido pendiente.</p>",
      activo: true,
    },
  ]);

  await supabaseAdmin.from("email_templates").insert({
    cliente_id: clienteId,
    tipo: "reserva_cliente",
    subject: "✅ Reserva confirmada",
    html_body:
      "<h1>Reserva confirmada</h1><p>Hola {{customerName}}, tu reserva a {{destination}} está confirmada.</p>",
    cta_text: "Contactar con la agencia",
    cta_url: "mailto:{{contactEmail}}",
    activo: true,
  });

  redirect("/admin/clientes");
}
