import { createCliente } from "./actions";

export default function NuevoClientePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Nueva agencia</h1>

      <form action={createCliente} className="space-y-4 max-w-2xl">
        <div>
          <label className="panel-label block mb-1">Nombre</label>
          <input name="nombre" className="w-full panel-input" required />
        </div>
        <div>
          <label className="panel-label block mb-1">Slug</label>
          <input name="slug" className="w-full panel-input" required />
        </div>
        <div>
          <label className="panel-label block mb-1">Domain</label>
          <input name="domain" className="w-full panel-input" required />
        </div>
        <div>
          <label className="panel-label block mb-1">Primary Color</label>
          <input name="primary_color" className="w-full panel-input" />
        </div>
        <div>
          <label className="panel-label block mb-1">Hero Title</label>
          <input name="hero_title" className="w-full panel-input" />
        </div>
        <div>
          <label className="panel-label block mb-1">Hero Subtitle</label>
          <textarea name="hero_subtitle" className="w-full panel-input" />
        </div>
        <div>
          <label className="panel-label block mb-1">Hero CTA Text</label>
          <input name="hero_cta_text" className="w-full panel-input" />
        </div>

        <button type="submit" className="btn-primary">
          Crear agencia
        </button>
      </form>
    </div>
  );
}
