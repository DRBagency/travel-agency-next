"use client";

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
      {/* Eden Chat card — glass over DashboardBackground */}
      <div className="flex-1 min-h-0 flex flex-col mx-3 mt-3 mb-3 rounded-2xl panel-card overflow-hidden">
        <EdenChat clienteId={clienteId || ""} agencyContext={agencyContext} plan={plan} />
      </div>
    </div>
  );
}
