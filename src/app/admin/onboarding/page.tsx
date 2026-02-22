import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import OnboardingWizard from "@/components/admin/OnboardingWizard";

async function updateOnboardingData(data: {
  plan?: string;
  domain?: string;
  onboarding_step?: number;
  onboarding_completed?: boolean;
}) {
  "use server";

  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;
  if (!clienteId) return;

  const payload: Record<string, unknown> = {};
  if (data.plan !== undefined) payload.plan = data.plan;
  if (data.domain !== undefined) payload.domain = data.domain;
  if (data.onboarding_step !== undefined) payload.onboarding_step = data.onboarding_step;
  if (data.onboarding_completed !== undefined) payload.onboarding_completed = data.onboarding_completed;

  if (Object.keys(payload).length === 0) return;

  await supabaseAdmin.from("clientes").update(payload).eq("id", clienteId);
  revalidatePath("/admin/onboarding");
  revalidatePath("/admin");
}

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;

  if (!clienteId) {
    redirect("/admin/login");
  }

  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select(
      "id, nombre, email, contact_email, contact_phone, contact_address, primary_color, plan, domain, hero_title, hero_subtitle, hero_cta_text, about_title, about_text_1, onboarding_completed, onboarding_step"
    )
    .eq("id", clienteId)
    .single();

  if (!client) {
    redirect("/admin/login");
  }

  if (client.onboarding_completed === true) {
    redirect("/admin");
  }

  return <OnboardingWizard client={client} updateOnboardingData={updateOnboardingData} />;
}
