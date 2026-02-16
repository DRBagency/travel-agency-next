import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OwnerShell from "@/components/owner/OwnerShell";

interface OwnerLayoutProps {
  children: ReactNode;
}

export default async function OwnerLayout({ children }: OwnerLayoutProps) {
  const cookieStore = await cookies();
  const owner = cookieStore.get("owner")?.value;
  const ownerEmail = cookieStore.get("owner_email")?.value || "";
  const allowedEmail = (process.env.OWNER_EMAIL || "").toLowerCase();

  if (!owner || !allowedEmail || ownerEmail !== allowedEmail) {
    redirect("/owner/login");
  }

  return <OwnerShell>{children}</OwnerShell>;
}
