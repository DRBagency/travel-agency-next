"use client";

import { useState, useEffect } from "react";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DestinationsBento from "@/components/DestinationsBento";
import EditorialText from "@/components/EditorialText";
import DestinationsFiltered from "@/components/DestinationsFiltered";
import FullWidthBreak from "@/components/FullWidthBreak";
import BlogSection from "@/components/BlogSection";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function HomeClient({
  client,
  opiniones,
  paginasLegales,
  blogPosts = [],
  featuredDestinos = [],
}: {
  client: any;
  opiniones: any[];
  paginasLegales: any[];
  blogPosts?: any[];
  featuredDestinos?: any[];
}) {
  const [selectedDestination, setSelectedDestination] = useState<any>(null);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

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
    <main className="relative min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* 1. Navbar */}
      <Navbar
        clientName={client.nombre}
        logoUrl={client.logo_url}
        primaryColor={client.primary_color}
        ctaText={client.hero_cta_text}
        ctaLink={client.hero_cta_link}
        hasBlog={hasBlog}
      />

      {/* 2. Hero — left-aligned, stats at bottom */}
      <Hero
        title={client.hero_title}
        subtitle={client.hero_subtitle}
        ctaText={client.hero_cta_text}
        ctaLink={client.hero_cta_link}
        imageUrl={client.hero_image_url}
        primaryColor={client.primary_color}
        statsYears={client.stats_years}
        statsDestinations={client.stats_destinations}
        statsTravelers={client.stats_travelers}
        statsRating={client.stats_rating}
      />

      {/* 3. Destinations Bento — featured only */}
      <DestinationsBento
        destinations={featuredDestinos}
        primaryColor={client.primary_color}
        onReserve={setSelectedDestination}
      />

      {/* 4. Editorial Text */}
      <EditorialText text={client.editorial_text} />

      {/* 5. Destinations Filtered — category tabs + card grid */}
      <DestinationsFiltered
        clienteId={client.id}
        primaryColor={client.primary_color}
        onReserve={setSelectedDestination}
      />

      {/* 6. Full Width Break */}
      <FullWidthBreak
        imageUrl={client.break_image_url || client.hero_image_url}
        destinations={featuredDestinos}
        primaryColor={client.primary_color}
      />

      {/* 7. Blog Section — conditional */}
      <BlogSection
        posts={blogPosts}
        primaryColor={client.primary_color}
      />

      {/* 8. Testimonials */}
      <Testimonials
        primaryColor={client.primary_color}
        opinions={opiniones}
      />

      {/* 9. About */}
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

      {/* 10. Contact */}
      <Contact
        primaryColor={client.primary_color}
        email={client.contact_email}
        phone={client.contact_phone}
        address={client.contact_address}
        heroImageUrl={client.hero_image_url}
      />

      {/* 11. Footer — 4-column with newsletter */}
      <Footer
        primaryColor={client.primary_color}
        clientName={client.nombre}
        clienteId={client.id}
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
