"use client"

import { useState } from 'react';
import { Globe, Calendar, CreditCard, Users, Zap, Infinity } from 'lucide-react';
import DashboardCard from '@/components/ui/DashboardCard';
import SidePanel from '@/components/ui/SidePanel';

export default function OwnerDashboard() {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const dashboardSections = [
    { id: 'web', icon: '🌐', title: 'Web', Component: Globe },
    { id: 'reservas', icon: '📅', title: 'Reservas', Component: Calendar },
    { id: 'pagos', icon: '💳', title: 'Pagos', Component: CreditCard },
    { id: 'clientes', icon: '👥', title: 'Clientes', Component: Users },
    { id: 'automatizacion', icon: '⚡', title: 'Automatización', Component: Zap },
    { id: 'allinone', icon: '∞', title: 'All-in-one', Component: Infinity, gradient: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-turquoise p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <h1 className="text-white/60 text-lg">DRB Agency — Panel</h1>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dashboardSections.map((section) => (
          <DashboardCard
            key={section.id}
            icon={section.icon}
            title={section.title}
            gradient={section.gradient}
            onClick={() => setActivePanel(section.id)}
          />
        ))}
      </div>

      {/* Side Panels dinámicos */}
      {dashboardSections.map((section) => (
        <SidePanel
          key={section.id}
          isOpen={activePanel === section.id}
          onClose={() => setActivePanel(null)}
          title={section.title}
        >
          <div className="space-y-6">
            <p className="text-white/80">
              Contenido de {section.title} aquí...
            </p>
            {/* Aquí irá el contenido específico de cada sección */}
          </div>
        </SidePanel>
      ))}
    </div>
  );
}
