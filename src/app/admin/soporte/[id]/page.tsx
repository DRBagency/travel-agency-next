import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import MessageThread from "./MessageThread";

export const dynamic = "force-dynamic";

async function addMessage(ticketId: string, formData: FormData) {
  "use server";

  const clientId = (await cookies()).get("cliente_id")?.value;
  if (!clientId) return;

  const message = formData.get("message") as string;
  if (!message?.trim()) return;

  // Check ticket belongs to client
  const { data: ticket } = await supabaseAdmin
    .from("support_tickets")
    .select("id, status")
    .eq("id", ticketId)
    .eq("cliente_id", clientId)
    .single();

  if (!ticket) return;

  await supabaseAdmin.from("ticket_messages").insert({
    ticket_id: ticketId,
    sender_type: "client",
    message: message.trim(),
  });

  // Reopen if closed
  if (ticket.status === "closed") {
    const t = await getTranslations('admin.soporte.detail');

    await supabaseAdmin
      .from("support_tickets")
      .update({ status: "open", closed_at: null })
      .eq("id", ticketId);

    await supabaseAdmin.from("ticket_messages").insert({
      ticket_id: ticketId,
      sender_type: "system",
      message: t('reopenedByClient'),
    });
  }

  revalidatePath(`/admin/soporte/${ticketId}`);
}

async function updateTicketStatus(ticketId: string, formData: FormData) {
  "use server";

  const clientId = (await cookies()).get("cliente_id")?.value;
  if (!clientId) return;

  const newStatus = formData.get("status") as string;
  if (!newStatus) return;

  const updateData: Record<string, unknown> = { status: newStatus };
  if (newStatus === "closed") {
    updateData.closed_at = new Date().toISOString();
  } else {
    updateData.closed_at = null;
  }

  await supabaseAdmin
    .from("support_tickets")
    .update(updateData)
    .eq("id", ticketId)
    .eq("cliente_id", clientId);

  const t = await getTranslations('admin.soporte.detail');
  const statusLabel = newStatus === "closed" ? t('closedStatus') : t('reopenedStatus');
  await supabaseAdmin.from("ticket_messages").insert({
    ticket_id: ticketId,
    sender_type: "system",
    message: t('statusChangedByClient', { status: statusLabel }),
  });

  revalidatePath(`/admin/soporte/${ticketId}`);
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations('admin.soporte.detail');
  const tc = await getTranslations('common');
  const locale = await getLocale();
  const client = await requireAdminClient();
  const { id } = await params;

  const { data: ticket } = await supabaseAdmin
    .from("support_tickets")
    .select("*")
    .eq("id", id)
    .eq("cliente_id", client.id)
    .single();

  if (!ticket) notFound();

  const { data: messages } = await supabaseAdmin
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  const addMessageBound = addMessage.bind(null, id);
  const updateStatusBound = updateTicketStatus.bind(null, id);

  const isClosed = ticket.status === "closed";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/soporte"
          className="text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          &larr; {tc('back')}
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{ticket.subject}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-400 dark:text-white/40 text-sm font-mono">
              #{ticket.id.substring(0, 8)}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                ticket.status === "open"
                  ? "badge-success"
                  : ticket.status === "in_progress"
                    ? "badge-warning"
                    : "bg-gray-100 dark:bg-white/15 text-gray-500 dark:text-white/60 border border-gray-200 dark:border-white/20"
              }`}
            >
              {ticket.status}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                ticket.priority === "urgent"
                  ? "badge-danger"
                  : ticket.priority === "high"
                    ? "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30"
                    : "badge-info"
              }`}
            >
              {ticket.priority}
            </span>
            <span className="text-gray-400 dark:text-white/40 text-sm">
              {new Date(ticket.created_at).toLocaleDateString(locale)}
            </span>
          </div>
        </div>

        <form action={updateStatusBound}>
          <input
            type="hidden"
            name="status"
            value={isClosed ? "open" : "closed"}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              isClosed
                ? "bg-green-100 dark:bg-green-600/20 text-emerald-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-600/30 border border-green-200 dark:border-green-500/30"
                : "bg-red-100 dark:bg-red-600/20 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-600/30 border border-red-200 dark:border-red-500/30"
            }`}
          >
            {isClosed ? t('reopenTicket') : t('closeTicket')}
          </button>
        </form>
      </div>

      {/* Chat */}
      <div className="panel-card">
        <MessageThread
          messages={messages || []}
          ticketStatus={ticket.status}
          addMessageAction={addMessageBound}
        />
      </div>
    </div>
  );
}
