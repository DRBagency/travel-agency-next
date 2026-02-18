"use client";

import { useState, ReactNode, useTransition } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  onConfirm: () => void | Promise<void>;
}

export default function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await onConfirm();
      setOpen(false);
    });
  }

  return (
    <>
      <span onClick={() => setOpen(true)} className="inline-flex">
        {trigger}
      </span>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => !isPending && setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-premium-lg p-6 max-w-md w-full mx-4 animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  variant === "danger"
                    ? "bg-red-50 dark:bg-red-500/15"
                    : "bg-amber-50 dark:bg-amber-500/15"
                }`}
              >
                <AlertTriangle
                  className={`w-6 h-6 ${
                    variant === "danger"
                      ? "text-red-500 dark:text-red-400"
                      : "text-amber-500 dark:text-amber-400"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-white/60 mt-1">
                  {description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                  variant === "danger"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-amber-500 hover:bg-amber-600"
                }`}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ...
                  </span>
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
