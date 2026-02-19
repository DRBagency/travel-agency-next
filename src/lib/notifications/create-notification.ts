import { supabaseAdmin } from "@/lib/supabase-server";

interface CreateNotificationParams {
  clienteId: string;
  type: string;
  title: string;
  description?: string;
  href?: string;
}

export async function createNotification({
  clienteId,
  type,
  title,
  description,
  href,
}: CreateNotificationParams) {
  return supabaseAdmin.from("notifications").insert({
    cliente_id: clienteId,
    type,
    title,
    description: description || null,
    href: href || null,
    read: false,
  });
}

interface CreateOwnerNotificationParams {
  type: string;
  title: string;
  description?: string;
  href?: string;
}

export async function createOwnerNotification({
  type,
  title,
  description,
  href,
}: CreateOwnerNotificationParams) {
  return supabaseAdmin.from("owner_notifications").insert({
    type,
    title,
    description: description || null,
    href: href || null,
    read: false,
  });
}
