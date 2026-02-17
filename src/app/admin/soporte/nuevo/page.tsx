import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import SubmitButton from "@/components/admin/SubmitButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function createTicket(formData: FormData) {
  "use server";

  const clientId = (await cookies()).get("cliente_id")?.value;
  if (!clientId) return;

  const subject = formData.get("subject") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;

  if (!subject?.trim() || !description?.trim()) return;

  const { data: ticket, error } = await supabaseAdmin
    .from("support_tickets")
    .insert({
      cliente_id: clientId,
      subject: subject.trim(),
      description: description.trim(),
      priority: priority || "normal",
      status: "open",
    })
    .select("id")
    .single();

  if (error || !ticket) return;

  await supabaseAdmin.from("ticket_messages").insert({
    ticket_id: ticket.id,
    sender_type: "client",
    message: description.trim(),
  });

  revalidatePath("/admin/soporte");
  redirect(`/admin/soporte/${ticket.id}`);
}

export default async function NuevoTicketPage() {
  await requireAdminClient();

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/soporte"
          className="text-white/60 hover:text-white transition-colors"
        >
          &larr; Volver
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-1">Nuevo Ticket</h1>
          <p className="text-white/60">Describe tu problema o consulta</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
        <form action={createTicket} className="grid gap-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Asunto</label>
            <input
              name="subject"
              required
              placeholder="Resumen breve del problema"
              className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">
              Descripcion
            </label>
            <textarea
              name="description"
              required
              placeholder="Describe tu problema con el mayor detalle posible..."
              className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 min-h-[150px]"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">
              Prioridad
            </label>
            <select
              name="priority"
              defaultValue="normal"
              className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900"
            >
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <SubmitButton
              successText="Ticket creado"
              className="px-5 py-3 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold transition-colors"
            >
              Crear Ticket
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
