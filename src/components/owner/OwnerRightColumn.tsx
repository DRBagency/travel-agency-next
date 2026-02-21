"use client";

import { useTranslations } from "next-intl";
import MountainBackground from "../admin/MountainBackground";
import OwnerChat from "./OwnerChat";

interface OwnerRightColumnProps {
  ownerEmail: string;
  platformContext: string;
}

export default function OwnerRightColumn({
  ownerEmail,
  platformContext,
}: OwnerRightColumnProps) {
  const t = useTranslations("owner.eden");

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Mountain landscape background */}
      <MountainBackground />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Profile card — glassmorphism */}
        <div className="relative mx-3 mt-3 rounded-2xl bg-white/25 backdrop-blur-lg border border-white/30 shadow-lg p-4">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full overflow-hidden mb-2.5 ring-2 ring-white/40 shadow-lg bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600 flex items-center justify-center text-white font-bold text-xl">
              D
            </div>

            {/* Name and email */}
            <h3 className="text-sm font-semibold text-white truncate max-w-full">
              DRB Agency
            </h3>
            {ownerEmail && (
              <p className="text-[11px] text-white/50 truncate max-w-full mt-0.5">
                {ownerEmail}
              </p>
            )}

            {/* Badge */}
            <span className="mt-2.5 inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 shadow-sm">
              {t("platformOwner")}
            </span>
          </div>
        </div>

        {/* Eden Chat card — glassmorphism, fills remaining space */}
        <div className="flex-1 min-h-0 flex flex-col mx-3 mt-2.5 mb-3 rounded-2xl bg-white/25 backdrop-blur-lg border border-white/30 shadow-lg overflow-hidden">
          <OwnerChat ownerEmail={ownerEmail} platformContext={platformContext} />
        </div>
      </div>
    </div>
  );
}
