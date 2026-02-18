"use client";

import { ReactNode } from "react";
import ConfirmDialog from "./ConfirmDialog";

interface DeleteWithConfirmProps {
  action: (formData: FormData) => Promise<void> | void;
  hiddenFields?: Record<string, string>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  trigger: ReactNode;
}

export default function DeleteWithConfirm({
  action,
  hiddenFields = {},
  title,
  description,
  confirmLabel,
  cancelLabel,
  trigger,
}: DeleteWithConfirmProps) {
  async function handleConfirm() {
    const fd = new FormData();
    for (const [key, value] of Object.entries(hiddenFields)) {
      fd.set(key, value);
    }
    await action(fd);
  }

  return (
    <ConfirmDialog
      trigger={trigger}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      variant="danger"
      onConfirm={handleConfirm}
    />
  );
}
