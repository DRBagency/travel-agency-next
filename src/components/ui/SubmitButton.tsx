"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
  className?: string;
}

export default function SubmitButton({ label, loadingLabel, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={className ?? "w-full rounded-xl bg-drb-turquoise-500 hover:bg-drb-turquoise-600 text-white font-bold py-3 transition-colors shadow-lg shadow-drb-turquoise-500/30 disabled:opacity-60 disabled:cursor-not-allowed"}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingLabel ?? label}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
