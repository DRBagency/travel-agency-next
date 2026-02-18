"use client";

import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <div className={`panel-card flex flex-col items-center justify-center text-center ${compact ? "p-8" : "p-12"}`}>
      <div className="text-gray-300 dark:text-white/20 mb-3 [&>svg]:w-10 [&>svg]:h-10">
        {icon}
      </div>
      <p className="text-gray-500 dark:text-white/50 font-medium text-sm">{title}</p>
      {description && (
        <p className="text-gray-300 dark:text-white/20 text-xs mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
