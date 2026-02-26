"use client";

import { useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import { LandingThemeProvider } from "@/components/landing/LandingThemeProvider";
import { LandingGlobalStyles } from "@/components/landing/LandingGlobalStyles";
import { BgMesh } from "@/components/landing/ui/BgMesh";
import Navbar from "@/components/landing/sections/Navbar";
import Hero from "@/components/landing/sections/Hero";
import Stats from "@/components/landing/sections/Stats";
import DestinationsGrid from "@/components/landing/sections/DestinationsGrid";
import WhyUs from "@/components/landing/sections/WhyUs";
import Testimonials from "@/components/landing/sections/Testimonials";
import CtaBanner from "@/components/landing/sections/CtaBanner";
import ContactForm from "@/components/landing/sections/ContactForm";
import Footer from "@/components/landing/sections/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";
import { makeTr, tr } from "@/lib/translations";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function HomeClient({
  client,
  opiniones,
  paginasLegales,
  allDestinos = [],
  lang = "es",
  legalBasePath = "/legal",
  destinationBasePath = "/destino",
  homeUrl = "/",
  allMessages,
}: {
  client: any;
  opiniones: any[];
  paginasLegales: any[];
  allDestinos?: any[];
  lang?: string;
  legalBasePath?: string;
  destinationBasePath?: string;
  homeUrl?: string;
  allMessages?: Record<string, any>;
}) {
  const [currentLang, setCurrentLang] = useState<string>(lang);
  const preferredLang = client.preferred_language || "es";

  // Translation helpers
  const clientTr = makeTr(client, currentLang, preferredLang);

  // Translate destinos
  const translatedDestinos = allDestinos.map((d: any) => {
    const dTr = makeTr(d, currentLang, preferredLang);
    return {
      ...d,
      nombre: dTr("nombre"),
      descripcion: dTr("descripcion"),
      descripcion_larga: dTr("descripcion_larga"),
      subtitle: dTr("subtitle"),
      tagline: dTr("tagline"),
      badge: dTr("badge"),
      categoria: dTr("categoria"),
      duracion: dTr("duracion"),
    };
  });

  // Translate opiniones
  const translatedOpiniones = opiniones.map((o: any) => ({
    ...o,
    comentario: tr(o, "comentario", currentLang, preferredLang),
  }));

  // Translate whyus_items and map "desc" → "description" for landing component
  const rawWhyUs = clientTr("whyus_items");
  const translatedWhyUsItems = Array.isArray(rawWhyUs)
    ? rawWhyUs.map((item: any) => ({
        icon: item.icon || "",
        title: item.title || "",
        description: item.description || item.desc || "",
      }))
    : rawWhyUs;

  // Track page visit for live visitor counter
  useEffect(() => {
    if (!client?.id) return;
    let sid = sessionStorage.getItem("drb_sid");
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem("drb_sid", sid);
    }
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clienteId: client.id,
        sessionId: sid,
        pagePath: window.location.pathname,
        referrer: document.referrer || null,
      }),
    }).catch(() => {});
  }, [client?.id]);

  // Determine messages for current language
  const currentMessages = allMessages?.[currentLang] || allMessages?.[lang] || undefined;

  // Wrap content in a dynamic NextIntlClientProvider if messages are available
  const LangWrapper = ({ children }: { children: React.ReactNode }) => {
    if (currentMessages) {
      return (
        <NextIntlClientProvider locale={currentLang} messages={currentMessages}>
          {children}
        </NextIntlClientProvider>
      );
    }
    return <>{children}</>;
  };

  return (
    <LandingThemeProvider
      primaryColor={client.primary_color}
      darkModeEnabled={client.dark_mode_enabled ?? true}
    >
      <LandingGlobalStyles />
      <BgMesh />

      <LangWrapper>
      <div className="landing-wrap" style={{ position: "relative", zIndex: 1 }} dir={currentLang === "ar" ? "rtl" : "ltr"}>
        {/* 1. Navbar */}
        <Navbar
          clientName={client.nombre}
          logoUrl={client.logo_url}
          primaryColor={client.primary_color}
          ctaText={clientTr("hero_cta_text")}
          ctaLink={client.hero_cta_link}
          darkModeEnabled={client.dark_mode_enabled ?? true}
          lang={currentLang}
          availableLanguages={
            Array.isArray(client.available_languages) && client.available_languages.length > 0
              ? client.available_languages
              : ["es"]
          }
          onLangChange={(l) => {
            const newLang = l.toLowerCase();
            setCurrentLang(newLang);
            document.cookie = `NEXT_LOCALE_LANDING=${newLang};path=/;max-age=31536000`;
          }}
          homeUrl={homeUrl}
        />

        {/* 2. Hero — split layout */}
        <Hero
          badge={clientTr("hero_badge")}
          title={clientTr("hero_title")}
          subtitle={clientTr("hero_subtitle")}
          description={clientTr("hero_description")}
          imageUrl={client.hero_image_url}
          ctaText={clientTr("hero_cta_text")}
          ctaLink={client.hero_cta_link}
          ctaTextSecondary={clientTr("hero_cta_text_secondary")}
          ctaLinkSecondary={client.hero_cta_link_secondary}
          primaryColor={client.primary_color}
          stats={{
            travelers: client.stats_travelers || "15K+",
            rating: client.stats_rating || "4.9",
          }}
        />

        {/* 3. Stats — 4 cards */}
        <Stats
          travelers={client.stats_travelers || "15K+"}
          destinations={client.stats_destinations || "48"}
          rating={client.stats_rating || "4.9"}
          repeat={client.stats_repeat || "98%"}
        />

        {/* 4. Destinations Grid */}
        <DestinationsGrid destinos={translatedDestinos} destinationBasePath={destinationBasePath} />

        {/* 5. Why Us — 4 cards */}
        <WhyUs items={translatedWhyUsItems} />

        {/* 6. Testimonials */}
        <Testimonials opiniones={translatedOpiniones} />

        {/* 8. CTA Banner */}
        <CtaBanner
          title={clientTr("cta_banner_title")}
          description={clientTr("cta_banner_description")}
          ctaText={clientTr("cta_banner_cta_text")}
          ctaLink={client.cta_banner_cta_link}
        />

        {/* 9. Contact */}
        <ContactForm
          contactEmail={client.contact_email}
          contactPhone={client.contact_phone}
          contactAddress={client.contact_address}
          destinos={allDestinos}
          clienteId={client.id}
        />

        {/* 10. Footer */}
        <Footer
          clientName={client.nombre}
          logoUrl={client.logo_url}
          footerDescription={clientTr("footer_description")}
          destinos={translatedDestinos}
          paginasLegales={paginasLegales}
          legalBasePath={legalBasePath}
          destinationBasePath={destinationBasePath}
          instagramUrl={client.instagram_url}
          facebookUrl={client.facebook_url}
          tiktokUrl={client.tiktok_url}
        />
      </div>
      </LangWrapper>

      {/* Chatbot Widget */}
      <ChatbotWidget
        clienteId={client.id}
        primaryColor={client.primary_color}
      />
    </LandingThemeProvider>
  );
}
