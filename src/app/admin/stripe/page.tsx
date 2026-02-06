import AdminShell from "@/components/admin/AdminShell";
import { requireAdminClient } from "@/lib/requireAdminClient";
import ConnectStripeButton from "./ConnectStripeButton";

export default async function AdminStripePage() {
  const client = await requireAdminClient();

  const brandStyle = client.primary_color
    ? { backgroundColor: client.primary_color }
    : undefined;

  const showConnect =
    !client.stripe_account_id || !client.stripe_charges_enabled;

  const statusLabel = !client.stripe_account_id
    ? "Stripe no conectado"
    : client.stripe_charges_enabled
      ? "Stripe activo y listo para cobrar"
      : "Stripe pendiente de verificación";

  const statusStyle = !client.stripe_account_id
    ? "border-red-500/30 text-red-300 bg-red-500/10"
    : client.stripe_charges_enabled
      ? "border-emerald-500/30 text-emerald-300 bg-emerald-500/10"
      : "border-amber-500/30 text-amber-300 bg-amber-500/10";

  return (
    <AdminShell clientName={client.nombre} primaryColor={client.primary_color}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Stripe / Pagos</h1>
          <p className="text-white/60">
            Revisa el estado de Stripe y completa la configuración de cobros.
          </p>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Estado de Stripe</h2>
              <p className="text-sm text-white/60">
                Conecta o finaliza la verificación para cobrar con tarjeta.
              </p>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-sm font-semibold ${statusStyle}`}
            >
              {statusLabel}
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
            <div className="text-sm text-white/60 mb-1">Stripe Account ID</div>
            <div className="text-sm break-all text-white/80">
              {client.stripe_account_id ?? "—"}
            </div>
          </div>

          {showConnect && (
            <div className="flex justify-end">
              <ConnectStripeButton primaryColor={client.primary_color} />
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
