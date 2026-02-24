import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { getTranslations } from "next-intl/server";
import DestinoEditor from "./DestinoEditor";

export const dynamic = "force-dynamic";

export default async function DestinoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await requireAdminClient();

  const { data: destino, error } = await supabaseAdmin
    .from("destinos")
    .select("*")
    .eq("id", id)
    .eq("cliente_id", client.id)
    .single();

  if (error || !destino) {
    notFound();
  }

  const t = await getTranslations("admin.destinos");

  return (
    <div className="animate-fade-in">
      <DestinoEditor
        destino={destino}
        plan={client.plan ?? undefined}
        preferredLanguage={client.preferred_language || "es"}
        availableLanguages={
          Array.isArray(client.available_languages) && client.available_languages.length > 0
            ? client.available_languages
            : ["es"]
        }
      />
    </div>
  );
}
