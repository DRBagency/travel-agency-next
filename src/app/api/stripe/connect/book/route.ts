import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireValidApiDomain } from "@/lib/requireValidApiDomain";
import { getClientByDomain } from "@/lib/getClientByDomain";

export async function POST(req: Request) {
  try {
    await requireValidApiDomain();
  } catch {
    return NextResponse.json({}, { status: 403 });
  }

  try {
    const body = await req.json();

    let cliente;
    try {
      cliente = await getClientByDomain();
    } catch {
      // Fallback to clienteId from body (preview/staging)
      if (body.cliente_id) {
        const { data } = await supabaseAdmin
          .from("clientes")
          .select("*")
          .eq("id", body.cliente_id)
          .single();
        cliente = data;
      }
    }

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    const total = Number(body.total);
    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json(
        { error: "Precio inválido" },
        { status: 400 }
      );
    }

    const { data: reserva, error: reservaError } = await supabaseAdmin
      .from("reservas")
      .insert({
        cliente_id: body.cliente_id || cliente.id,
        destino: body.destino_nombre,
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono || null,
        fecha_salida: body.fecha_salida,
        fecha_regreso: body.fecha_regreso || null,
        personas: Number(body.personas),
        precio: total,
        estado_pago: "pendiente_confirmacion",
        passengers: body.passengers || [],
        adults: Number(body.adults) || 0,
        children: Number(body.children) || 0,
        booking_details: body.booking_details || {},
        booking_model: "solo_reserva",
        deposit_amount: 0,
        remaining_amount: total,
      })
      .select("id")
      .single();

    if (reservaError || !reserva) {
      console.error("Supabase insert error:", reservaError);
      return NextResponse.json(
        { error: "Error creando reserva" },
        { status: 500 }
      );
    }

    // Create notification for agency
    await supabaseAdmin.from("notifications").insert({
      cliente_id: body.cliente_id || cliente.id,
      tipo: "nueva_reserva",
      titulo: `Nueva solicitud de reserva: ${body.destino_nombre}`,
      mensaje: `${body.nombre} ha solicitado reservar ${body.destino_nombre}. Pendiente de confirmación.`,
      leida: false,
    });

    return NextResponse.json({ success: true, reservaId: reserva.id });
  } catch (error: any) {
    console.error("Book error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
