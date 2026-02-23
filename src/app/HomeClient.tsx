"use client";

import { useState, useEffect } from "react";
import { LandingThemeProvider } from "@/components/landing/LandingThemeProvider";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import { LandingStats } from "@/components/landing/LandingStats";
import { LandingDestinations } from "@/components/landing/LandingDestinations";
import { LandingWhyUs } from "@/components/landing/LandingWhyUs";
import BlogSection from "@/components/BlogSection";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingCTABanner from "@/components/landing/LandingCTABanner";
import LandingContact from "@/components/landing/LandingContact";
import LandingFooter from "@/components/landing/LandingFooter";
import BookingModal from "@/components/BookingModal";
import ChatbotWidget from "@/components/ChatbotWidget";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function HomeClient({
  client,
  opiniones,
  paginasLegales,
  blogPosts = [],
  allDestinos = [],
}: {
  client: any;
  opiniones: any[];
  paginasLegales: any[];
  blogPosts?: any[];
  allDestinos?: any[];
}) {
  const [selectedDestination, setSelectedDestination] = useState<any>(null);

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
      {/* 1. Navbar — fixed, glass-morphism */}
      <LandingNavbar
        clientName={client.nombre}
        logoUrl={client.logo_url}
        primaryColor={client.primary_color}
        ctaText={client.hero_cta_text}
        ctaLink={client.hero_cta_link}
        darkModeEnabled={client.dark_mode_enabled ?? true}
      />

      {/* 2. Hero — full-viewport centered, parallax, glow orbs */}
      <LandingHero
        badge={client.hero_badge}
        title={client.hero_title}
        subtitle={client.hero_subtitle}
        imageUrl={client.hero_image_url}
        ctaText={client.hero_cta_text}
        ctaLink={client.hero_cta_link}
        ctaTextSecondary={client.hero_cta_text_secondary}
        ctaLinkSecondary={client.hero_cta_link_secondary}
        primaryColor={client.primary_color}
      />

      {/* 3. Stats — 4 stat cards */}
      <LandingStats
        statsYears={client.stats_years}
        statsDestinations={client.stats_destinations}
        statsTravelers={client.stats_travelers}
        statsRating={client.stats_rating}
      />

      {/* 4. Destinations Grid — all active destinos */}
      <LandingDestinations destinos={allDestinos} />

      {/* 5. Why Us — 6-card grid */}
      <LandingWhyUs items={client.whyus_items} />

      {/* 6. Blog Section — conditional, kept from G2 */}
      {hasBlog && (
        <BlogSection
          posts={blogPosts}
          primaryColor={client.primary_color}
        />
      )}

      {/* 7. Testimonials — carousel */}
      <LandingTestimonials opiniones={opiniones} />

      {/* 8. CTA Banner */}
      <LandingCTABanner
        title={client.cta_banner_title}
        description={client.cta_banner_description}
        ctaText={client.cta_banner_cta_text}
        ctaLink={client.cta_banner_cta_link}
      />

      {/* 9. Contact — form card */}
      <LandingContact
        contactEmail={client.contact_email}
        contactPhone={client.contact_phone}
        contactAddress={client.contact_address}
        destinos={allDestinos}
        clienteId={client.id}
      />

      {/* 10. Footer — 4-column */}
      <LandingFooter
        clientName={client.nombre}
        logoUrl={client.logo_url}
        footerDescription={client.footer_description}
        destinos={allDestinos}
        paginasLegales={paginasLegales}
        instagramUrl={client.instagram_url}
        facebookUrl={client.facebook_url}
        tiktokUrl={client.tiktok_url}
      />

      {/* Keep: Booking Modal */}
      <BookingModal
        destination={selectedDestination}
        clienteId={client.id}
        primaryColor={client.primary_color}
        paymentsEnabled={client.stripe_charges_enabled === true}
        subscriptionActive={Boolean(client.stripe_subscription_id)}
        onClose={() => setSelectedDestination(null)}
      />

      {/* Keep: Chatbot Widget */}
      <ChatbotWidget
        clienteId={client.id}
        primaryColor={client.primary_color}
      />
    </LandingThemeProvider>
  );
}
