import { ReactNode } from "react";

interface OwnerLayoutProps {
  children: ReactNode;
}

export default function OwnerLayout({ children }: OwnerLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-drb-turquoise-800 via-drb-turquoise-700 to-drb-turquoise-600 text-white">
      <header className="border-b border-white/10 bg-gradient-to-b from-drb-turquoise-800 via-drb-turquoise-700 to-drb-turquoise-600/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="text-sm text-white/70">Panel owner</div>
          <a
            href="/admin/clientes/logout"
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:text-white hover:border-white/30 transition"
          >
            Cerrar sesión
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}
