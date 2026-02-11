export const dynamic = "force-dynamic";

export default async function OwnerAutomatizacionesPage() {
  const automations = [
    {
      id: 1,
      name: "Recordatorio de pago",
      description:
        "Envía un email 3 días antes de que venza la suscripción",
      trigger: "3 días antes del vencimiento",
      action: "Enviar email",
      active: true,
    },
    {
      id: 2,
      name: "Cliente inactivo",
      description:
        "Notifica cuando un cliente lleva 30 días sin actividad",
      trigger: "30 días sin login",
      action: "Enviar email + crear tarea",
      active: false,
    },
    {
      id: 3,
      name: "Onboarding automático",
      description:
        "Envía serie de emails de bienvenida a nuevos clientes",
      trigger: "Cliente nuevo registrado",
      action: "Serie de 3 emails",
      active: true,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Automatizaciones</h1>
          <p className="text-white/60">
            Configura flujos automáticos para tu plataforma
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Nueva Automatización
        </button>
      </div>

      <div className="space-y-4">
        {automations.map((auto) => (
          <div
            key={auto.id}
            className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {auto.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      auto.active
                        ? "bg-green-500/20 text-green-300"
                        : "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    {auto.active ? "Activa" : "Inactiva"}
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-3">
                  {auto.description}
                </p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-white/40">Trigger:</span>{" "}
                    <span className="text-white/80">{auto.trigger}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Acción:</span>{" "}
                    <span className="text-white/80">{auto.action}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300">
                  Editar
                </button>
                <button
                  className={`px-3 py-1 text-sm ${
                    auto.active
                      ? "text-red-400 hover:text-red-300"
                      : "text-green-400 hover:text-green-300"
                  }`}
                >
                  {auto.active ? "Desactivar" : "Activar"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
