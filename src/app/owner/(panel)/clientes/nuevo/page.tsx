import { createCliente } from "./actions";
import { getTranslations } from 'next-intl/server';

export default async function NuevoClientePage() {
  const t = await getTranslations('owner.clientes');
  const tf = await getTranslations('owner.clientes.form');
  const tc = await getTranslations('common');

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('newAgency')}</h1>

      <form action={createCliente} className="space-y-4 max-w-2xl">
        <div>
          <label className="panel-label block mb-1">{tc('name')}</label>
          <input name="nombre" className="w-full panel-input" required />
        </div>
        <div>
          <label className="panel-label block mb-1">Slug</label>
          <input name="slug" className="w-full panel-input" required />
        </div>
        <div>
          <label className="panel-label block mb-1">{t('domain')}</label>
          <input name="domain" className="w-full panel-input" required />
        </div>
        <div>
          <label className="panel-label block mb-1">{tf('primaryColor')}</label>
          <input name="primary_color" className="w-full panel-input" />
        </div>
        <div>
          <label className="panel-label block mb-1">{tf('heroTitle')}</label>
          <input name="hero_title" className="w-full panel-input" />
        </div>
        <div>
          <label className="panel-label block mb-1">{tf('heroSubtitle')}</label>
          <textarea name="hero_subtitle" className="w-full panel-input" />
        </div>
        <div>
          <label className="panel-label block mb-1">{tf('heroCta')}</label>
          <input name="hero_cta_text" className="w-full panel-input" />
        </div>

        <button type="submit" className="btn-primary">
          {t('createAgency')}
        </button>
      </form>
    </div>
  );
}
