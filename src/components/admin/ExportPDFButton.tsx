"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';

interface ExportPDFButtonProps {
  estado: string;
  q: string;
  from: string;
  to: string;
}

export default function ExportPDFButton({
  estado,
  q,
  from,
  to,
}: ExportPDFButtonProps) {
  const t = useTranslations('admin.reservas.export');
  const [loading, setLoading] = useState(false);

  async function handleExportPDF() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ estado, q, from, to, format: "json" });
      const res = await fetch(`/api/admin/export?${params}`);
      if (!res.ok) return;

      const reservas = await res.json();
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "landscape" });

      doc.setFontSize(18);
      doc.text(t('reservas'), 14, 18);
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(
        `${t('exported')}: ${new Date().toLocaleDateString()} | ${t('filter')}: ${estado !== "todos" ? estado : "todos"} | ${t('total')}: ${reservas.length}`,
        14,
        25
      );

      // Table header
      const cols = [t('date'), t('client'), t('email'), t('destination'), t('persons'), t('price'), t('status')];
      const colX = [14, 50, 100, 160, 200, 215, 245];
      let y = 35;

      doc.setFillColor(240, 240, 240);
      doc.rect(12, y - 4, 275, 8, "F");
      doc.setFontSize(8);
      doc.setTextColor(30);
      cols.forEach((col, i) => doc.text(col, colX[i], y));

      // Rows
      y += 8;
      doc.setFontSize(8);
      reservas.forEach((r: Record<string, unknown>) => {
        if (y > 190) {
          doc.addPage();
          y = 20;
          doc.setFillColor(240, 240, 240);
          doc.rect(12, y - 4, 275, 8, "F");
          cols.forEach((col, i) => doc.text(col, colX[i], y));
          y += 8;
        }
        doc.setTextColor(50);
        doc.text(new Date(r.created_at as string).toLocaleDateString(), colX[0], y);
        doc.text(String(r.nombre || "").substring(0, 25), colX[1], y);
        doc.text(String(r.email || "").substring(0, 30), colX[2], y);
        doc.text(String(r.destino || "").substring(0, 20), colX[3], y);
        doc.text(String(r.personas || ""), colX[4], y);
        doc.text(`${r.precio || 0} EUR`, colX[5], y);
        doc.text(String(r.estado_pago || ""), colX[6], y);
        y += 6;
      });

      doc.save("reservas.pdf");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExportPDF}
      disabled={loading}
      className="px-4 py-2 bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-xl font-semibold transition-colors border border-gray-200 dark:border-white/20"
    >
      {loading ? t('generating') : t('exportPdf')}
    </button>
  );
}
