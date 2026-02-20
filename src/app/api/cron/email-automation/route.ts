import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendTemplateEmail } from "@/lib/emails/send-template-email";

export const runtime = "nodejs";
export const maxDuration = 60;

const REMINDER_DAYS_BEFORE = 3;
const FOLLOWUP_DAYS_AFTER = 2;

function formatDate(offset: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().split("T")[0];
}

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const results = { recordatorio: 0, seguimiento: 0, errors: 0 };

  try {
    // --- RECORDATORIO: bookings departing in X days ---
    const reminderDate = formatDate(REMINDER_DAYS_BEFORE);

    const { data: reminderBookings } = await supabaseAdmin
      .from("reservas")
      .select("id, cliente_id, nombre, email, destino, fecha_salida, fecha_regreso, personas")
      .eq("fecha_salida", reminderDate)
      .eq("estado_pago", "pagado")
      .eq("email_recordatorio_sent", false);

    if (reminderBookings && reminderBookings.length > 0) {
      // Group by cliente_id to batch template + branding lookups
      const clientIds = [...new Set(reminderBookings.map((b) => b.cliente_id))];

      for (const clientId of clientIds) {
        const [{ data: client }, { data: tpl }] = await Promise.all([
          supabaseAdmin
            .from("clientes")
            .select("nombre, logo_url, primary_color, contact_email, contact_phone")
            .eq("id", clientId)
            .single(),
          supabaseAdmin
            .from("email_templates")
            .select("subject, html_body, cta_text, cta_url, activo")
            .eq("cliente_id", clientId)
            .eq("tipo", "recordatorio_viaje")
            .eq("activo", true)
            .single(),
        ]);

        if (!client || !tpl) continue;

        const branding = {
          clientName: client.nombre,
          logoUrl: client.logo_url,
          primaryColor: client.primary_color,
          contactEmail: client.contact_email,
          contactPhone: client.contact_phone,
        };

        const bookings = reminderBookings.filter((b) => b.cliente_id === clientId);

        for (const booking of bookings) {
          try {
            const sent = await sendTemplateEmail({
              template: tpl,
              to: booking.email,
              tokens: {
                customerName: booking.nombre,
                destination: booking.destino,
                departureDate: booking.fecha_salida,
                returnDate: booking.fecha_regreso,
                persons: booking.personas,
                clientName: client.nombre,
                contactEmail: client.contact_email,
                contactPhone: client.contact_phone,
              },
              branding,
            });

            if (sent) {
              await supabaseAdmin
                .from("reservas")
                .update({ email_recordatorio_sent: true })
                .eq("id", booking.id);
              results.recordatorio++;
            }
          } catch (err) {
            console.error(`❌ Recordatorio error for reserva ${booking.id}:`, err);
            results.errors++;
          }
        }
      }
    }

    // --- SEGUIMIENTO: bookings that returned X days ago ---
    const followupDate = formatDate(-FOLLOWUP_DAYS_AFTER);

    const { data: followupBookings } = await supabaseAdmin
      .from("reservas")
      .select("id, cliente_id, nombre, email, destino, fecha_salida, fecha_regreso")
      .eq("fecha_regreso", followupDate)
      .eq("estado_pago", "pagado")
      .eq("email_seguimiento_sent", false);

    if (followupBookings && followupBookings.length > 0) {
      const clientIds = [...new Set(followupBookings.map((b) => b.cliente_id))];

      for (const clientId of clientIds) {
        const [{ data: client }, { data: tpl }] = await Promise.all([
          supabaseAdmin
            .from("clientes")
            .select("nombre, logo_url, primary_color, contact_email, contact_phone")
            .eq("id", clientId)
            .single(),
          supabaseAdmin
            .from("email_templates")
            .select("subject, html_body, cta_text, cta_url, activo")
            .eq("cliente_id", clientId)
            .eq("tipo", "seguimiento")
            .eq("activo", true)
            .single(),
        ]);

        if (!client || !tpl) continue;

        const branding = {
          clientName: client.nombre,
          logoUrl: client.logo_url,
          primaryColor: client.primary_color,
          contactEmail: client.contact_email,
          contactPhone: client.contact_phone,
        };

        const bookings = followupBookings.filter((b) => b.cliente_id === clientId);

        for (const booking of bookings) {
          try {
            const sent = await sendTemplateEmail({
              template: tpl,
              to: booking.email,
              tokens: {
                customerName: booking.nombre,
                destination: booking.destino,
                departureDate: booking.fecha_salida,
                returnDate: booking.fecha_regreso,
                clientName: client.nombre,
                contactEmail: client.contact_email,
                contactPhone: client.contact_phone,
              },
              branding,
            });

            if (sent) {
              await supabaseAdmin
                .from("reservas")
                .update({ email_seguimiento_sent: true })
                .eq("id", booking.id);
              results.seguimiento++;
            }
          } catch (err) {
            console.error(`❌ Seguimiento error for reserva ${booking.id}:`, err);
            results.errors++;
          }
        }
      }
    }
  } catch (error: any) {
    console.error("❌ Cron email-automation error:", error?.message || error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  console.log(`✅ Email automation: ${results.recordatorio} recordatorio, ${results.seguimiento} seguimiento, ${results.errors} errors`);
  return NextResponse.json({ ok: true, ...results });
}
