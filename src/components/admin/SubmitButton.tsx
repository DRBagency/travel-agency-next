"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  successText?: string;
  formAction?: (formData: FormData) => void;
}

export default function SubmitButton({
  children,
  className,
  successText = "Guardado",
  formAction,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const [showSuccess, setShowSuccess] = useState(false);
  const wasPending = useRef(false);

  useEffect(() => {
    if (pending) {
      wasPending.current = true;
      setShowSuccess(false);
    } else if (wasPending.current) {
      wasPending.current = false;
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [pending]);

  return (
    <>
      {showSuccess && (
        <span className="flex items-center gap-1 text-sm text-emerald-600 dark:text-green-400 animate-in fade-in">
          <Check className="w-4 h-4" /> {successText}
        </span>
      )}
      <button
        type="submit"
        disabled={pending}
        className={className}
        formAction={formAction}
      >
        {pending && <Loader2 className="w-4 h-4 animate-spin inline me-1.5" />}
        {children}
      </button>
    </>
  );
}
