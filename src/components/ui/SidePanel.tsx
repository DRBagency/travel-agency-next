"use client"

import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function SidePanel({ isOpen, onClose, title, children }: SidePanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`
        fixed right-0 top-0 bottom-0 w-full md:w-2/3 lg:w-1/2 xl:w-2/5
        bg-gradient-to-br from-drb-turquoise-900 to-drb-turquoise-950
        shadow-2xl z-50
        overflow-y-auto
        ${isOpen ? 'animate-slide-in-right' : 'animate-slide-out-right'}
      `}>
        {/* Header */}
        <div className="sticky top-0 z-10 bg-drb-turquoise-900/95 backdrop-blur-md border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </>
  );
}
