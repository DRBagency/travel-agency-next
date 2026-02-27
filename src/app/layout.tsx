import "./globals.css";
import { Manrope, Playfair_Display, Noto_Sans_Arabic, Syne, DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "sileo";
import "sileo/styles.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["300", "400", "500", "700"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={`${manrope.variable} ${playfair.variable} ${notoArabic.variable} ${syne.variable} ${dmSans.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            {children}
            <Toaster
              position="top-center"
              offset={20}
              options={{
                duration: 2500,
                roundness: 18,
              }}
            />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
