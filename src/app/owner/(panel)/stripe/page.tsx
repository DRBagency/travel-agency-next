export const dynamic = "force-dynamic";

export default async function OwnerStripePage() {
  const stripeConfig = {
    secretKey: process.env.STRIPE_SECRET_KEY?.substring(0, 20) + "..." || "No configurada",
    priceStart: process.env.STRIPE_PRICE_START || "No configurado",
    priceGrow: process.env.STRIPE_PRICE_GROW || "No configurado",
    pricePro: process.env.STRIPE_PRICE_PRO || "No configurado",
    webhookBilling: process.env.STRIPE_BILLING_WEBHOOK_SECRET?.substring(0, 20) + "..." || "No configurado",
    webhookConnect: process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 20) + "..." || "No configurado",
  };

  const mode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_live") ? "LIVE" : "TEST";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Configuración de Stripe</h1>
      <p className="text-white/60 mb-8">Gestión de la integración con Stripe</p>

      {/* Modo actual */}
      <div className={`${mode === "LIVE" ? "bg-green-500/20 border-green-500/30" : "bg-yellow-500/20 border-yellow-500/30"} backdrop-blur-sm rounded-lg p-6 border mb-8`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{mode === "LIVE" ? "🟢" : "🟡"}</span>
          <div>
            <p className="text-xl font-bold text-white">Modo {mode}</p>
            <p className="text-sm text-white/60">
              {mode === "LIVE"
                ? "Stripe está en modo producción. Los pagos son reales."
                : "Stripe está en modo test. Usa tarjetas de prueba."}
            </p>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 mb-8">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">API Keys</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Secret Key</label>
            <code className="block bg-black/30 px-4 py-2 rounded text-sm text-white/80 font-mono">
              {stripeConfig.secretKey}
            </code>
          </div>
        </div>
      </div>

      {/* Price IDs */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 mb-8">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Price IDs (Planes SaaS)</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Start (29€/mes)</label>
            <code className="block bg-black/30 px-4 py-2 rounded text-sm text-white/80 font-mono">
              {stripeConfig.priceStart}
            </code>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Grow (59€/mes)</label>
            <code className="block bg-black/30 px-4 py-2 rounded text-sm text-white/80 font-mono">
              {stripeConfig.priceGrow}
            </code>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Pro (99€/mes)</label>
            <code className="block bg-black/30 px-4 py-2 rounded text-sm text-white/80 font-mono">
              {stripeConfig.pricePro}
            </code>
          </div>
        </div>
      </div>

      {/* Webhook Secrets */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 mb-8">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Webhook Secrets</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Billing Webhook</label>
            <code className="block bg-black/30 px-4 py-2 rounded text-sm text-white/80 font-mono">
              {stripeConfig.webhookBilling}
            </code>
            <p className="text-xs text-white/40 mt-1">
              Para suscripciones del SaaS (/api/stripe/billing/webhook)
            </p>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Connect Webhook</label>
            <code className="block bg-black/30 px-4 py-2 rounded text-sm text-white/80 font-mono">
              {stripeConfig.webhookConnect}
            </code>
            <p className="text-xs text-white/40 mt-1">
              Para reservas de viajes (/api/stripe/connect/webhook)
            </p>
          </div>
        </div>
      </div>

      {/* Enlaces útiles */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Enlaces útiles</h2>
        </div>
        <div className="p-6 space-y-3">
          <a
            href={`https://dashboard.stripe.com/${mode === "TEST" ? "test/" : ""}dashboard`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300"
          >
            → Dashboard de Stripe {mode}
          </a>
          <a
            href={`https://dashboard.stripe.com/${mode === "TEST" ? "test/" : ""}webhooks`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300"
          >
            → Configuración de Webhooks
          </a>
          <a
            href={`https://dashboard.stripe.com/${mode === "TEST" ? "test/" : ""}subscriptions`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300"
          >
            → Suscripciones activas
          </a>
          <a
            href={`https://dashboard.stripe.com/${mode === "TEST" ? "test/" : ""}connect/accounts/overview`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:text-blue-300"
          >
            → Cuentas de Connect (agencias)
          </a>
        </div>
      </div>
    </div>
  );
}
