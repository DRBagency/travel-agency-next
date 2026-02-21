import CalendarioContent from "@/app/admin/calendario/CalendarioContent";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function OwnerCalendarioPage() {
  const t = await getTranslations('owner.calendario');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('title')}</h1>
        <p className="text-gray-400 dark:text-white/40">{t('subtitle')}</p>
      </div>
      <CalendarioContent />
    </div>
  );
}
