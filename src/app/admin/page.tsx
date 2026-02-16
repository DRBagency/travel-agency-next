"use client"

import { useState } from 'react';
import { Globe, Calendar, Star, Mail, FileText, CreditCard, BarChart3, Settings } from 'lucide-react';
import DashboardCard from '@/components/ui/DashboardCard';
import SidePanel from '@/components/ui/SidePanel';

export default function AdminDashboard() {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const dashboardSections = [
    { id: 'contenido', icon: '🌐', title: 'Contenido Web', Component: Globe },
    { id: 'destinos', icon: '✈️', title: 'Destinos', Component: Globe },
    { id: 'reservas', icon: '📅', title: 'Reservas', Component: Calendar },
    { id: 'opiniones', icon: '⭐', title: 'Opiniones', Component: Star },
    { id: 'emails', icon: '✉️', title: 'Emails', Component: Mail },
    { id: 'legales', icon: '📄', title: 'Páginas Legales', Component: FileText },
    { id: 'stripe', icon: '💳', title: 'Stripe', Component: CreditCard },
    { id: 'analytics', icon: '📊', title: 'Analytics', Component: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-turquoise p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">
          Panel de Control
        </h1>
        <p className="text-white/60">
          Gestiona tu agencia de viajes
        </p>
      </div>

      {/* Grid de Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardSections.map((section) => (
          <DashboardCard
            key={section.id}
            icon={section.icon}
            title={section.title}
            onClick={() => setActivePanel(section.id)}
          />
        ))}
      </div>

      {/* Side Panels */}
      {dashboardSections.map((section) => (
        <SidePanel
          key={section.id}
          isOpen={activePanel === section.id}
          onClose={() => setActivePanel(null)}
          title={section.title}
        >
          <div className="text-white/80">
            Contenido de {section.title}...
          </div>
        </SidePanel>
      ))}
    </div>
  );
}
