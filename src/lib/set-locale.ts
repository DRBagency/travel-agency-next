"use server";

import { cookies } from "next/headers";

const validLocales = ["es", "en", "ar"];

export async function setLocale(locale: string) {
  if (!validLocales.includes(locale)) return;

  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}
