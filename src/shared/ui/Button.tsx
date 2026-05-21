import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const VARIANTS = {
  primary:
    'bg-[#b22300] text-white hover:bg-[#da3711] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'bg-transparent text-[#281814] border border-[#907068] hover:bg-[#fff0ed] disabled:opacity-50 disabled:cursor-not-allowed',
  danger:
    'bg-[#ba1a1a] text-white hover:bg-red-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading) return;
    if (onClick) onClick(e);
  };

  return (
    <button
      {...props}
      type={type}
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-[0.97] cursor-pointer select-none ${VARIANTS[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      onClick={handleClick}
    >
      {isLoading && (
        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
      )}
      {children}
    </button>
  );
};
