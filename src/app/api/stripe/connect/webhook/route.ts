import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendReservationEmails } from "@/lib/emails/send-reservation-emails";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  console.log("WEBHOOK HIT");
  try {
    await requireValidApiDomain();
  } catch {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const m = session.metadata;

    if (!m) {
      console.error("❌ No metadata in session");
      return new NextResponse("No metadata", { status: 400 });
    }

    const { data: reserva, error } = await supabaseAdmin
      .from("reservas")
      .insert({
      cliente_id: m.cliente_id,
      destino: m.destino_nombre,
      nombre: m.nombre,
      email: m.email,
      telefono: m.telefono || null,
      fecha_salida: m.fecha_salida,
      fecha_regreso: m.fecha_regreso,
      personas: Number(m.personas),
      precio: Number(m.total),
      estado_pago: "pagado",
      stripe_session_id: session.id,
      })
      .select("*")
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return new NextResponse("Database error", { status: 500 });
    }

    console.log("✅ Reserva guardada en Supabase:", session.id);

    const { data: client } = await supabaseAdmin
      .from("clientes")
      .select("nombre, logo_url, primary_color, contact_email, contact_phone")
      .eq("id", m.cliente_id)
      .single();

    const { data: templates } = await supabaseAdmin
      .from("email_templates")
      .select("tipo, subject, html_body, cta_text, cta_url, activo")
      .eq("cliente_id", m.cliente_id)
      .eq("activo", true)
      .in("tipo", ["reserva_cliente", "reserva_agencia"]);

    const templatesByType = (templates || []).reduce(
      (acc: Record<string, any>, row: any) => {
        acc[row.tipo] = row;
        return acc;
      },
      {}
    );

    if (reserva && client) {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        process.env.VERCEL_URL ||
        "";
      const adminUrl = baseUrl
        ? `https://${baseUrl.replace(/^https?:\/\//, "")}/admin/reserva/${reserva.id}`
        : null;

      await sendReservationEmails(
        {
          customerName: reserva.nombre,
          email: reserva.email,
          destination: reserva.destino,
          total: reserva.precio,
          persons: reserva.personas,
          departureDate: reserva.fecha_salida,
          returnDate: reserva.fecha_regreso,
          adminUrl,
        },
        {
          clientName: client.nombre,
          logoUrl: client.logo_url,
          primaryColor: client.primary_color,
          contactEmail: client.contact_email,
          contactPhone: client.contact_phone,
        },
        {
          reserva_cliente: templatesByType.reserva_cliente ?? null,
          reserva_agencia: templatesByType.reserva_agencia ?? null,
        }
      );
    }
  }

  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;

    await supabaseAdmin
      .from("clientes")
      .update({ stripe_charges_enabled: account.charges_enabled })
      .eq("stripe_account_id", account.id);
  }

  return NextResponse.json({ received: true });
}
