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
import SectionDivider from "@/components/landing/SectionDivider";
import ScrollReveal from "@/components/landing/ScrollReveal";

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

  // Initialize Lenis smooth scroll
  useEffect(() => {
    let lenis: any;
    let raf: number;

    const init = async () => {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });

      function animate(time: number) {
        lenis.raf(time);
        raf = requestAnimationFrame(animate);
      }
      raf = requestAnimationFrame(animate);
    };

    init();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Noise texture overlay */}
      <div className="noise-overlay" />

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

      <ScrollReveal>
        <DestinationsGrid
          clienteId={client.id}
          primaryColor={client.primary_color}
          onReserve={setSelectedDestination}
        />
      </ScrollReveal>

      <SectionDivider topColor="#f8fafc" bottomColor="#0f172a" variant="wave" />

      <ImageSlider
        clienteId={client.id}
        primaryColor={client.primary_color}
      />

      <SectionDivider topColor="#0f172a" bottomColor="#ffffff" variant="curve" />

      <ScrollReveal>
        <Testimonials
          primaryColor={client.primary_color}
          opinions={opiniones}
        />
      </ScrollReveal>

      <SectionDivider topColor="#ffffff" bottomColor="#f8fafc" variant="tilt" />

      <ScrollReveal>
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
      </ScrollReveal>

      <ScrollReveal>
        <Contact
          primaryColor={client.primary_color}
          email={client.contact_email}
          phone={client.contact_phone}
          address={client.contact_address}
          heroImageUrl={client.hero_image_url}
        />
      </ScrollReveal>

      <SectionDivider topColor="#f8fafc" bottomColor="#0f172a" variant="wave" />

      <ScrollReveal>
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
      </ScrollReveal>

      <BookingModal
        destination={selectedDestination}
        clienteId={client.id}
        primaryColor={client.primary_color}
        paymentsEnabled={client.stripe_charges_enabled === true}
        subscriptionActive={Boolean(client.stripe_subscription_id)}
        onClose={() => setSelectedDestination(null)}
      />
    </main>
  );
}
