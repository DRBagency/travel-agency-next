"use client";

import { useState } from "react";
import AIDescriptionButton from "@/components/ai/AIDescriptionButton";

interface Props {
  defaultValue?: string;
  destinoName?: string;
  clienteId: string;
  plan?: string;
  label: string;
  placeholder: string;
}

export default function DestinoDescriptionField({
  defaultValue = "",
  destinoName = "",
  clienteId,
  plan,
  label,
  placeholder,
}: Props) {
  const aiLocked = !plan || plan === "start";
  const [value, setValue] = useState(defaultValue);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="panel-label">{label}</label>
        {!aiLocked && (
          <AIDescriptionButton
            context={destinoName || "travel destination"}
            fieldName="descripcion"
            onAccept={(text) => setValue(text)}
            clienteId={clienteId}
          />
        )}
      </div>
      <textarea
        name="descripcion"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="panel-input w-full min-h-[100px]"
        placeholder={placeholder}
      />
    </div>
  );
}
