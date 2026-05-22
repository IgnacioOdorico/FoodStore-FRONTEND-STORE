import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-bold uppercase tracking-widest text-[#5c403a]">
        {label}
      </label>

      <input
        {...props}
        className={`w-full px-4 py-3 bg-[#fff8f6] border rounded-lg text-sm text-[#281814] placeholder:text-[#5c403a]/40 focus:outline-none focus:ring-2 transition-all ${
          error
            ? 'border-[#ba1a1a] bg-[#ffdad6]/20 focus:ring-[#ba1a1a]/20 focus:border-[#ba1a1a]'
            : 'border-[#e5beb5] focus:ring-[#b22300]/20 focus:border-[#b22300]'
        } ${className}`}
      />

      {error && (
        <span className="text-[11px] text-[#ba1a1a] font-bold">{error}</span>
      )}
    </div>
  );
};
