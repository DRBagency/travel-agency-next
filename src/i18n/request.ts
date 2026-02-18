import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const locales = ["es", "en", "ar"] as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

  const locale: Locale = locales.includes(cookieLocale as Locale)
    ? (cookieLocale as Locale)
    : "es";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
