"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DestinationsGrid, {
  Destination,
} from "@/components/DestinationsGrid";
import BookingModal from "@/components/BookingModal";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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

  return (
    <>
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
        statsYears={client.stats_years}
        statsDestinations={client.stats_destinations}
        statsTravelers={client.stats_travelers}
        statsRating={client.stats_rating}
      />

      <DestinationsGrid
        clienteId={client.id}
        primaryColor={client.primary_color}
        onReserve={setSelectedDestination}
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
      />

      <BookingModal
        destination={selectedDestination}
        clienteId={client.id}
        primaryColor={client.primary_color}
        paymentsEnabled={client.stripe_charges_enabled === true}
        subscriptionActive={Boolean(client.stripe_subscription_id)}
        onClose={() => setSelectedDestination(null)}
      />
    </>
  );
}
