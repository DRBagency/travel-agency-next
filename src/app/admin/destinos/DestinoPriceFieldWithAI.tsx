"use client";

import { useState } from "react";
import AIPricingSuggestion from "@/components/ai/AIPricingSuggestion";

interface Props {
  defaultValue?: number;
  destinoName?: string;
  clienteId: string;
  plan?: string;
  label: string;
  placeholder: string;
}

export default function DestinoPriceFieldWithAI({
  defaultValue = 0,
  destinoName = "",
  clienteId,
  plan,
  label,
  placeholder,
}: Props) {
  const aiLocked = !plan || plan === "start";
  const [price, setPrice] = useState(defaultValue);
  const [name] = useState(destinoName);

  return (
    <div className="space-y-2">
      <div>
        <label className="panel-label">{label}</label>
        <input
          name="precio"
          type="number"
          min={0}
          value={price || ""}
          onChange={(e) => setPrice(Number(e.target.value) || 0)}
          className="panel-input w-full"
          placeholder={placeholder}
        />
      </div>
      {name && !aiLocked && (
        <AIPricingSuggestion
          destinoName={name}
          currentPrice={price}
          clienteId={clienteId}
        />
      )}
    </div>
  );
}
