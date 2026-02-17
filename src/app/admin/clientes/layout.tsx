import { ReactNode } from "react";

interface OwnerLayoutProps {
  children: ReactNode;
}

export default function OwnerLayout({ children }: OwnerLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <header className="border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="text-sm text-gray-500 dark:text-white/70">Panel owner</div>
          <a
            href="/admin/clientes/logout"
            className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-1.5 text-sm text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/30 transition"
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
