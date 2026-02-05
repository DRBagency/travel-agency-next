import { getClientByDomain } from "@/lib/getClientByDomain";

export default async function CancelPage() {
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

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/70 to-slate-950" />
      <div
        className="absolute -top-24 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full blur-[140px]"
        style={{
          backgroundColor: `color-mix(in srgb, ${primaryColor} 18%, transparent)`,
        }}
      />
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-3xl border border-white/10 p-8 md:p-10 text-center">
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 6h8" />
                <path d="M6 10h12" />
                <path d="M10 14h8" />
                <path d="M6 18h12" />
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
              Pago cancelado
            </h1>
            <p className="text-white/70 text-lg">
              No se ha realizado ningún cargo.
            </p>
            <p className="mt-3 text-white/60">
              Puedes intentarlo de nuevo cuando quieras.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/#destinos"
                className="rounded-2xl px-6 py-3 text-white font-semibold shadow-[0_16px_40px_rgba(2,6,23,0.45)]"
                style={{ backgroundColor: primaryColor }}
              >
                Volver a intentar la reserva
              </a>
              <a
                href="/"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-white/80 font-semibold hover:text-white hover:border-white/40 transition"
              >
                Volver a la web
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
