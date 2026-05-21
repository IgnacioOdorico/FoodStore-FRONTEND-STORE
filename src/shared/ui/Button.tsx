import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', isLoading, className = '', type = 'button', ...props
}) => {
  const styles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' },
    secondary: { backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' },
    danger: { backgroundColor: 'var(--color-error)', color: 'var(--color-on-error)' },
  };

  return (
    <button
      {...props}
      type={type}
      disabled={isLoading || props.disabled}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={styles[variant]}
    >
      {isLoading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
      {children}
    </button>
  );
};
