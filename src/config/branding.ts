export const branding = {
  name: process.env.NEXT_PUBLIC_CLIENT_NAME || "Travel Agency",
  tagline:
    process.env.NEXT_PUBLIC_CLIENT_TAGLINE ||
    "Tu próxima aventura comienza aquí",

  hero: {
    title: process.env.NEXT_PUBLIC_HERO_TITLE || "Viaja sin límites",
    highlight:
      process.env.NEXT_PUBLIC_HERO_HIGHLIGHT || "reserva al instante",
    subtitle:
      process.env.NEXT_PUBLIC_HERO_SUBTITLE ||
      "Descubre destinos increíbles y reserva online",
  },

  primaryGradient:
    process.env.NEXT_PUBLIC_PRIMARY_COLOR ||
    "from-primary to-teal",
};