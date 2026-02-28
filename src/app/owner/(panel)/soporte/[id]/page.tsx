import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import OwnerMessageThread from "./OwnerMessageThread";

export const dynamic = "force-dynamic";

async function addMessage(ticketId: string, formData: FormData) {
  "use server";

  const ownerEmail = (await cookies()).get("owner_email")?.value;
  if (!ownerEmail) return;

  const message = formData.get("message") as string;
  if (!message?.trim()) return;

  const { data: ticket } = await supabaseAdmin
    .from("support_tickets")
    .select("id, status, cliente_id")
    .eq("id", ticketId)
    .single();

  if (!ticket) return;

  await supabaseAdmin.from("ticket_messages").insert({
    ticket_id: ticketId,
    sender_type: "admin",
    message: message.trim(),
  });

  // If ticket was closed, reopen it
  if (ticket.status === "closed") {
    const t = await getTranslations("owner.soporte.detail");

    await supabaseAdmin
      .from("support_tickets")
      .update({ status: "open", closed_at: null })
      .eq("id", ticketId);

    await supabaseAdmin.from("ticket_messages").insert({
      ticket_id: ticketId,
      sender_type: "system",
      message: t("reopenedByOwner"),
    });
  }

  // Set to in_progress if still open (first owner response)
  if (ticket.status === "open") {
    await supabaseAdmin
      .from("support_tickets")
      .update({ status: "in_progress" })
      .eq("id", ticketId);
  }

  // Notify the client
  await supabaseAdmin.from("notifications").insert({
    cliente_id: ticket.cliente_id,
    type: "ticket",
    title: "Respuesta en ticket de soporte",
    message: message.trim().slice(0, 200),
  });

  revalidatePath(`/owner/soporte/${ticketId}`);
}

async function updateTicketStatus(ticketId: string, formData: FormData) {
  "use server";

  const ownerEmail = (await cookies()).get("owner_email")?.value;
  if (!ownerEmail) return;

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
    .eq("id", ticketId);

  const t = await getTranslations("owner.soporte.detail");
  const statusLabel =
    newStatus === "closed" ? t("closedStatus") : t("reopenedStatus");
  await supabaseAdmin.from("ticket_messages").insert({
    ticket_id: ticketId,
    sender_type: "system",
    message: t("statusChangedByOwner", { status: statusLabel }),
  });

  revalidatePath(`/owner/soporte/${ticketId}`);
}

export default async function OwnerTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("owner.soporte.detail");
  const tc = await getTranslations("common");
  const locale = await getLocale();
  const ownerEmail = (await cookies()).get("owner_email")?.value;
  if (!ownerEmail) notFound();

  const { id } = await params;

  const { data: ticket } = await supabaseAdmin
    .from("support_tickets")
    .select("*, clientes(nombre)")
    .eq("id", id)
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
  const agencyName = (ticket.clientes as any)?.nombre || "—";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/owner/soporte"
          className="text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          &larr; {tc("back")}
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {ticket.subject}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-400 dark:text-white/40 text-sm font-mono">
              #{ticket.id.substring(0, 8)}
            </span>
            <span className="text-sm text-gray-500 dark:text-white/50 font-medium">
              {agencyName}
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
            {isClosed ? t("reopenTicket") : t("closeTicket")}
          </button>
        </form>
      </div>

      {/* Description */}
      {ticket.description && (
        <div className="panel-card p-4">
          <p className="text-xs font-medium text-gray-400 dark:text-white/40 mb-1">
            {t("description")}
          </p>
          <p className="text-sm text-gray-700 dark:text-white/70 whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>
      )}

      {/* Chat */}
      <div className="panel-card">
        <OwnerMessageThread
          messages={messages || []}
          ticketStatus={ticket.status}
          addMessageAction={addMessageBound}
        />
      </div>
    </div>
  );
}
