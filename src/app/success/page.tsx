import { getClientByDomain } from "@/lib/getClientByDomain";
import { supabaseAdmin } from "@/lib/supabase-server";

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
    stripe_session_id?: string;
    destino?: string;
    fecha_salida?: string;
    fecha_regreso?: string;
    personas?: string;
    total?: string;
  }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const client = await getClientByDomain();

  const primaryColor = client?.primary_color || "#38bdf8";
  const safeLogoUrl = (() => {
    const logoUrl = client?.logo_url;
    if (typeof logoUrl !== "string") return null;
    const cleaned = logoUrl.trim();
    if (!cleaned) return null;
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
      return cleaned;
    }
    if (cleaned.startsWith("/")) return cleaned;
    return null;
  })();

  const sessionId = params.session_id || params.stripe_session_id || null;

  let reserva: any = null;
  if (sessionId) {
    const { data } = await supabaseAdmin
      .from("reservas")
      .select("destino, fecha_salida, fecha_regreso, personas, precio")
      .eq("stripe_session_id", sessionId)
      .single();
    reserva = data ?? null;
  }

  const summary = [
    {
      label: "Destino",
      value: reserva?.destino || params.destino,
    },
    {
      label: "Fechas",
      value:
        reserva?.fecha_salida || reserva?.fecha_regreso || params.fecha_salida || params.fecha_regreso
          ? `${reserva?.fecha_salida ?? params.fecha_salida ?? "—"} → ${
              reserva?.fecha_regreso ?? params.fecha_regreso ?? "—"
            }`
          : null,
    },
    {
      label: "Personas",
      value: reserva?.personas?.toString() || params.personas,
    },
    {
      label: "Total",
      value:
        typeof reserva?.precio === "number"
          ? `${reserva.precio} €`
          : params.total
          ? `${params.total} €`
          : null,
    },
  ].filter((item) => item.value);

  const contactEmail = client?.contact_email || null;
  const contactPhone = client?.contact_phone || null;
  const contactHref = contactEmail
    ? `mailto:${contactEmail}`
    : contactPhone
    ? `tel:${contactPhone}`
    : null;
  const contactLabel = contactEmail
    ? "Contactar con la agencia"
    : contactPhone
    ? "Llamar a la agencia"
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/70 to-slate-950" />
      <div
        className="absolute -top-24 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full blur-[140px]"
        style={{
          backgroundColor: `color-mix(in srgb, ${primaryColor} 28%, transparent)`,
        }}
      />
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-3xl border border-white/10 p-8 md:p-10 text-center">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                backgroundColor: `color-mix(in srgb, ${primaryColor} 18%, transparent)`,
                border: `1px solid color-mix(in srgb, ${primaryColor} 45%, transparent)`,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                fill="none"
                stroke={primaryColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            {safeLogoUrl && (
              <img
                src={safeLogoUrl}
                alt={client?.nombre ?? ""}
                className="mx-auto h-12 w-12 rounded-xl object-contain mb-4"
              />
            )}

            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
              ¡Reserva confirmada!
            </h1>
            <p className="text-white/70 text-lg">
              Tu pago se ha realizado correctamente.
            </p>

            {summary.length > 0 && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
                <h2 className="text-lg font-semibold mb-4">
                  Resumen de tu reserva
                </h2>
                <div className="space-y-2 text-sm text-white/70">
                  {summary.map((item) => (
                    <div key={item.label} className="flex justify-between gap-4">
                      <span>{item.label}</span>
                      <span className="text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-6 text-white/60">
              Hemos enviado un email con los detalles de tu reserva.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/"
                className="rounded-2xl px-6 py-3 text-white font-semibold shadow-[0_16px_40px_rgba(2,6,23,0.45)]"
                style={{ backgroundColor: primaryColor }}
              >
                Volver a la web
              </a>
              {contactHref && contactLabel && (
                <a
                  href={contactHref}
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-white/80 font-semibold hover:text-white hover:border-white/40 transition"
                >
                  {contactLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
