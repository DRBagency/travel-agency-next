import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OwnerShell from "@/components/owner/OwnerShell";
import { getDashboardMetrics } from "@/lib/owner/get-dashboard-metrics";

interface OwnerLayoutProps {
  children: ReactNode;
}

export default async function OwnerLayout({ children }: OwnerLayoutProps) {
  const cookieStore = await cookies();
  const owner = cookieStore.get("owner")?.value;
  const ownerEmail = cookieStore.get("owner_email")?.value || "";
  const allowedEmail = (process.env.OWNER_EMAIL || "").toLowerCase();

  if (!owner || !allowedEmail || ownerEmail !== allowedEmail) {
    redirect("/owner/login");
  }

  // Fetch platform metrics for Eden AI context
  const metrics = await getDashboardMetrics();
  const platformContext = [
    `Agencias activas: ${metrics.totalClientes}`,
    `Con suscripción: ${metrics.clientesConSuscripcion}`,
    `MRR: €${metrics.mrr}`,
    `Reservas este mes: ${metrics.reservasMes}`,
    `Comisiones este mes: €${Math.round(metrics.comisionesMes)}`,
    `Ticket medio: €${Math.round(metrics.ticketMedio)}`,
    metrics.planBreakdown
      ? `Desglose planes: ${Object.entries(metrics.planBreakdown)
          .map(([plan, data]: [string, any]) => `${plan}: ${data.count} agencias (€${data.mrr}/mes)`)
          .join(", ")}`
      : "",
    metrics.topDestinos?.length
      ? `Top destinos: ${metrics.topDestinos.map((d: any) => `${d.name} (${d.count})`).join(", ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <OwnerShell ownerEmail={ownerEmail} platformContext={platformContext}>
      {children}
    </OwnerShell>
  );
}
