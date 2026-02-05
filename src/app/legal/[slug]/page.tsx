import { notFound } from "next/navigation";
import { getClientByDomain } from "@/lib/getClientByDomain";
import { supabaseAdmin } from "@/lib/supabase-server";

export default async function LegalPage({
  params,
}: {
  params: { slug: string };
}) {
  const client = await getClientByDomain();

  if (!client) return notFound();

  const { data } = await supabaseAdmin
    .from("paginas_legales")
    .select("*")
    .eq("cliente_id", client.id)
    .eq("slug", params.slug)
    .eq("activo", true)
    .single();

  if (!data) return notFound();

  const title = data?.titulo ?? data?.title ?? params.slug;
  const content = data?.contenido ?? data?.content ?? "";

  return (
    <section className="min-h-screen bg-slate-950 py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto glass-card p-8 rounded-3xl border border-white/10">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-6 text-white">
            {title}
          </h1>
          {content && (
            <div
              className="prose prose-invert max-w-none text-white/80"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
