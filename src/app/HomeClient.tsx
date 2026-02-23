"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import DestinationsGrid, {
  Destination,
} from "@/components/DestinationsGrid";
import ImageSlider from "@/components/ImageSlider";
import BookingModal from "@/components/BookingModal";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function HomeClient({
  client,
  opiniones,
  paginasLegales,
}: {
  client: any;
  opiniones: any[];
  paginasLegales: any[];
}) {
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

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

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-800 antialiased">
      <Navbar
        clientName={client.nombre}
        logoUrl={client.logo_url}
        primaryColor={client.primary_color}
        ctaText={client.hero_cta_text}
        ctaLink={client.hero_cta_link}
      />

      <Hero
        title={client.hero_title}
        subtitle={client.hero_subtitle}
        ctaText={client.hero_cta_text}
        ctaLink={client.hero_cta_link}
        imageUrl={client.hero_image_url}
        primaryColor={client.primary_color}
      />

      <StatsBar
        statsYears={client.stats_years}
        statsDestinations={client.stats_destinations}
        statsTravelers={client.stats_travelers}
        statsRating={client.stats_rating}
        primaryColor={client.primary_color}
      />

      <DestinationsGrid
        clienteId={client.id}
        primaryColor={client.primary_color}
        onReserve={setSelectedDestination}
      />

      <ImageSlider
        clienteId={client.id}
        primaryColor={client.primary_color}
      />

      <Testimonials
        primaryColor={client.primary_color}
        opinions={opiniones}
      />

      <About
        primaryColor={client.primary_color}
        title={client.about_title}
        text1={client.about_text_1}
        text2={client.about_text_2}
        statsYears={client.stats_years}
        statsDestinations={client.stats_destinations}
        statsTravelers={client.stats_travelers}
        statsRating={client.stats_rating}
      />

      <Contact
        primaryColor={client.primary_color}
        email={client.contact_email}
        phone={client.contact_phone}
        address={client.contact_address}
        heroImageUrl={client.hero_image_url}
      />

      <Footer
        primaryColor={client.primary_color}
        clientName={client.nombre}
        logoUrl={client.logo_url}
        footerText={client.footer_text}
        instagramUrl={client.instagram_url}
        facebookUrl={client.facebook_url}
        tiktokUrl={client.tiktok_url}
        legalPages={paginasLegales}
        email={client.contact_email}
        phone={client.contact_phone}
        address={client.contact_address}
      />

      <BookingModal
        destination={selectedDestination}
        clienteId={client.id}
        primaryColor={client.primary_color}
        paymentsEnabled={client.stripe_charges_enabled === true}
        subscriptionActive={Boolean(client.stripe_subscription_id)}
        onClose={() => setSelectedDestination(null)}
      />

      <ChatbotWidget
        clienteId={client.id}
        primaryColor={client.primary_color}
      />
    </main>
  );
}
