import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const MAX_WIDTH = {
  sm:  'max-w-sm',
  md:  'max-w-md',
  lg:  'max-w-lg',
  xl:  'max-w-xl',
  '2xl': 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#281814]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Contenedor */}
      <div
        className={`relative bg-white w-full ${MAX_WIDTH[maxWidth]} rounded-xl border border-[#e5beb5]/40 shadow-[0_8px_40px_rgba(15,23,42,0.15)] max-h-[90vh] flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#e5beb5] flex-shrink-0">
          <h2 className="font-black text-[#281814] text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5c403a]/50 hover:bg-[#ffe9e4] hover:text-[#b22300] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
