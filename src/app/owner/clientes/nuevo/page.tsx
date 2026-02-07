import { createCliente } from "./actions";

export default function NuevoClientePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Nueva agencia</h1>

      <form action={createCliente} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input name="nombre" className="w-full border rounded px-3 py-2 bg-white text-black placeholder-gray-400" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Slug</label>
          <input name="slug" className="w-full border rounded px-3 py-2 bg-white text-black placeholder-gray-400" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Domain</label>
          <input name="domain" className="w-full border rounded px-3 py-2 bg-white text-black placeholder-gray-400" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Primary Color</label>
          <input name="primary_color" className="w-full border rounded px-3 py-2 bg-white text-black placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-sm mb-1">Hero Title</label>
          <input name="hero_title" className="w-full border rounded px-3 py-2 bg-white text-black placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-sm mb-1">Hero Subtitle</label>
          <textarea name="hero_subtitle" className="w-full border rounded px-3 py-2 bg-white text-black placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-sm mb-1">Hero CTA Text</label>
          <input name="hero_cta_text" className="w-full border rounded px-3 py-2 bg-white text-black placeholder-gray-400" />
        </div>

        <button type="submit" className="px-4 py-2 rounded bg-black text-white">
          Crear agencia
        </button>
      </form>
    </div>
  );
}
