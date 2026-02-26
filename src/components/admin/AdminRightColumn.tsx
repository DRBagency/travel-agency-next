"use client";

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
  clienteId,
  agencyContext,
  plan,
}: AdminRightColumnProps) {
  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Mountain landscape background — fills entire column */}
      <MountainBackground />

      {/* Content layer on top of landscape */}
      <div className="relative z-10 flex flex-col h-full">
        {/* ── Eden Chat card — glassmorphism, fills entire space ── */}
        <div className="flex-1 min-h-0 flex flex-col mx-3 mt-3 mb-3 rounded-2xl bg-white/25 backdrop-blur-lg border border-white/30 shadow-lg overflow-hidden">
          <EdenChat clienteId={clienteId || ""} agencyContext={agencyContext} plan={plan} />
        </div>
      </div>
    </div>
  );
}
