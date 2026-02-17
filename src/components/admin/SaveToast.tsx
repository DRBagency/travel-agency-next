"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

export default function SaveToast({ message }: { message?: string | null }) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      window.history.replaceState({}, "", window.location.pathname);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible || !message) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-sm font-medium">
      <Check className="w-4 h-4" />
      {message}
    </div>
  );
}
