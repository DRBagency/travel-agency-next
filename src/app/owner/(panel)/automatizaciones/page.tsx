import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import SubmitButton from "@/components/admin/SubmitButton";

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

const TRIGGER_TYPES = [
  { value: "days_before_expiry", label: "Dias antes del vencimiento" },
  { value: "days_inactive", label: "Dias sin actividad" },
  { value: "new_client", label: "Cliente nuevo registrado" },
  { value: "reservation_created", label: "Nueva reserva creada" },
  { value: "subscription_cancelled", label: "Suscripcion cancelada" },
];

const ACTION_TYPES = [
  { value: "send_email", label: "Enviar email" },
  { value: "send_email_series", label: "Serie de emails" },
  { value: "create_task", label: "Crear tarea" },
  { value: "notify_owner", label: "Notificar al owner" },
];

export default async function OwnerAutomatizacionesPage() {
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Automatizaciones</h1>
          <p className="text-gray-500 dark:text-white/60">
            Configura flujos automaticos para tu plataforma
          </p>
        </div>
      </div>

      {/* Create form */}
      <div className="panel-card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Nueva automatizacion</h2>
        <form action={createAutomation} className="grid gap-4">
          <div>
            <label className="panel-label block mb-1">Nombre</label>
            <input
              name="name"
              required
              placeholder="Ej: Recordatorio de pago"
              className="w-full panel-input"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="panel-label block mb-1">Trigger</label>
              <select
                name="trigger_type"
                required
                className="w-full panel-input"
              >
                <option value="">Seleccionar...</option>
                {TRIGGER_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="panel-label block mb-1">
                Valor del trigger
              </label>
              <input
                name="trigger_value"
                placeholder="Ej: 3 (dias)"
                className="w-full panel-input"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="panel-label block mb-1">Accion</label>
              <select
                name="action_type"
                required
                className="w-full panel-input"
              >
                <option value="">Seleccionar...</option>
                {ACTION_TYPES.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="panel-label block mb-1">
                Detalle de la accion
              </label>
              <input
                name="action_value"
                placeholder="Ej: template_recordatorio"
                className="w-full panel-input"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <SubmitButton
              successText="Creada"
              className="px-5 py-3 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold transition-colors"
            >
              Crear automatizacion
            </SubmitButton>
          </div>
        </form>
      </div>

      {/* Automations list */}
      <div className="space-y-4 mb-8">
        {items.length === 0 ? (
          <div className="panel-card p-8 text-center text-gray-400 dark:text-white/40">
            No hay automatizaciones creadas
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
                          : "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300"
                      }`}
                    >
                      {auto.active ? "Activa" : "Inactiva"}
                    </span>
                  </div>
                  <div className="flex gap-6 text-sm flex-wrap">
                    <div>
                      <span className="text-gray-400 dark:text-white/40">Trigger:</span>{" "}
                      <span className="text-gray-700 dark:text-white/80">
                        {TRIGGER_TYPES.find((t) => t.value === auto.trigger_type)?.label || auto.trigger_type}
                        {auto.trigger_config?.value ? ` (${auto.trigger_config.value})` : ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 dark:text-white/40">Accion:</span>{" "}
                      <span className="text-gray-700 dark:text-white/80">
                        {ACTION_TYPES.find((a) => a.value === auto.action_type)?.label || auto.action_type}
                        {auto.action_config?.value ? ` (${auto.action_config.value})` : ""}
                      </span>
                    </div>
                    <div className="text-gray-300 dark:text-white/30 text-xs">
                      Creada: {new Date(auto.created_at).toLocaleDateString("es-ES")}
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
                      {auto.active ? "Desactivar" : "Activar"}
                    </button>
                  </form>
                  <form action={deleteAutomation}>
                    <input type="hidden" name="id" value={auto.id} />
                    <button
                      type="submit"
                      className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      Eliminar
                    </button>
                  </form>
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
            Ultimas ejecuciones
          </h2>
          <p className="text-sm text-gray-400 dark:text-white/40 mt-1">
            Historial de las ultimas 20 ejecuciones
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">Automatizacion</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">Estado</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">Error</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {executions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400 dark:text-white/40">
                    No hay ejecuciones registradas
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
                      {new Date(exec.executed_at).toLocaleString("es-ES")}
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
