import { requireAdminClient } from "@/lib/requireAdminClient";
import ConnectStripeButton from "./ConnectStripeButton";
import SubscriptionButton from "./SubscriptionButton";
import CancelSubscriptionButton from "./CancelSubscriptionButton";
import ReactivateSubscriptionButton from "./ReactivateSubscriptionButton";
import ChangePlanForm from "./ChangePlanForm";
import { getTranslations, getLocale } from 'next-intl/server';

type StripeStatus = "none" | "pending" | "active";

export default async function AdminStripePage() {
  const client = await requireAdminClient();
  const t = await getTranslations('admin.stripe');
  const tc = await getTranslations('common');
  const locale = await getLocale();

  let stripeStatus: StripeStatus = "none";

  if (client.stripe_account_id) {
    if (client.stripe_charges_enabled === true) {
      stripeStatus = "active";
    } else {
      stripeStatus = "pending";
    }
  }

  const statusLabel =
    stripeStatus === "none"
      ? t('notConnected')
      : stripeStatus === "pending"
        ? t('inProcess')
        : t('connected');

  const statusStyle =
    stripeStatus === "none"
      ? "border-red-500/30 text-red-600 dark:text-red-300 bg-red-500/10"
      : stripeStatus === "pending"
        ? "border-amber-500/30 text-amber-600 dark:text-amber-300 bg-amber-500/10"
        : "border-emerald-500/30 text-emerald-600 dark:text-emerald-300 bg-emerald-500/10";

  const buttonLabel =
    stripeStatus === "none" ? t('connectStripe') : t('completeVerification');

  const planKey = (client.plan || "start").toString().toLowerCase();
  const planMeta: Record<string, { label: string; price: string; fee: string }> = {
    start: { label: "Start", price: "29 € / mes", fee: "5 %" },
    grow: { label: "Grow", price: "59 € / mes", fee: "3 %" },
    pro: { label: "Pro", price: "99 € / mes", fee: "1 %" },
  };
  const planInfo = planMeta[planKey] || planMeta.start;

  const isCanceling =
    client.subscription_cancel_at &&
    new Date(client.subscription_cancel_at) > new Date();

  const cancelAtFormatted = isCanceling
    ? new Date(client.subscription_cancel_at).toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('title')}</h1>
          <p className="text-gray-400 dark:text-white/40">
            {t('subtitle')}
          </p>
        </div>

        <section className="panel-card p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{t('stripeStatus')}</h2>
              <p className="text-sm text-gray-500 dark:text-white/60">
                {t('stripeStatusDesc')}
              </p>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-sm font-semibold ${statusStyle}`}
            >
              {statusLabel}
            </span>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50/50 dark:bg-white/10 p-4">
            <div className="text-sm text-gray-500 dark:text-white/60 mb-1">{t('stripeAccountId')}</div>
            <div className="text-sm break-all text-gray-700 dark:text-white/80">
              {client.stripe_account_id ?? "—"}
            </div>
          </div>

          {stripeStatus === "pending" && (
            <div className="flex justify-end">
              <ConnectStripeButton
                label={buttonLabel}
                disabled={stripeStatus !== "pending"}
              />
            </div>
          )}
        </section>

        <section className="panel-card p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{t('subscription')}</h2>
            <p className="text-sm text-gray-500 dark:text-white/60">
              {t('subscriptionDesc')}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50/50 dark:bg-white/10 p-4">
              <div className="text-sm text-gray-500 dark:text-white/60 mb-1">{t('currentPlan')}</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {planInfo.label}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50/50 dark:bg-white/10 p-4">
              <div className="text-sm text-gray-500 dark:text-white/60 mb-1">{t('monthlyPrice')}</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {planInfo.price}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50/50 dark:bg-white/10 p-4">
              <div className="text-sm text-gray-500 dark:text-white/60 mb-1">{t('bookingFee')}</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {planInfo.fee}
              </div>
            </div>
          </div>

          {client.stripe_subscription_id && isCanceling ? (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-600 dark:text-amber-300">
                  {t('scheduledCancellation')}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-white/70">
                {t('cancelAt', { date: cancelAtFormatted ?? '' })}
              </p>
              <div className="flex justify-end">
                <ReactivateSubscriptionButton />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-3">
              {client.stripe_subscription_id ? (
                <>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                    {t('activeSubscription')}
                  </span>
                  <CancelSubscriptionButton />
                </>
              ) : (
                <SubscriptionButton />
              )}
            </div>
          )}
        </section>

        {client.stripe_subscription_id && !isCanceling && (
          <section className="panel-card p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{t('changePlan')}</h2>
              <p className="text-sm text-gray-500 dark:text-white/60">
                {t('changePlanDesc')}
              </p>
            </div>

            <ChangePlanForm
              currentPlan={planKey}
            />
          </section>
        )}

        <section className="panel-card p-6 space-y-3">
          <h2 className="text-xl font-semibold">{t('platformFee')}</h2>
          <p className="text-sm text-gray-600 dark:text-white/70">
            {t('platformFeeDesc')}
          </p>
          <ul className="text-sm text-gray-500 dark:text-white/60 list-disc ps-5 space-y-1">
            <li>Start → 29 € + 5 %</li>
            <li>Grow → 59 € + 3 %</li>
            <li>Pro → 99 € + 1 %</li>
          </ul>
        </section>
      </div>
  );
}
