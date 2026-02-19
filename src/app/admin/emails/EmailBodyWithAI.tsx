"use client";

import { useState } from "react";
import AIEmailGenerator from "@/components/ai/AIEmailGenerator";

interface Props {
  defaultValue?: string;
  clienteId: string;
  plan?: string;
  label: string;
  name: string;
  placeholder?: string;
}

export default function EmailBodyWithAI({
  defaultValue = "",
  clienteId,
  plan,
  label,
  name,
  placeholder = "<h1>...</h1><p>...</p>",
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const aiLocked = !plan || plan === "start";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="panel-label">{label}</label>
        {!aiLocked && (
          <AIEmailGenerator
            clienteId={clienteId}
            onAccept={(html) => setValue(html)}
          />
        )}
      </div>
      <textarea
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="panel-input min-h-[200px] font-mono text-sm"
        placeholder={placeholder}
      />
    </div>
  );
}
