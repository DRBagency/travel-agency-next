"use client";

import { useState, useEffect } from "react";
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
import BlogSection from "@/components/BlogSection";
import ChatbotWidget from "@/components/ChatbotWidget";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function HomeClient({
  client,
  opiniones,
  paginasLegales,
  blogPosts = [],
  allDestinos = [],
  lang = "es",
}: {
  client: any;
  opiniones: any[];
  paginasLegales: any[];
  blogPosts?: any[];
  allDestinos?: any[];
  lang?: string;
}) {
  const [currentLang, setCurrentLang] = useState<"es" | "en">(
    lang === "en" ? "en" : "es"
  );

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

  const hasBlog = blogPosts.length > 0;

  return (
    <LandingThemeProvider
      primaryColor={client.primary_color}
      darkModeEnabled={client.dark_mode_enabled ?? true}
    >
      <LandingGlobalStyles />
      <BgMesh />

      <div className="landing-wrap" style={{ position: "relative", zIndex: 1 }}>
        {/* 1. Navbar */}
        <Navbar
          clientName={client.nombre}
          logoUrl={client.logo_url}
          primaryColor={client.primary_color}
          ctaText={client.hero_cta_text}
          ctaLink={client.hero_cta_link}
          darkModeEnabled={client.dark_mode_enabled ?? true}
          lang={currentLang}
          onLangChange={(l) => setCurrentLang(l.toLowerCase() === "en" ? "en" : "es")}
        />

        {/* 2. Hero — split layout */}
        <Hero
          badge={client.hero_badge}
          title={client.hero_title}
          subtitle={client.hero_subtitle}
          description={client.hero_description}
          imageUrl={client.hero_image_url}
          ctaText={client.hero_cta_text}
          ctaLink={client.hero_cta_link}
          ctaTextSecondary={client.hero_cta_text_secondary}
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
        <DestinationsGrid destinos={allDestinos} />

        {/* 5. Why Us — 4 cards */}
        <WhyUs items={client.whyus_items} />

        {/* 6. Blog Section — conditional */}
        {hasBlog && (
          <BlogSection
            posts={blogPosts}
            primaryColor={client.primary_color}
          />
        )}

        {/* 7. Testimonials */}
        <Testimonials opiniones={opiniones} />

        {/* 8. CTA Banner */}
        <CtaBanner
          title={client.cta_banner_title}
          description={client.cta_banner_description}
          ctaText={client.cta_banner_cta_text}
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
          footerDescription={client.footer_description}
          destinos={allDestinos}
          paginasLegales={paginasLegales}
          instagramUrl={client.instagram_url}
          facebookUrl={client.facebook_url}
          tiktokUrl={client.tiktok_url}
        />
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget
        clienteId={client.id}
        primaryColor={client.primary_color}
      />
    </LandingThemeProvider>
  );
}
