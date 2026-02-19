import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendBillingEmail } from "@/lib/emails/send-billing-email";
import { createOwnerNotification } from "@/lib/notifications/create-notification";

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

// ============================================================================
// HELPER: MAPEO DE PRICE_ID A PLAN NAME
// ============================================================================

function getPlanNameFromPriceId(priceId: string): string | null {
  const priceMap: Record<string, string> = {
    [process.env.STRIPE_PRICE_START || ""]: "Start",
    [process.env.STRIPE_PRICE_GROW || ""]: "Grow",
    [process.env.STRIPE_PRICE_PRO || ""]: "Pro",
  };

  return priceMap[priceId] || null;
}

const COMMISSION_BY_PLAN: Record<string, string> = {
  Start: "5%",
  Grow: "3%",
  Pro: "1%",
};

// ============================================================================
// HELPER: OBTENER CLIENTE DESDE SUPABASE
// ============================================================================

async function getClienteByStripeCustomerId(
  stripeCustomerId: string
): Promise<any | null> {
  const { data } = await supabaseAdmin
    .from("clientes")
    .select("id, nombre, email, domain, plan")
    .eq("stripe_customer_id", stripeCustomerId)
    .single();

  return data || null;
}

// ============================================================================
// MAIN WEBHOOK HANDLER
// ============================================================================

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_BILLING_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error("❌ [Billing Webhook] Missing signature or webhook secret");
    return new Response("Webhook Error: Missing signature or secret", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("❌ [Billing Webhook] Signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log(`🔔 [Billing Webhook] Event received: ${event.type}`);

  try {
    // ========================================================================
    // EVENT 1: customer.subscription.created
    // ========================================================================
    if (event.type === "customer.subscription.created") {
      const subscription = event.data.object as Stripe.Subscription;

      console.log(
        `📧 [Billing Webhook] Processing subscription.created for customer: ${subscription.customer}`
      );

      // Obtener cliente desde DB
      const cliente = await getClienteByStripeCustomerId(
        subscription.customer as string
      );

      if (!cliente) {
        console.warn(
          `⚠️ [Billing Webhook] Cliente not found for stripe_customer_id: ${subscription.customer}`
        );
        return new Response("OK", { status: 200 });
      }

      // Guardar stripe_subscription_id en la DB
      const { error: updateError } = await supabaseAdmin
        .from("clientes")
        .update({ stripe_subscription_id: subscription.id })
        .eq("id", cliente.id);

      if (updateError) {
        console.error(`❌ [Billing Webhook] Failed to save stripe_subscription_id:`, updateError);
      } else {
        console.log(`✅ [Billing Webhook] Saved stripe_subscription_id: ${subscription.id} for cliente: ${cliente.id}`);
      }

      // Obtener precio y plan
      const priceId = subscription.items.data[0]?.price.id;
      const unitAmount = subscription.items.data[0]?.price.unit_amount;
      const planName = priceId ? getPlanNameFromPriceId(priceId) : null;

      if (!planName) {
        console.warn(
          `⚠️ [Billing Webhook] Could not map price_id ${priceId} to plan name`
        );
      }

      // Formatear precio
      const price = unitAmount
        ? `$${(unitAmount / 100).toFixed(2)}`
        : undefined;

      // URL del admin panel
      const adminUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin`;

      // Enviar email de bienvenida
      const result = await sendBillingEmail({
        tipo: "bienvenida",
        toEmail: cliente.email,
        toName: cliente.nombre,
        data: {
          clientName: cliente.nombre,
          planName: planName || "Plan Premium",
          price,
          billingPeriod: "mensual",
          adminUrl,
        },
      });

      if (result.success) {
        console.log(
          `✅ [Billing Webhook] Welcome email sent to ${cliente.email} (ID: ${result.emailId})`
        );
      } else {
        console.error(
          `❌ [Billing Webhook] Failed to send welcome email: ${result.error}`
        );
      }

      // Notificar al owner
      await createOwnerNotification({
        type: "nuevo_cliente",
        title: `Nueva agencia: ${cliente.nombre}`,
        description: `Plan ${planName || "Premium"} - ${cliente.email}`,
        href: `/owner/clientes`,
      });
    }

    // ========================================================================
    // EVENT 2: customer.subscription.updated
    // ========================================================================
    else if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const previousAttributes = event.data
        .previous_attributes as Stripe.Subscription;

      console.log(
        `📧 [Billing Webhook] Processing subscription.updated for customer: ${subscription.customer}`
      );

      // Detectar si cambió el plan (price_id)
      const currentPriceId = subscription.items.data[0]?.price.id;
      const previousPriceId = previousAttributes?.items?.data?.[0]?.price.id;

      // Solo enviar email si realmente cambió el plan
      if (!previousPriceId || currentPriceId === previousPriceId) {
        console.log(
          "ℹ️ [Billing Webhook] No plan change detected, skipping email"
        );
        return new Response("OK", { status: 200 });
      }

      // Obtener cliente desde DB
      const cliente = await getClienteByStripeCustomerId(
        subscription.customer as string
      );

      if (!cliente) {
        console.warn(
          `⚠️ [Billing Webhook] Cliente not found for stripe_customer_id: ${subscription.customer}`
        );
        return new Response("OK", { status: 200 });
      }

      // Mapear planes
      const oldPlanName = getPlanNameFromPriceId(previousPriceId) || "Plan Anterior";
      const newPlanName = getPlanNameFromPriceId(currentPriceId) || "Plan Nuevo";

      // Obtener nuevo precio
      const newUnitAmount = subscription.items.data[0]?.price.unit_amount;
      const newPrice = newUnitAmount
        ? `${(newUnitAmount / 100).toFixed(2)} €`
        : undefined;

      // Obtener nueva tarifa/comisión
      const newCommission = COMMISSION_BY_PLAN[newPlanName] || undefined;

      // URL del admin panel
      const adminUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin`;

      // Enviar email de cambio de plan
      const result = await sendBillingEmail({
        tipo: "cambio_plan",
        toEmail: cliente.email,
        toName: cliente.nombre,
        data: {
          clientName: cliente.nombre,
          oldPlan: oldPlanName,
          newPlan: newPlanName,
          oldPlanName,
          newPlanName,
          newPrice,
          newCommission,
          billingPeriod: "mensual",
          changeDate: new Date().toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          adminUrl,
        },
      });

      if (result.success) {
        console.log(
          `✅ [Billing Webhook] Plan change email sent to ${cliente.email} (ID: ${result.emailId})`
        );
      } else {
        console.error(
          `❌ [Billing Webhook] Failed to send plan change email: ${result.error}`
        );
      }
    }

    // ========================================================================
    // EVENT 3: customer.subscription.deleted
    // ========================================================================
    else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      console.log(
        `📧 [Billing Webhook] Processing subscription.deleted for customer: ${subscription.customer}`
      );

      // Obtener cliente desde DB
      const cliente = await getClienteByStripeCustomerId(
        subscription.customer as string
      );

      if (!cliente) {
        console.warn(
          `⚠️ [Billing Webhook] Cliente not found for stripe_customer_id: ${subscription.customer}`
        );
        return new Response("OK", { status: 200 });
      }

      // Limpiar stripe_subscription_id en la DB
      const { error: clearError } = await supabaseAdmin
        .from("clientes")
        .update({ stripe_subscription_id: null, subscription_cancel_at: null })
        .eq("id", cliente.id);

      if (clearError) {
        console.error(`❌ [Billing Webhook] Failed to clear subscription fields:`, clearError);
      } else {
        console.log(`✅ [Billing Webhook] Cleared stripe_subscription_id and subscription_cancel_at for cliente: ${cliente.id}`);
      }

      // Obtener plan cancelado
      const priceId = subscription.items.data[0]?.price.id;
      const planName = priceId
        ? getPlanNameFromPriceId(priceId)
        : cliente.plan || "Plan Premium";

      // Fecha de fin (current_period_end o canceled_at)
      const endTimestamp =
        (subscription as any).current_period_end || (subscription as any).canceled_at;
      const endDate = endTimestamp
        ? new Date(endTimestamp * 1000).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : undefined;

      // Enviar email de cancelación
      const result = await sendBillingEmail({
        tipo: "cancelacion",
        toEmail: cliente.email,
        toName: cliente.nombre,
        data: {
          clientName: cliente.nombre,
          planName: planName || "Plan Premium",
          cancellationDate: new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          endDate,
        },
      });

      if (result.success) {
        console.log(
          `✅ [Billing Webhook] Cancellation email sent to ${cliente.email} (ID: ${result.emailId})`
        );
      } else {
        console.error(
          `❌ [Billing Webhook] Failed to send cancellation email: ${result.error}`
        );
      }
    }

    // Otros eventos no manejados
    else {
      console.log(
        `ℹ️ [Billing Webhook] Unhandled event type: ${event.type}`
      );
    }

    return new Response("OK", { status: 200 });
  } catch (error: any) {
    console.error("❌ [Billing Webhook] Error processing event:", error);
    // Siempre retornar 200 para evitar reintentos de Stripe
    return new Response("OK", { status: 200 });
  }
}
