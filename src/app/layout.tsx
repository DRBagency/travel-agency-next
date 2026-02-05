import "./globals.css";
import { Manrope, Sora } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} ${sora.variable}`}>
        <main className="relative pt-20 min-h-screen bg-slate-950">
          {children}
        </main>
      </body>
    </html>
  );
}
