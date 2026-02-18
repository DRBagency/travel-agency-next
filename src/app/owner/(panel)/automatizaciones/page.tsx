import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import SubmitButton from "@/components/admin/SubmitButton";
import DeleteWithConfirm from "@/components/ui/DeleteWithConfirm";
import { getTranslations, getLocale } from 'next-intl/server';

export const dynamic = "force-dynamic";

async function createAutomation(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const triggerType = formData.get("trigger_type") as string;
  const triggerValue = formData.get("trigger_value") as string;
  const actionType = formData.get("action_type") as string;
  const actionValue = formData.get("action_value") as string;

  if (!name?.trim() || !triggerType || !actionType) return;

  await supabaseAdmin.from("automations").insert({
    name: name.trim(),
    trigger_type: triggerType,
    trigger_config: { value: triggerValue || "" },
    action_type: actionType,
    action_config: { value: actionValue || "" },
    active: true,
  });

  revalidatePath("/owner/automatizaciones");
}

async function toggleAutomation(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const active = formData.get("active") === "true";

  await supabaseAdmin
    .from("automations")
    .update({ active: !active })
    .eq("id", id);

  revalidatePath("/owner/automatizaciones");
}

async function deleteAutomation(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  if (!id) return;

  await supabaseAdmin.from("automations").delete().eq("id", id);
  revalidatePath("/owner/automatizaciones");
}

export default async function OwnerAutomatizacionesPage() {
  const t = await getTranslations('owner.automatizaciones');
  const tc = await getTranslations('common');
  const locale = await getLocale();

  const TRIGGER_TYPES = [
    { value: "days_before_expiry", label: t('triggerDaysBeforeExpiry') },
    { value: "days_inactive", label: t('triggerDaysInactive') },
    { value: "new_client", label: t('triggerNewClient') },
    { value: "reservation_created", label: t('triggerReservationCreated') },
    { value: "subscription_cancelled", label: t('triggerSubscriptionCancelled') },
  ];

  const ACTION_TYPES = [
    { value: "send_email", label: t('actionSendEmail') },
    { value: "send_email_series", label: t('actionSendEmailSeries') },
    { value: "create_task", label: t('actionCreateTask') },
    { value: "notify_owner", label: t('actionNotifyOwner') },
  ];
  const { data: automations } = await supabaseAdmin
    .from("automations")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: recentExecutions } = await supabaseAdmin
    .from("automation_executions")
    .select("*, automations(name)")
    .order("executed_at", { ascending: false })
    .limit(20);

  const items = automations || [];
  const executions = recentExecutions || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('title')}</h1>
          <p className="text-gray-400 dark:text-white/40">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Create form */}
      <div className="panel-card p-6">
        <h2 className="text-xl font-semibold mb-4">{t('newAutomation')}</h2>
        <form action={createAutomation} className="grid gap-4">
          <div>
            <label className="panel-label block mb-1">{tc('name')}</label>
            <input
              name="name"
              required
              placeholder={t('namePlaceholder')}
              className="w-full panel-input"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="panel-label block mb-1">{t('trigger')}</label>
              <select
                name="trigger_type"
                required
                className="w-full panel-input"
              >
                <option value="">{tc('select')}</option>
                {TRIGGER_TYPES.map((tr) => (
                  <option key={tr.value} value={tr.value}>{tr.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="panel-label block mb-1">
                {t('triggerValue')}
              </label>
              <input
                name="trigger_value"
                placeholder={t('triggerValuePlaceholder')}
                className="w-full panel-input"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="panel-label block mb-1">{t('action')}</label>
              <select
                name="action_type"
                required
                className="w-full panel-input"
              >
                <option value="">{tc('select')}</option>
                {ACTION_TYPES.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="panel-label block mb-1">
                {t('actionDetail')}
              </label>
              <input
                name="action_value"
                placeholder={t('actionDetailPlaceholder')}
                className="w-full panel-input"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <SubmitButton
              successText={tc('created')}
              className="btn-primary"
            >
              {t('createAutomation')}
            </SubmitButton>
          </div>
        </form>
      </div>

      {/* Automations list */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="panel-card p-8 text-center text-gray-400 dark:text-white/40">
            {t('noAutomations')}
          </div>
        ) : (
          items.map((auto) => (
            <div
              key={auto.id}
              className="kpi-card"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {auto.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        auto.active
                          ? "badge-success"
                          : "bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-white/60"
                      }`}
                    >
                      {auto.active ? tc('active') : tc('inactive')}
                    </span>
                  </div>
                  <div className="flex gap-6 text-sm flex-wrap">
                    <div>
                      <span className="text-gray-400 dark:text-white/40">{t('trigger')}:</span>{" "}
                      <span className="text-gray-700 dark:text-white/80">
                        {TRIGGER_TYPES.find((tr) => tr.value === auto.trigger_type)?.label || auto.trigger_type}
                        {auto.trigger_config?.value ? ` (${auto.trigger_config.value})` : ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 dark:text-white/40">{t('action')}:</span>{" "}
                      <span className="text-gray-700 dark:text-white/80">
                        {ACTION_TYPES.find((a) => a.value === auto.action_type)?.label || auto.action_type}
                        {auto.action_config?.value ? ` (${auto.action_config.value})` : ""}
                      </span>
                    </div>
                    <div className="text-gray-300 dark:text-white/30 text-xs">
                      {tc('created')}: {new Date(auto.created_at).toLocaleDateString(locale)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <form action={toggleAutomation}>
                    <input type="hidden" name="id" value={auto.id} />
                    <input type="hidden" name="active" value={String(auto.active)} />
                    <button
                      type="submit"
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        auto.active
                          ? "text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10"
                          : "text-emerald-600 dark:text-green-400 hover:text-emerald-500 dark:hover:text-green-300 hover:bg-emerald-50 dark:hover:bg-green-500/10"
                      }`}
                    >
                      {auto.active ? tc('deactivate') : tc('activate')}
                    </button>
                  </form>
                  <DeleteWithConfirm
                    action={deleteAutomation}
                    hiddenFields={{ id: auto.id }}
                    title={tc('confirmDelete')}
                    description={tc('confirmDeleteDesc')}
                    confirmLabel={tc('delete')}
                    cancelLabel={tc('cancel')}
                    trigger={
                      <button type="button" className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                        {tc('delete')}
                      </button>
                    }
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Execution logs */}
      <div className="panel-card">
        <div className="p-6 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('recentExecutions')}
          </h2>
          <p className="text-sm text-gray-400 dark:text-white/40 mt-1">
            {t('executionsHistory')}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="text-start p-4 text-sm font-medium text-gray-500 dark:text-white/60">{t('automation')}</th>
                <th className="text-start p-4 text-sm font-medium text-gray-500 dark:text-white/60">{tc('status')}</th>
                <th className="text-start p-4 text-sm font-medium text-gray-500 dark:text-white/60">{tc('error')}</th>
                <th className="text-start p-4 text-sm font-medium text-gray-500 dark:text-white/60">{tc('date')}</th>
              </tr>
            </thead>
            <tbody>
              {executions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400 dark:text-white/40">
                    {t('noExecutions')}
                  </td>
                </tr>
              ) : (
                executions.map((exec) => (
                  <tr key={exec.id} className="table-row">
                    <td className="p-4 text-gray-900 dark:text-white">
                      {(exec.automations as unknown as { name: string })?.name || "—"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          exec.status === "success"
                            ? "badge-success"
                            : exec.status === "error"
                              ? "badge-danger"
                              : "badge-warning"
                        }`}
                      >
                        {exec.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 dark:text-white/40 text-sm max-w-[200px] truncate">
                      {exec.error_message || "—"}
                    </td>
                    <td className="p-4 text-gray-500 dark:text-white/60 text-sm">
                      {new Date(exec.executed_at).toLocaleString(locale)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
