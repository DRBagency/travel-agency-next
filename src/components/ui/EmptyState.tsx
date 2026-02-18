"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`panel-card flex flex-col items-center justify-center text-center ${compact ? "p-8" : "p-12"}`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="text-gray-300 dark:text-white/20 mb-3 [&>svg]:w-10 [&>svg]:h-10"
      >
        {icon}
      </motion.div>
      <p className="text-gray-500 dark:text-white/50 font-medium text-sm">{title}</p>
      {description && (
        <p className="text-gray-300 dark:text-white/20 text-xs mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
