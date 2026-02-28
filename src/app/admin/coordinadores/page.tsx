import { getTranslations } from "next-intl/server";
import CoordinadoresContent from "./CoordinadoresContent";

export default async function CoordinadoresPage() {
  const t = await getTranslations("admin.coordinadores");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {t("title")}
        </h1>
        <p className="text-gray-400 dark:text-white/40">{t("subtitle")}</p>
      </div>
      <CoordinadoresContent />
    </div>
  );
}
