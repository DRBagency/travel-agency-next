"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Bell, Settings } from "lucide-react";
import Link from "next/link";
import NotificationBell from "@/components/ui/NotificationBell";
import EdenChat from "./EdenChat";

interface AdminRightColumnProps {
  clientName: string;
  clientEmail?: string;
  clienteId?: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  agencyContext: string;
  plan?: string;
}

export default function AdminRightColumn({
  clientName,
  clientEmail,
  clienteId,
  logoUrl,
  primaryColor,
  agencyContext,
  plan,
}: AdminRightColumnProps) {
  const t = useTranslations("admin.eden");
  const tc = useTranslations("common");
  const [avatarUrl, setAvatarUrl] = useState(logoUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !clienteId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("clienteId", clienteId);

    try {
      const res = await fetch("/api/admin/upload-avatar", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.url) {
        setAvatarUrl(json.url);
      }
    } catch {
      // Silent fail — avatar upload is non-critical
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#041820] border-s border-gray-200/80 dark:border-white/[0.06]">
      {/* Profile section */}
      <div className="relative px-4 pt-5 pb-4 border-b border-gray-100 dark:border-white/[0.06]">
        {/* Notification bell top-right */}
        <div className="absolute top-3 end-3">
          <NotificationBell clienteId={clienteId} />
        </div>

        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <button
            type="button"
            onClick={handleAvatarClick}
            className="group relative w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-drb-turquoise-200 dark:ring-drb-turquoise-500/30 transition-all hover:ring-drb-turquoise-400"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={clientName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white font-bold text-xl"
                style={{
                  background: primaryColor
                    ? `linear-gradient(135deg, ${primaryColor}, #1CABB0)`
                    : "linear-gradient(135deg, #1CABB0, #178991)",
                }}
              >
                {clientName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <Settings className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </button>

          {/* Name and agency */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-full">
            {clientName}
          </h3>
          {clientEmail && (
            <p className="text-xs text-gray-400 dark:text-white/40 truncate max-w-full mt-0.5">
              {clientEmail}
            </p>
          )}

          {/* Edit profile button */}
          <Link
            href="/admin/mi-web"
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-drb-turquoise-50 dark:bg-drb-turquoise-500/10 text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:bg-drb-turquoise-100 dark:hover:bg-drb-turquoise-500/20 transition-colors"
          >
            {t("editProfile")}
          </Link>
        </div>
      </div>

      {/* Eden Chat — fills remaining space */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <EdenChat clienteId={clienteId || ""} agencyContext={agencyContext} />
      </div>
    </div>
  );
}
