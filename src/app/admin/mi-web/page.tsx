import { requireAdminClient } from "@/lib/requireAdminClient";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getLocale } from "next-intl/server";
import MiWebContent from "./MiWebContent";

export const dynamic = "force-dynamic";

export default async function MiWebPage() {
  const client = await requireAdminClient();
  const locale = await getLocale();

  // Fetch counts + full data for opiniones and legales
  const [destinosRes, opinionesRes, legalesRes] = await Promise.all([
    supabaseAdmin
      .from("destinos")
      .select("id", { count: "exact", head: true })
      .eq("cliente_id", client.id)
      .eq("activo", true),
    supabaseAdmin
      .from("opiniones")
      .select("*")
      .eq("cliente_id", client.id)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("paginas_legales")
      .select("*")
      .eq("cliente_id", client.id)
      .order("created_at", { ascending: false }),
  ]);

  const opiniones = opinionesRes.data ?? [];
  const legales = legalesRes.data ?? [];

  const counts = {
    destinos: destinosRes.count ?? 0,
    opiniones: opiniones.length,
    legales: legales.length,
  };

  return (
    <MiWebContent
      plan={client.plan}
      client={{
        id: client.id,
        nombre: client.nombre,
        slug: client.slug,
        domain: client.domain,
        domain_verified: client.domain_verified,
        logo_url: client.logo_url,
        primary_color: client.primary_color,
        hero_title: client.hero_title,
        hero_subtitle: client.hero_subtitle,
        hero_cta_text: client.hero_cta_text,
        hero_cta_link: client.hero_cta_link,
        hero_image_url: client.hero_image_url,
        hero_badge: client.hero_badge,
        hero_description: client.hero_description,
        hero_cta_text_secondary: client.hero_cta_text_secondary,
        hero_cta_link_secondary: client.hero_cta_link_secondary,
        stats_years: client.stats_years,
        stats_destinations: client.stats_destinations,
        stats_travelers: client.stats_travelers,
        stats_rating: client.stats_rating,
        stats_repeat: client.stats_repeat,
        whyus_items: client.whyus_items,
        cta_banner_title: client.cta_banner_title,
        cta_banner_description: client.cta_banner_description,
        cta_banner_cta_text: client.cta_banner_cta_text,
        cta_banner_cta_link: client.cta_banner_cta_link,
        about_title: client.about_title,
        about_text_1: client.about_text_1,
        about_text_2: client.about_text_2,
        contact_email: client.contact_email,
        contact_phone: client.contact_phone,
        contact_address: client.contact_address,
        instagram_url: client.instagram_url,
        facebook_url: client.facebook_url,
        tiktok_url: client.tiktok_url,
        footer_text: client.footer_text,
        footer_description: client.footer_description,
        dark_mode_enabled: client.dark_mode_enabled,
        meta_title: client.meta_title,
        meta_description: client.meta_description,
        preferred_language: client.preferred_language,
        available_languages: client.available_languages,
      }}
      counts={counts}
      opiniones={opiniones}
      legales={legales}
      locale={locale}
    />
  );
}
