import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdminClient } from "@/lib/requireAdminClient";

async function updateAboutContact(formData: FormData) {
  "use server";

  const session = (await cookies()).get("admin_session");
  if (!session || session.value !== "ok") return;

  const clientId = formData.get("client_id") as string;

  const payload = {
    about_title: (formData.get("about_title") as string) || null,
    about_text_1: (formData.get("about_text_1") as string) || null,
    about_text_2: (formData.get("about_text_2") as string) || null,
    contact_email: (formData.get("contact_email") as string) || null,
    contact_phone: (formData.get("contact_phone") as string) || null,
    contact_address: (formData.get("contact_address") as string) || null,
  };

  await supabaseAdmin.from("clientes").update(payload).eq("id", clientId);

  revalidatePath("/");
  revalidatePath("/admin/nosotros-contacto");
}

interface AdminAboutContactPageProps {
  searchParams: Promise<{
  }>;
}

export default async function AdminAboutContactPage({
  searchParams,
}: AdminAboutContactPageProps) {
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
          <h1 className="text-3xl font-bold mb-1">Nosotros + Contacto</h1>
          <p className="text-white/60">
            Edita los textos de “Nosotros” y los datos de contacto.
          </p>
        </div>

        <form action={updateAboutContact} className="space-y-8">
          <input type="hidden" name="client_id" value={client.id} />

          <section className="rounded-2xl border border-white/20 bg-white/10 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Nosotros</h2>
              <p className="text-sm text-white/60">
                Texto principal y descripción de la agencia.
              </p>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Título
                </label>
                <input
                  name="about_title"
                  defaultValue={client.about_title ?? ""}
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  placeholder="Ej: Tu agencia de viajes de confianza"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Texto 1
                </label>
                <textarea
                  name="about_text_1"
                  defaultValue={client.about_text_1 ?? ""}
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400 min-h-[110px]"
                  placeholder="Describe la experiencia y propuesta de valor"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Texto 2
                </label>
                <textarea
                  name="about_text_2"
                  defaultValue={client.about_text_2 ?? ""}
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400 min-h-[110px]"
                  placeholder="Añade confianza, proceso, equipo o garantías"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/20 bg-white/10 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Contacto</h2>
              <p className="text-sm text-white/60">
                Estos datos se muestran en la sección de contacto.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Email
                </label>
                <input
                  name="contact_email"
                  defaultValue={client.contact_email ?? ""}
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  placeholder="contacto@agencia.com"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">
                  Teléfono
                </label>
                <input
                  name="contact_phone"
                  defaultValue={client.contact_phone ?? ""}
                  className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  placeholder="+34 900 000 000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">
                Dirección
              </label>
              <textarea
                name="contact_address"
                defaultValue={client.contact_address ?? ""}
                className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-gray-900 placeholder:text-gray-400 min-h-[110px]"
                placeholder="Calle, ciudad, país"
              />
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
