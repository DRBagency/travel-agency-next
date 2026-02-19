"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { sileo } from "sileo";

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  successText?: string;
  errorText?: string;
  formAction?: (formData: FormData) => void;
}

export default function SubmitButton({
  children,
  className,
  successText = "Guardado",
  errorText,
  formAction,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);

  useEffect(() => {
    if (pending) {
      wasPending.current = true;
    } else if (wasPending.current) {
      wasPending.current = false;
      sileo.success({ title: successText });
    }
  }, [pending, successText]);

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      formAction={formAction}
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin inline me-1.5" />}
      {children}
    </button>
  );
}
