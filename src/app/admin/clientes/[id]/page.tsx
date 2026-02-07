import { redirect } from "next/navigation";

interface ClientePageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientePage({ params }: ClientePageProps) {
  const { id } = await params;
  redirect(`/owner/clientes/${id}`);
}
