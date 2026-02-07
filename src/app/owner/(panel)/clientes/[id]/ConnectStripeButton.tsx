"use client";

import { useFormStatus } from "react-dom";

export default function ConnectStripeButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 rounded bg-black text-white disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Conectando con Stripe..." : "Conectar Stripe"}
    </button>
  );
}
