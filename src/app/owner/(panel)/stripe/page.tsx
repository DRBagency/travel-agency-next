import { getTranslations } from 'next-intl/server';

export const dynamic = "force-dynamic";

export default async function OwnerStripePage() {
  const t = await getTranslations('owner.stripe');
  const tc = await getTranslations('common');
  const stripeConfig = {
    secretKey: process.env.STRIPE_SECRET_KEY?.substring(0, 20) + "..." || tc('noResults'),
    priceStart: process.env.STRIPE_PRICE_START || tc('noResults'),
    priceGrow: process.env.STRIPE_PRICE_GROW || tc('noResults'),
    pricePro: process.env.STRIPE_PRICE_PRO || tc('noResults'),
    webhookBilling: process.env.STRIPE_BILLING_WEBHOOK_SECRET?.substring(0, 20) + "..." || tc('noResults'),
    webhookConnect: process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 20) + "..." || tc('noResults'),
  };

  const mode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_live") ? "LIVE" : "TEST";

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('title')}</h1>
        <p className="text-gray-400 dark:text-white/40">{t('subtitle')}</p>
      </div>

      {/* Modo actual */}
      <div className={`${mode === "LIVE" ? "bg-emerald-50 dark:bg-green-500/20 border-emerald-200 dark:border-green-500/30" : "bg-amber-50 dark:bg-yellow-500/20 border-amber-200 dark:border-yellow-500/30"} backdrop-blur-sm rounded-lg p-6 border `}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{mode === "LIVE" ? "🟢" : "🟡"}</span>
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{t('mode', { mode })}</p>
            <p className="text-sm text-gray-500 dark:text-white/60">
              {mode === "LIVE"
                ? t('liveDesc')
                : t('testDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="panel-card ">
        <div className="p-6 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('apiKeys')}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-500 dark:text-white/60 mb-2">{t('secretKey')}</label>
            <code className="block bg-gray-100 dark:bg-white/[0.06] px-4 py-2 rounded text-sm text-gray-700 dark:text-white/80 font-mono">
              {stripeConfig.secretKey}
            </code>
          </div>
        </div>
      </div>

      {/* Price IDs */}
      <div className="panel-card ">
        <div className="p-6 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('priceIds')}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-500 dark:text-white/60 mb-2">Start (29€/mes)</label>
            <code className="block bg-gray-100 dark:bg-white/[0.06] px-4 py-2 rounded text-sm text-gray-700 dark:text-white/80 font-mono">
              {stripeConfig.priceStart}
            </code>
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-white/60 mb-2">Grow (59€/mes)</label>
            <code className="block bg-gray-100 dark:bg-white/[0.06] px-4 py-2 rounded text-sm text-gray-700 dark:text-white/80 font-mono">
              {stripeConfig.priceGrow}
            </code>
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-white/60 mb-2">Pro (99€/mes)</label>
            <code className="block bg-gray-100 dark:bg-white/[0.06] px-4 py-2 rounded text-sm text-gray-700 dark:text-white/80 font-mono">
              {stripeConfig.pricePro}
            </code>
          </div>
        </div>
      </div>

      {/* Webhook Secrets */}
      <div className="panel-card ">
        <div className="p-6 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('webhookSecrets')}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-500 dark:text-white/60 mb-2">{t('billingWebhook')}</label>
            <code className="block bg-gray-100 dark:bg-white/[0.06] px-4 py-2 rounded text-sm text-gray-700 dark:text-white/80 font-mono">
              {stripeConfig.webhookBilling}
            </code>
            <p className="text-xs text-gray-400 dark:text-white/40 mt-1">
              {t('billingWebhookDesc')}
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-white/60 mb-2">{t('connectWebhook')}</label>
            <code className="block bg-gray-100 dark:bg-white/[0.06] px-4 py-2 rounded text-sm text-gray-700 dark:text-white/80 font-mono">
              {stripeConfig.webhookConnect}
            </code>
            <p className="text-xs text-gray-400 dark:text-white/40 mt-1">
              {t('connectWebhookDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Enlaces útiles */}
      <div className="panel-card">
        <div className="p-6 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('usefulLinks')}</h2>
        </div>
        <div className="p-6 space-y-3">
          <a
            href={`https://dashboard.stripe.com/${mode === "TEST" ? "test/" : ""}dashboard`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-500 dark:hover:text-drb-turquoise-300"
          >
            → {t('stripeDashboard', { mode })}
          </a>
          <a
            href={`https://dashboard.stripe.com/${mode === "TEST" ? "test/" : ""}webhooks`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-500 dark:hover:text-drb-turquoise-300"
          >
            → {t('webhookConfig')}
          </a>
          <a
            href={`https://dashboard.stripe.com/${mode === "TEST" ? "test/" : ""}subscriptions`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-500 dark:hover:text-drb-turquoise-300"
          >
            → {t('activeSubscriptions')}
          </a>
          <a
            href={`https://dashboard.stripe.com/${mode === "TEST" ? "test/" : ""}connect/accounts/overview`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-500 dark:hover:text-drb-turquoise-300"
          >
            → {t('connectAccounts')}
          </a>
        </div>
      </div>
    </div>
  );
}
