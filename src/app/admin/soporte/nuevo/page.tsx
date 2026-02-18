import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import SubmitButton from "@/components/admin/SubmitButton";
import Link from "next/link";
import { getTranslations } from 'next-intl/server';

export const dynamic = "force-dynamic";

async function createTicket(formData: FormData) {
  "use server";

  const clientId = (await cookies()).get("cliente_id")?.value;
  if (!clientId) return;

  const subject = formData.get("subject") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;

  if (!subject?.trim() || !description?.trim()) return;

  const { data: ticket, error } = await supabaseAdmin
    .from("support_tickets")
    .insert({
      cliente_id: clientId,
      subject: subject.trim(),
      description: description.trim(),
      priority: priority || "normal",
      status: "open",
    })
    .select("id")
    .single();

  if (error || !ticket) return;

  await supabaseAdmin.from("ticket_messages").insert({
    ticket_id: ticket.id,
    sender_type: "client",
    message: description.trim(),
  });

  revalidatePath("/admin/soporte");
  redirect(`/admin/soporte/${ticket.id}`);
}

export default async function NuevoTicketPage() {
  await requireAdminClient();
  const t = await getTranslations('admin.soporte.nuevo');
  const tc = await getTranslations('common');

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/soporte"
          className="text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          &larr; {tc('back')}
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-1">{t('title')}</h1>
          <p className="text-gray-500 dark:text-white/60">{t('subtitle')}</p>
        </div>
      </div>

      <div className="panel-card p-6">
        <form action={createTicket} className="grid gap-4">
          <div>
            <label className="panel-label">{t('subjectLabel')}</label>
            <input
              name="subject"
              required
              placeholder={t('subjectPlaceholder')}
              className="panel-input"
            />
          </div>

          <div>
            <label className="panel-label">
              {t('descriptionLabel')}
            </label>
            <textarea
              name="description"
              required
              placeholder={t('descriptionPlaceholder')}
              className="panel-input min-h-[150px]"
            />
          </div>

          <div>
            <label className="panel-label">
              {t('priorityLabel')}
            </label>
            <select
              name="priority"
              defaultValue="normal"
              className="panel-input"
            >
              <option value="normal">{t('priorityNormal')}</option>
              <option value="high">{t('priorityHigh')}</option>
              <option value="urgent">{t('priorityUrgent')}</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <SubmitButton
              successText={t('success')}
              className="btn-primary"
            >
              {t('submit')}
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
