import { supabaseAdmin } from "@/lib/supabase-server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdminClient } from "@/lib/requireAdminClient";

/* =====================
   Server Action
===================== */
async function updateEstado(formData: FormData) {
  "use server";

  const session = (await cookies()).get("admin_session");
  if (!session || session.value !== "ok") return;

  const id = formData.get("id") as string;
  const estado = formData.get("estado") as string;

  await supabaseAdmin
    .from("reservas")
    .update({ estado_pago: estado })
    .eq("id", id);

  revalidatePath("/admin");
}

/* =====================
   Page
===================== */
interface AdminPageProps {
  searchParams: Promise<{
    estado?: string;
    q?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const {
    estado = "todos",
    q = "",
    from = "",
    to = "",
  } = await searchParams;

  const client = await requireAdminClient();

  const brandStyle = client.primary_color
    ? { backgroundColor: client.primary_color }
    : undefined;

  const badgeStyle = client.primary_color
    ? {
        borderColor: client.primary_color,
        backgroundColor: `color-mix(in srgb, ${client.primary_color} 15%, transparent)`,
        color: client.primary_color,
      }
    : undefined;

  /* =====================
     Query reservas
  ===================== */
  let query = supabaseAdmin
    .from("reservas")
    .select("*")
    .eq("cliente_id", client.id)
    .order("created_at", { ascending: false });

  if (estado !== "todos") {
    query = query.eq("estado_pago", estado);
  }

  if (q) {
    query = query.or(`nombre.ilike.%${q}%,email.ilike.%${q}%`);
  }

  if (from) {
    query = query.gte("created_at", `${from}T00:00:00.000Z`);
  }

  if (to) {
    query = query.lte("created_at", `${to}T23:59:59.999Z`);
  }

  const { data: reservas, error } = await query;

  if (error) {
    return (
      <div className="p-8">
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  const reservasSafe = reservas ?? [];

  /* =====================
     Métricas (A6)
  ===================== */
  const pagadas = reservasSafe.filter((r) => r.estado_pago === "pagado");
  const totalFacturado = pagadas.reduce(
    (sum, r) => sum + Number(r.precio),
    0
  );
  const numeroReservas = pagadas.length;
  const ticketMedio =
    numeroReservas > 0
      ? Math.round(totalFacturado / numeroReservas)
      : 0;

  const ultimasReservas = reservasSafe.slice(0, 5);

  return (
    <AdminShell clientName={client.nombre} primaryColor={client.primary_color}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            Resumen · {client.nombre}
          </h1>
          <p className="text-white/60">
            Dominio: {client.domain}
          </p>
        </div>

      {/* =====================
         Métricas
      ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-white/10 rounded-2xl bg-white/5">
          <p className="text-sm text-white/60">Total facturado</p>
          <p className="text-2xl font-bold">{totalFacturado} €</p>
        </div>
        <div className="p-4 border border-white/10 rounded-2xl bg-white/5">
          <p className="text-sm text-white/60">Reservas pagadas</p>
          <p className="text-2xl font-bold">{numeroReservas}</p>
        </div>
        <div className="p-4 border border-white/10 rounded-2xl bg-white/5">
          <p className="text-sm text-white/60">Ticket medio</p>
          <p className="text-2xl font-bold">{ticketMedio} €</p>
        </div>
      </div>

      {/* =====================
         Filtros (A8 + A9)
      ===================== */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h2 className="text-xl font-semibold">Últimas reservas</h2>
        {ultimasReservas.length === 0 ? (
          <p className="text-white/70">No hay reservas recientes.</p>
        ) : (
          <div className="space-y-3">
            {ultimasReservas.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3"
              >
                <div>
                  <div className="font-semibold">{r.nombre}</div>
                  <div className="text-sm text-white/50">
                    {r.destino} · {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="px-2.5 py-1 text-xs font-semibold rounded-full border"
                    style={badgeStyle}
                  >
                    {r.estado_pago}
                  </span>
                  <a
                    href={`/admin/reserva/${r.id}`}
                    className="text-sm underline text-white/70 hover:text-white"
                  >
                    Ver detalle
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form method="get" className="flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar nombre o email"
          className="border border-white/10 bg-slate-900 text-white px-3 py-2 rounded-xl"
        />

        <select
          name="estado"
          defaultValue={estado}
          className="border border-white/10 px-3 py-2 rounded-xl bg-slate-900 text-white"
        >
          <option value="todos">Todos</option>
          <option value="pagado">Pagado</option>
          <option value="pendiente">Pendiente</option>
          <option value="revisada">Revisada</option>
          <option value="cancelada">Cancelada</option>
        </select>

        <input
          type="date"
          name="from"
          defaultValue={from}
          className="border border-white/10 px-3 py-2 rounded-xl bg-slate-900 text-white"
        />

        <input
          type="date"
          name="to"
          defaultValue={to}
          className="border border-white/10 px-3 py-2 rounded-xl bg-slate-900 text-white"
        />

        <button
          className={
            client.primary_color
              ? "px-4 py-2 text-white rounded-xl font-semibold"
              : "px-4 py-2 bg-white text-slate-950 rounded-xl font-semibold"
          }
          style={brandStyle}
        >
          Filtrar
        </button>

        <a
          href={`/api/admin/export?estado=${estado}&q=${q}&from=${from}&to=${to}`}
          className={
            client.primary_color
              ? "ml-auto px-4 py-2 text-white rounded-xl font-semibold"
              : "ml-auto px-4 py-2 bg-white text-slate-950 rounded-xl font-semibold"
          }
          style={brandStyle}
        >
          Exportar CSV
        </a>
      </form>

      {/* =====================
         Tabla (A10 enlace)
      ===================== */}
      <div className="flex justify-end">
        <a
          href={`/admin/reservas`}
          className={
            client.primary_color
              ? "px-5 py-2 rounded-xl text-white font-semibold"
              : "px-5 py-2 rounded-xl bg-white text-slate-950 font-semibold"
          }
          style={brandStyle}
        >
          Ir a reservas
        </a>
      </div>
      </div>
    </AdminShell>
  );
}
