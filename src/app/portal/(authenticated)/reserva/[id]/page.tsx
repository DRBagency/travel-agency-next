import { requireTraveler } from "@/lib/requireTraveler";
import { supabaseAdmin } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import PortalReservaDetail from "@/components/portal/PortalReservaDetail";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PortalReservaPage({ params }: Props) {
  const { id } = await params;
  const { email, clienteId } = await requireTraveler();

  // Fetch reserva and verify it belongs to this traveler
  const { data: reserva, error } = await supabaseAdmin
    .from("reservas")
    .select("*")
    .eq("id", id)
    .eq("email", email)
    .eq("cliente_id", clienteId)
    .single();

  if (error || !reserva) notFound();

  // Fetch destino if available
  let destino: any = null;
  if (reserva.destino_id) {
    const { data } = await supabaseAdmin
      .from("destinos")
      .select("*")
      .eq("id", reserva.destino_id)
      .single();
    destino = data;
  }

  // Fetch coordinador if destino has one
  let coordinador: any = null;
  if (destino?.coordinador_id) {
    const { data } = await supabaseAdmin
      .from("coordinadores")
      .select("*")
      .eq("id", destino.coordinador_id)
      .single();
    coordinador = data;
  }

  // Fetch client for Stripe info
  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("stripe_account_id, stripe_charges_enabled, commission_rate, stripe_subscription_id")
    .eq("id", clienteId)
    .single();

  return (
    <PortalReservaDetail
      reserva={reserva}
      destino={destino}
      coordinador={coordinador}
      stripeEnabled={Boolean(client?.stripe_charges_enabled)}
    />
  );
}
