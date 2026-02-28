"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CreditCard, Wallet, ClipboardList, Loader2 } from "lucide-react";
import { sileo } from "sileo";

type BookingModel = "pago_completo" | "deposito_resto" | "solo_reserva";
type DepositType = "percentage" | "fixed";
type DeadlineType = "before_departure" | "after_booking";

interface BookingModelConfigProps {
  initialModel: BookingModel;
  initialDepositType: DepositType;
  initialDepositValue: number;
  initialDeadlineType: DeadlineType;
  initialDeadlineDays: number;
}

const MODELS = [
  { key: "pago_completo" as const, icon: CreditCard },
  { key: "deposito_resto" as const, icon: Wallet },
  { key: "solo_reserva" as const, icon: ClipboardList },
] as const;

export default function BookingModelConfig({
  initialModel,
  initialDepositType,
  initialDepositValue,
  initialDeadlineType,
  initialDeadlineDays,
}: BookingModelConfigProps) {
  const t = useTranslations("admin.cobros");
  const tc = useTranslations("common");
  const tt = useTranslations("toast");

  const [model, setModel] = useState<BookingModel>(initialModel);
  const [depositType, setDepositType] = useState<DepositType>(initialDepositType);
  const [depositValue, setDepositValue] = useState(initialDepositValue);
  const [deadlineType, setDeadlineType] = useState<DeadlineType>(initialDeadlineType);
  const [deadlineDays, setDeadlineDays] = useState(initialDeadlineDays);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/mi-web/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_model: model,
          deposit_type: depositType,
          deposit_value: depositValue,
          payment_deadline_type: deadlineType,
          payment_deadline_days: deadlineDays,
        }),
      });
      if (!res.ok) throw new Error();
      sileo.success({ title: tt("saved") });
    } catch {
      sileo.error({ title: tt("errorSaving") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="panel-card p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t("bookingModel")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-white/60">
          {t("bookingModelDesc")}
        </p>
      </div>

      {/* Model selection cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {MODELS.map(({ key, icon: Icon }) => {
          const selected = model === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setModel(key)}
              className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all text-center ${
                selected
                  ? "border-drb-turquoise-500 bg-drb-turquoise-500/10"
                  : "border-gray-200 dark:border-white/10 hover:border-drb-turquoise-500/40 bg-gray-50/50 dark:bg-white/[0.04]"
              }`}
            >
              <Icon
                className={`w-8 h-8 ${
                  selected
                    ? "text-drb-turquoise-500"
                    : "text-gray-400 dark:text-white/40"
                }`}
              />
              <div>
                <div
                  className={`font-semibold text-sm ${
                    selected
                      ? "text-drb-turquoise-600 dark:text-drb-turquoise-400"
                      : "text-gray-700 dark:text-white/80"
                  }`}
                >
                  {t(`model_${key}`)}
                </div>
                <div className="text-xs text-gray-500 dark:text-white/50 mt-1">
                  {t(`model_${key}_desc`)}
                </div>
              </div>
              {selected && (
                <div className="absolute top-2 end-2 w-5 h-5 rounded-full bg-drb-turquoise-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Deposit config — only for deposito_resto */}
      {model === "deposito_resto" && (
        <div className="space-y-4 rounded-xl border border-gray-200 dark:border-white/10 p-5 bg-gray-50/50 dark:bg-white/[0.04]">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {t("depositConfig")}
          </h3>

          {/* Toggle: percentage / fixed */}
          <div>
            <label className="text-sm text-gray-600 dark:text-white/60 mb-2 block">
              {t("depositTypeLabel")}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDepositType("percentage")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  depositType === "percentage"
                    ? "bg-drb-turquoise-500 text-white"
                    : "bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/[0.10]"
                }`}
              >
                {t("percentage")}
              </button>
              <button
                type="button"
                onClick={() => setDepositType("fixed")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  depositType === "fixed"
                    ? "bg-drb-turquoise-500 text-white"
                    : "bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/[0.10]"
                }`}
              >
                {t("fixedPerPerson")}
              </button>
            </div>
          </div>

          {/* Value input */}
          <div>
            <label className="text-sm text-gray-600 dark:text-white/60 mb-2 block">
              {depositType === "percentage" ? t("depositPercent") : t("depositFixed")}
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={depositType === "percentage" ? 100 : 99999}
                value={depositValue}
                onChange={(e) => setDepositValue(Number(e.target.value))}
                className="panel-input w-full pe-12"
              />
              <span className="absolute end-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-white/40">
                {depositType === "percentage" ? "%" : "€"}
              </span>
            </div>
          </div>

          {/* Deadline config */}
          <div>
            <label className="text-sm text-gray-600 dark:text-white/60 mb-2 block">
              {t("deadlineType")}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeadlineType("before_departure")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  deadlineType === "before_departure"
                    ? "bg-drb-turquoise-500 text-white"
                    : "bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/[0.10]"
                }`}
              >
                {t("beforeDeparture")}
              </button>
              <button
                type="button"
                onClick={() => setDeadlineType("after_booking")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  deadlineType === "after_booking"
                    ? "bg-drb-turquoise-500 text-white"
                    : "bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/[0.10]"
                }`}
              >
                {t("afterBooking")}
              </button>
            </div>
          </div>

          {/* Days input */}
          <div>
            <label className="text-sm text-gray-600 dark:text-white/60 mb-2 block">
              {t("deadlineDays")}
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={365}
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(Number(e.target.value))}
                className="panel-input w-full pe-16"
              />
              <span className="absolute end-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-white/40">
                {t("days")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn-primary disabled:opacity-60 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {tc("save")}
        </button>
      </div>
    </section>
  );
}
