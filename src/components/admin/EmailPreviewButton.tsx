"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";

interface EmailPreviewButtonProps {
  apiUrl: string;
  formId: string;
}

export default function EmailPreviewButton({
  apiUrl,
  formId,
}: EmailPreviewButtonProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePreview() {
    setLoading(true);
    try {
      const form = document.getElementById(formId) as HTMLFormElement | null;
      if (!form) return;

      const formData = new FormData(form);
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html_body: formData.get("html_body") || "",
          cta_text: formData.get("cta_text") || "",
          cta_url: formData.get("cta_url") || "",
        }),
      });

      if (res.ok) {
        setHtml(await res.text());
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handlePreview}
        disabled={loading}
        className="px-4 py-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 text-gray-900 dark:text-white font-semibold border border-gray-200 dark:border-white/20 transition-colors text-sm flex items-center gap-2"
      >
        <Eye className="w-4 h-4" />
        {loading ? "Cargando..." : "Preview"}
      </button>

      {html && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b">
              <span className="text-gray-700 font-semibold text-sm">
                Vista previa del email
              </span>
              <button
                onClick={() => setHtml(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <iframe
              srcDoc={html}
              className="w-full h-[75vh] border-0"
              title="Email preview"
            />
          </div>
        </div>
      )}
    </>
  );
}
