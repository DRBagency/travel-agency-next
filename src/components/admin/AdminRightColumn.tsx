"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Camera, Loader2, X, User, Mail, Phone } from "lucide-react";
import { sileo } from "sileo";
import NotificationBell from "@/components/ui/NotificationBell";
import MountainBackground from "./MountainBackground";
import EdenChat from "./EdenChat";

interface AdminRightColumnProps {
  clientName: string;
  clientEmail?: string;
  clienteId?: string;
  logoUrl?: string | null;
  profilePhoto?: string | null;
  primaryColor?: string | null;
  contactPhone?: string | null;
  agencyContext: string;
  plan?: string;
}

export default function AdminRightColumn({
  clientName,
  clientEmail,
  clienteId,
  logoUrl,
  profilePhoto,
  primaryColor,
  contactPhone,
  agencyContext,
}: AdminRightColumnProps) {
  const t = useTranslations("admin.eden");
  const tc = useTranslations("common");
  const router = useRouter();

  // Profile photo state
  const [avatarUrl, setAvatarUrl] = useState(profilePhoto || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit profile modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(clientName);
  const [editEmail, setEditEmail] = useState(clientEmail || "");
  const [editPhone, setEditPhone] = useState(contactPhone || "");
  const [saving, setSaving] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !clienteId) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload-avatar", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.url) {
        setAvatarUrl(json.url);
        sileo.success({ title: t("photoUpdated") });
      } else {
        sileo.error({ title: json.error || "Upload failed" });
      }
    } catch {
      sileo.error({ title: "Upload failed" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async () => {
    if (!clienteId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/mi-web/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_email: editEmail,
          contact_phone: editPhone,
        }),
      });
      if (res.ok) {
        sileo.success({ title: t("profileSaved") });
        setEditOpen(false);
        router.refresh();
      } else {
        sileo.error({ title: "Error" });
      }
    } catch {
      sileo.error({ title: "Error" });
    } finally {
      setSaving(false);
    }
  };

  const avatarDisplay = avatarUrl || profilePhoto;

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Mountain landscape background — fills entire column */}
      <MountainBackground />

      {/* Content layer on top of landscape */}
      <div className="relative z-10 flex flex-col h-full">
        {/* ── Profile card — glassmorphism ── */}
        <div className="mx-3 mt-3 rounded-2xl bg-white/70 dark:bg-drb-turquoise-900/60 backdrop-blur-md border border-white/50 dark:border-white/[0.08] shadow-card p-4">
          {/* Notification bell */}
          <div className="absolute top-4 end-4 z-20">
            <NotificationBell clienteId={clienteId} />
          </div>

          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={uploading}
              className="group relative w-16 h-16 rounded-full overflow-hidden mb-2.5 ring-2 ring-white/70 dark:ring-drb-turquoise-400/30 shadow-md transition-all hover:ring-drb-turquoise-400 hover:shadow-lg"
            >
              {avatarDisplay ? (
                <img
                  src={avatarDisplay}
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
                {uploading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </button>

            {/* Name and email */}
            <h3 className="text-sm font-semibold text-drb-turquoise-800 dark:text-white truncate max-w-full">
              {clientName}
            </h3>
            {clientEmail && (
              <p className="text-[11px] text-drb-turquoise-600/60 dark:text-white/40 truncate max-w-full mt-0.5">
                {clientEmail}
              </p>
            )}

            {/* Edit profile button */}
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="mt-2.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-white/60 dark:bg-drb-turquoise-500/15 backdrop-blur-sm border border-drb-turquoise-200/50 dark:border-drb-turquoise-500/20 text-drb-turquoise-600 dark:text-drb-turquoise-300 hover:bg-drb-turquoise-50 dark:hover:bg-drb-turquoise-500/25 hover:border-drb-turquoise-400/50 transition-all shadow-sm"
            >
              {t("editProfile")}
            </button>
          </div>
        </div>

        {/* ── Eden Chat card — glassmorphism, fills remaining space ── */}
        <div className="flex-1 min-h-0 flex flex-col mx-3 mt-2.5 mb-3 rounded-2xl bg-white/60 dark:bg-drb-turquoise-900/50 backdrop-blur-md border border-white/50 dark:border-white/[0.06] shadow-card overflow-hidden">
          <EdenChat clienteId={clienteId || ""} agencyContext={agencyContext} />
        </div>
      </div>

      {/* ===== Edit Profile Modal ===== */}
      {editOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditOpen(false)}
          />
          <div className="relative bg-white dark:bg-[#041820] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-sm mx-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/10">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {t("editProfile")}
              </h3>
              <button
                onClick={() => setEditOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-white/50" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              {/* Avatar in modal */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={uploading}
                  className="group relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-drb-turquoise-200 dark:ring-drb-turquoise-500/30 hover:ring-drb-turquoise-400 transition-all"
                >
                  {avatarDisplay ? (
                    <img
                      src={avatarDisplay}
                      alt={clientName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
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
                    {uploading ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </button>
              </div>

              {/* Name (read-only) */}
              <div>
                <label className="panel-label flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {tc("name")}
                </label>
                <input
                  value={editName}
                  readOnly
                  className="panel-input w-full text-sm opacity-60 cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div>
                <label className="panel-label flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {tc("email")}
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="panel-input w-full text-sm"
                  placeholder="email@agency.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="panel-label flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  {t("phone")}
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="panel-input w-full text-sm"
                  placeholder="+34 600 000 000"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 p-4 border-t border-gray-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
              >
                {tc("cancel")}
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {tc("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
