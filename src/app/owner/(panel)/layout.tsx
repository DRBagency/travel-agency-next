import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LayoutGrid, Users, Mail, BarChart3, CreditCard, Zap, LifeBuoy } from "lucide-react";

interface OwnerLayoutProps {
  children: ReactNode;
}

export default async function OwnerLayout({ children }: OwnerLayoutProps) {
  const cookieStore = await cookies();
  const owner = cookieStore.get("owner")?.value;
  const ownerEmail = cookieStore.get("owner_email")?.value || "";
  const allowedEmail = (process.env.OWNER_EMAIL || "").toLowerCase();

  if (!owner || !allowedEmail || ownerEmail !== allowedEmail) {
    redirect("/owner/login");
  }

  const navItems = [
    { label: "Dashboard", href: "/owner", icon: LayoutGrid },
    { label: "Clientes", href: "/owner/clientes", icon: Users },
    { label: "Emails", href: "/owner/emails", icon: Mail },
    { label: "Monetización", href: "/owner/monetizacion", icon: BarChart3 },
    { label: "Stripe", href: "/owner/stripe", icon: CreditCard },
    { label: "Automatización", href: "/owner/automatizaciones", icon: Zap },
    { label: "Soporte", href: "/owner/soporte", icon: LifeBuoy },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-drb-turquoise-950 to-drb-turquoise-900 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-drb-turquoise-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-premium" />
            <div>
              <div className="text-sm text-white/60">Panel Owner</div>
              <div className="font-display text-lg font-semibold">DRB Agency</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">Acceso restringido</span>
            <a
              href="/owner/logout"
              className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-white/70 hover:text-white hover:border-drb-turquoise-400/50 transition-all"
            >
              Cerrar sesión
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside className="space-y-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-all hover:bg-drb-turquoise-500/15 hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </aside>

        <main className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
