"use server";

import { supabaseAdmin } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

const VALID_STATUSES = ["lead", "contactado", "demo", "activo", "en_riesgo", "perdido"];

export async function updateLeadStatus(clientId: string, newStatus: string) {
  if (!VALID_STATUSES.includes(newStatus)) return;

  const { data: cliente } = await supabaseAdmin
    .from("clientes")
    .select("lead_status, nombre")
    .eq("id", clientId)
    .single();

  if (!cliente) return;

  const oldStatus = cliente.lead_status || "lead";
  if (oldStatus === newStatus) return;

  await supabaseAdmin
    .from("clientes")
    .update({ lead_status: newStatus })
    .eq("id", clientId);

  await supabaseAdmin.from("client_activities").insert({
    client_id: clientId,
    type: "status_change",
    content: `${cliente.nombre}: ${oldStatus} → ${newStatus}`,
    metadata: { old_status: oldStatus, new_status: newStatus },
  });

  revalidatePath("/owner/crm");
  revalidatePath(`/owner/clientes/${clientId}`);
}

export async function updateClientNotes(clientId: string, notes: string) {
  await supabaseAdmin
    .from("clientes")
    .update({ client_notes: notes })
    .eq("id", clientId);

  revalidatePath("/owner/crm");
  revalidatePath(`/owner/clientes/${clientId}`);
}

export async function createActivity(clientId: string, type: string, content: string) {
  if (!content.trim()) return;

  await supabaseAdmin.from("client_activities").insert({
    client_id: clientId,
    type,
    content: content.trim(),
  });

  revalidatePath("/owner/crm");
  revalidatePath(`/owner/clientes/${clientId}`);
}
