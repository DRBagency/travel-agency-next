"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useTranslations } from 'next-intl';

interface Item {
  description: string;
  quantity: number;
  unit_price: number;
  iva_percent: number;
}

interface ContentJson {
  client_name: string;
  client_email: string;
  items: Item[];
  conditions: string;
  validity_date: string;
  notes: string;
}

interface DocumentFormClientProps {
  documentType: string;
  defaultValues?: ContentJson & { title?: string };
  children: React.ReactNode; // SubmitButton slot
}

const emptyItem: Item = {
  description: "",
  quantity: 1,
  unit_price: 0,
  iva_percent: 21,
};

export default function DocumentFormClient({
  documentType,
  defaultValues,
  children,
}: DocumentFormClientProps) {
  const t = useTranslations('admin.documentos.form');
  const td = useTranslations('admin.documentos');
  const [items, setItems] = useState<Item[]>(
    defaultValues?.items?.length ? defaultValues.items : [{ ...emptyItem }]
  );

  function addItem() {
    setItems((prev) => [...prev, { ...emptyItem }]);
  }

  function removeItem(index: number) {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  function updateItem(index: number, field: keyof Item, value: string) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "description"
                  ? value
                  : parseFloat(value) || 0,
            }
          : item
      )
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );
  const ivaTotal = items.reduce(
    (sum, item) =>
      sum + item.quantity * item.unit_price * (item.iva_percent / 100),
    0
  );
  const total = subtotal + ivaTotal;

  const typeLabel =
    documentType === "presupuesto"
      ? td('presupuesto')
      : documentType === "contrato"
        ? td('contrato')
        : td('factura');

  async function handleGeneratePDF() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    const titleEl = document.querySelector<HTMLInputElement>('input[name="title"]');
    const clientNameEl = document.querySelector<HTMLInputElement>('input[name="client_name"]');
    const clientEmailEl = document.querySelector<HTMLInputElement>('input[name="client_email"]');
    const validityEl = document.querySelector<HTMLInputElement>('input[name="validity_date"]');
    const conditionsEl = document.querySelector<HTMLTextAreaElement>('textarea[name="conditions"]');
    const notesEl = document.querySelector<HTMLTextAreaElement>('textarea[name="notes"]');

    const title = titleEl?.value || typeLabel;
    const clientName = clientNameEl?.value || "";
    const clientEmail = clientEmailEl?.value || "";
    const validityDate = validityEl?.value || "";
    const conditions = conditionsEl?.value || "";
    const notes = notesEl?.value || "";

    // Header
    doc.setFontSize(22);
    doc.text(typeLabel.toUpperCase(), 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(title, 14, 30);

    // Client info
    doc.setFontSize(10);
    doc.setTextColor(60);
    let y = 44;
    doc.text(`Cliente: ${clientName}`, 14, y);
    y += 6;
    doc.text(`Email: ${clientEmail}`, 14, y);
    y += 6;
    if (validityDate) {
      doc.text(`Valido hasta: ${validityDate}`, 14, y);
      y += 6;
    }

    // Table header
    y += 6;
    doc.setFillColor(240, 240, 240);
    doc.rect(14, y - 4, 182, 8, "F");
    doc.setTextColor(30);
    doc.setFontSize(9);
    doc.text("Descripcion", 16, y);
    doc.text("Cant.", 110, y);
    doc.text("Precio Ud.", 128, y);
    doc.text("IVA %", 155, y);
    doc.text("Total", 175, y);

    // Items
    y += 8;
    doc.setFontSize(9);
    items.forEach((item) => {
      const lineTotal =
        item.quantity * item.unit_price * (1 + item.iva_percent / 100);
      doc.setTextColor(50);
      doc.text(item.description.substring(0, 50), 16, y);
      doc.text(String(item.quantity), 110, y);
      doc.text(item.unit_price.toFixed(2) + " EUR", 128, y);
      doc.text(item.iva_percent + "%", 155, y);
      doc.text(lineTotal.toFixed(2) + " EUR", 175, y);
      y += 7;
    });

    // Totals
    y += 4;
    doc.setDrawColor(200);
    doc.line(14, y, 196, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(30);
    doc.text(`Subtotal: ${subtotal.toFixed(2)} EUR`, 140, y);
    y += 6;
    doc.text(`IVA: ${ivaTotal.toFixed(2)} EUR`, 140, y);
    y += 6;
    doc.setFontSize(12);
    doc.text(`TOTAL: ${total.toFixed(2)} EUR`, 140, y);

    // Conditions & notes
    if (conditions) {
      y += 14;
      doc.setFontSize(9);
      doc.setTextColor(80);
      doc.text("Condiciones:", 14, y);
      y += 5;
      const condLines = doc.splitTextToSize(conditions, 170);
      doc.text(condLines, 14, y);
      y += condLines.length * 4;
    }

    if (notes) {
      y += 6;
      doc.setFontSize(9);
      doc.setTextColor(80);
      doc.text("Notas:", 14, y);
      y += 5;
      const noteLines = doc.splitTextToSize(notes, 170);
      doc.text(noteLines, 14, y);
    }

    doc.save(`${typeLabel.toLowerCase()}-${title || "documento"}.pdf`);
  }

  return (
    <>
      <input type="hidden" name="content_json" value={JSON.stringify({
        client_name: "",
        client_email: "",
        items,
        conditions: "",
        validity_date: "",
        notes: "",
      })} />

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="panel-label">{t('titleLabel')}</label>
          <input
            name="title"
            required
            defaultValue={defaultValues?.title || ""}
            placeholder={t('titlePlaceholder', { type: typeLabel })}
            className="panel-input"
          />
        </div>
        <div>
          <label className="panel-label">
            {t('validityDate')}
          </label>
          <input
            name="validity_date"
            type="date"
            defaultValue={defaultValues?.validity_date || ""}
            className="panel-input"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="panel-label">
            {t('clientName')}
          </label>
          <input
            name="client_name"
            required
            defaultValue={defaultValues?.client_name || ""}
            placeholder={t('clientNamePlaceholder')}
            className="panel-input"
          />
        </div>
        <div>
          <label className="panel-label">
            {t('clientEmail')}
          </label>
          <input
            name="client_email"
            type="email"
            defaultValue={defaultValues?.client_email || ""}
            placeholder={t('clientEmailPlaceholder')}
            className="panel-input"
          />
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-600 dark:text-white/70">{t('items')}</label>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 text-sm text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-500 dark:hover:text-drb-turquoise-300 transition-colors"
          >
            <Plus className="w-4 h-4" /> {t('addRow')}
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_70px_100px_70px_36px] gap-2 items-end"
            >
              <div>
                {i === 0 && (
                  <span className="text-xs text-gray-400 dark:text-white/40 block mb-1">
                    {t('descriptionCol')}
                  </span>
                )}
                <input
                  value={item.description}
                  onChange={(e) => updateItem(i, "description", e.target.value)}
                  placeholder="Servicio o concepto"
                  className="panel-input text-sm"
                />
              </div>
              <div>
                {i === 0 && (
                  <span className="text-xs text-gray-400 dark:text-white/40 block mb-1">
                    {t('qtyCol')}
                  </span>
                )}
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, "quantity", e.target.value)}
                  className="panel-input text-sm"
                />
              </div>
              <div>
                {i === 0 && (
                  <span className="text-xs text-gray-400 dark:text-white/40 block mb-1">
                    {t('unitPriceCol')}
                  </span>
                )}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => updateItem(i, "unit_price", e.target.value)}
                  className="panel-input text-sm"
                />
              </div>
              <div>
                {i === 0 && (
                  <span className="text-xs text-gray-400 dark:text-white/40 block mb-1">
                    {t('vatCol')}
                  </span>
                )}
                <input
                  type="number"
                  min="0"
                  value={item.iva_percent}
                  onChange={(e) => updateItem(i, "iva_percent", e.target.value)}
                  className="panel-input text-sm"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="p-2 text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors"
                  title={t('deleteRow')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="bg-gray-50/50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/10">
        <div className="flex justify-between text-sm text-gray-500 dark:text-white/60 mb-1">
          <span>{t('subtotal')}</span>
          <span>{subtotal.toFixed(2)} EUR</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-white/60 mb-1">
          <span>{t('vat')}</span>
          <span>{ivaTotal.toFixed(2)} EUR</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white border-t border-gray-100 dark:border-white/10 pt-2 mt-2">
          <span>{t('total')}</span>
          <span>{total.toFixed(2)} EUR</span>
        </div>
      </div>

      <div>
        <label className="panel-label">{t('conditions')}</label>
        <textarea
          name="conditions"
          defaultValue={defaultValues?.conditions || ""}
          placeholder={t('conditionsPlaceholder')}
          className="panel-input min-h-[80px]"
        />
      </div>

      <div>
        <label className="panel-label">{t('notes')}</label>
        <textarea
          name="notes"
          defaultValue={defaultValues?.notes || ""}
          placeholder={t('notesPlaceholder')}
          className="panel-input min-h-[80px]"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 flex-wrap">
        {children}
        <button
          type="button"
          onClick={handleGeneratePDF}
          className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white font-bold border border-gray-200 dark:border-white/20 transition-colors"
        >
          {t('generatePDF')}
        </button>
      </div>
    </>
  );
}
