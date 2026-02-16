import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdminClient } from "@/lib/requireAdminClient";

async function updateHeroStats(formData: FormData) {
  "use server";

  const session = (await cookies()).get("admin_session");
  if (!session || session.value !== "ok") return;

  const clientId = formData.get("client_id") as string;

  const payload = {
    hero_title: (formData.get("hero_title") as string) || null,
    hero_subtitle: (formData.get("hero_subtitle") as string) || null,
    hero_cta_text: (formData.get("hero_cta_text") as string) || null,
    hero_cta_link: (formData.get("hero_cta_link") as string) || null,
    hero_image_url: (formData.get("hero_image_url") as string) || null,
    stats_years: (formData.get("stats_years") as string) || null,
    stats_travelers: (formData.get("stats_travelers") as string) || null,
    stats_destinations: (formData.get("stats_destinations") as string) || null,
    stats_rating: (formData.get("stats_rating") as string) || null,
  };

  await supabaseAdmin.from("clientes").update(payload).eq("id", clientId);

  revalidatePath("/");
  revalidatePath("/admin/contenido");
}

interface AdminContentPageProps {
  searchParams: Promise<{
  }>;
}

export default async function AdminContentPage({
  searchParams,
}: AdminContentPageProps) {
  await searchParams;

  const client = await requireAdminClient();

  const brandStyle = client.primary_color
    ? { backgroundColor: client.primary_color }
    : undefined;

  return (
    <AdminShell
      clientName={client.nombre}
      primaryColor={client.primary_color}
      subscriptionActive={Boolean(client.stripe_subscription_id)}
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Contenido · Hero y stats</h1>
          <p className="text-white/60">
            Edita el contenido principal de la web pública. Se refleja al instante.
          </p>
        </div>

        <form action={updateHeroStats} className="space-y-8">
          <input type="hidden" name="client_id" value={client.id} />

          <section className="rounded-2xl border border-white/20 bg-white/10 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Hero</h2>
              <p className="text-sm text-white/60">
                Título, subtítulo, CTA e imagen de portada.
              </p>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Título
                </label>
                <input
                  name="hero_title"
                  defaultValue={client.hero_title ?? ""}
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: Viaja a tu ritmo con una agencia premium"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Subtítulo
                </label>
                <textarea
                  name="hero_subtitle"
                  defaultValue={client.hero_subtitle ?? ""}
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400 min-h-[100px]"
                  placeholder="Describe el valor principal de la agencia"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    CTA · Texto
                  </label>
                  <input
                    name="hero_cta_text"
                    defaultValue={client.hero_cta_text ?? ""}
                    className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                    placeholder="Ej: Reservar ahora"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    CTA · Link
                  </label>
                  <input
                    name="hero_cta_link"
                    defaultValue={client.hero_cta_link ?? ""}
                    className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Imagen del hero (URL)
                </label>
                <input
                  name="hero_image_url"
                  defaultValue={client.hero_image_url ?? ""}
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  placeholder="https://..."
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/20 bg-white/10 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Stats</h2>
              <p className="text-sm text-white/60">
                Métricas que se muestran en Hero y Nosotros.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Años
                </label>
                <input
                  name="stats_years"
                  defaultValue={client.stats_years ?? ""}
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: 15+"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Viajeros
                </label>
                <input
                  name="stats_travelers"
                  defaultValue={client.stats_travelers ?? ""}
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: 10K+"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Destinos
                </label>
                <input
                  name="stats_destinations"
                  defaultValue={client.stats_destinations ?? ""}
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: 50+"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Rating
                </label>
                <input
                  name="stats_rating"
                  defaultValue={client.stats_rating ?? ""}
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: 4.9★"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
