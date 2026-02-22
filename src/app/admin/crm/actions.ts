"use server";

import { supabaseAdmin } from "@/lib/supabase-server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const VALID_STATUSES = [
  "nuevo",
  "interesado",
  "presupuesto",
  "reservado",
  "viajado",
  "inactivo",
];

async function getClienteId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("cliente_id")?.value ?? null;
}

/**
 * Sync customers from reservas + contact_messages into agency_customers.
 * Groups reservas by email, aggregates stats, upserts.
 */
export async function syncCustomers() {
  const clienteId = await getClienteId();
  if (!clienteId) return;

  // 1. Fetch all reservas for this agency
  const { data: reservas } = await supabaseAdmin
    .from("reservas")
    .select("nombre, email, telefono, precio, estado_pago, created_at")
    .eq("cliente_id", clienteId);

  // 2. Fetch contact_messages for this agency
  const { data: contacts } = await supabaseAdmin
    .from("contact_messages")
    .select("sender_name, sender_email, created_at")
    .eq("cliente_id", clienteId);

  // 3. Group reservas by lowercase email
  const emailMap: Record<
    string,
    {
      nombre: string;
      email: string;
      telefono: string | null;
      total_bookings: number;
      total_spent: number;
      first_booking_at: string | null;
      last_booking_at: string | null;
      has_paid: boolean;
      has_pending: boolean;
    }
  > = {};

  for (const r of reservas || []) {
    if (!r.email) continue;
    const key = r.email.toLowerCase();
    if (!emailMap[key]) {
      emailMap[key] = {
        nombre: r.nombre || r.email,
        email: r.email,
        telefono: r.telefono || null,
        total_bookings: 0,
        total_spent: 0,
        first_booking_at: null,
        last_booking_at: null,
        has_paid: false,
        has_pending: false,
      };
    }
    const entry = emailMap[key];
    entry.total_bookings++;
    entry.total_spent += Number(r.precio) || 0;
    if (r.nombre) entry.nombre = r.nombre;
    if (r.telefono) entry.telefono = r.telefono;

    const d = r.created_at;
    if (!entry.first_booking_at || d < entry.first_booking_at) entry.first_booking_at = d;
    if (!entry.last_booking_at || d > entry.last_booking_at) entry.last_booking_at = d;

    if (r.estado_pago === "pagado") entry.has_paid = true;
    if (r.estado_pago === "pendiente") entry.has_pending = true;
  }

  // 4. Add contact-only emails (not in reservas)
  for (const c of contacts || []) {
    if (!c.sender_email) continue;
    const key = c.sender_email.toLowerCase();
    if (!emailMap[key]) {
      emailMap[key] = {
        nombre: c.sender_name || c.sender_email,
        email: c.sender_email,
        telefono: null,
        total_bookings: 0,
        total_spent: 0,
        first_booking_at: null,
        last_booking_at: null,
        has_paid: false,
        has_pending: false,
      };
    }
  }

  // 5. Upsert into agency_customers
  for (const entry of Object.values(emailMap)) {
    // Determine lead_status from booking data
    let lead_status = "nuevo"; // contact-only
    if (entry.has_paid) {
      lead_status = "reservado";
    } else if (entry.has_pending) {
      lead_status = "interesado";
    }

    // Check if already exists
    const { data: existing } = await supabaseAdmin
      .from("agency_customers")
      .select("id, lead_status")
      .eq("cliente_id", clienteId)
      .ilike("email", entry.email)
      .maybeSingle();

    if (existing) {
      // Update stats but preserve manual lead_status unless it was auto-set
      await supabaseAdmin
        .from("agency_customers")
        .update({
          nombre: entry.nombre,
          telefono: entry.telefono || undefined,
          total_bookings: entry.total_bookings,
          total_spent: entry.total_spent,
          first_booking_at: entry.first_booking_at,
          last_booking_at: entry.last_booking_at,
        })
        .eq("id", existing.id);
    } else {
      await supabaseAdmin.from("agency_customers").insert({
        cliente_id: clienteId,
        nombre: entry.nombre,
        email: entry.email,
        telefono: entry.telefono,
        total_bookings: entry.total_bookings,
        total_spent: entry.total_spent,
        first_booking_at: entry.first_booking_at,
        last_booking_at: entry.last_booking_at,
        lead_status,
      });
    }
  }

  revalidatePath("/admin/crm");
}

export async function updateCustomerStatus(
  customerId: string,
  newStatus: string
) {
  if (!VALID_STATUSES.includes(newStatus)) return;
  const clienteId = await getClienteId();
  if (!clienteId) return;

  const { data: customer } = await supabaseAdmin
    .from("agency_customers")
    .select("lead_status, nombre")
    .eq("id", customerId)
    .eq("cliente_id", clienteId)
    .single();

  if (!customer) return;

  const oldStatus = customer.lead_status || "nuevo";
  if (oldStatus === newStatus) return;

  await supabaseAdmin
    .from("agency_customers")
    .update({ lead_status: newStatus })
    .eq("id", customerId);

  await supabaseAdmin.from("agency_customer_activities").insert({
    customer_id: customerId,
    cliente_id: clienteId,
    type: "status_change",
    content: `${customer.nombre}: ${oldStatus} → ${newStatus}`,
    metadata: { old_status: oldStatus, new_status: newStatus },
  });

  revalidatePath("/admin/crm");
  revalidatePath(`/admin/crm/${customerId}`);
}

export async function updateCustomerNotes(customerId: string, notes: string) {
  const clienteId = await getClienteId();
  if (!clienteId) return;

  await supabaseAdmin
    .from("agency_customers")
    .update({ notes })
    .eq("id", customerId)
    .eq("cliente_id", clienteId);

  revalidatePath("/admin/crm");
  revalidatePath(`/admin/crm/${customerId}`);
}

export async function createCustomerActivity(
  customerId: string,
  type: string,
  content: string
) {
  if (!content.trim()) return;
  const clienteId = await getClienteId();
  if (!clienteId) return;

  await supabaseAdmin.from("agency_customer_activities").insert({
    customer_id: customerId,
    cliente_id: clienteId,
    type,
    content: content.trim(),
  });

  revalidatePath("/admin/crm");
  revalidatePath(`/admin/crm/${customerId}`);
}

export async function updateCustomerTags(customerId: string, tags: string[]) {
  const clienteId = await getClienteId();
  if (!clienteId) return;

  await supabaseAdmin
    .from("agency_customers")
    .update({ tags })
    .eq("id", customerId)
    .eq("cliente_id", clienteId);

  revalidatePath("/admin/crm");
  revalidatePath(`/admin/crm/${customerId}`);
}
