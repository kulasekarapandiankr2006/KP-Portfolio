import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cyan' | 'amber' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed select-none group";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5 font-mono",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary: "bg-engineering-blue hover:bg-engineering-blue/90 hover:-translate-y-px text-white shadow-lg shadow-engineering-blue/20 focus:ring-engineering-blue focus-visible:ring-2 border border-engineering-blueGlow/30 active:scale-[0.97] active:translate-y-0",
    secondary: "bg-background-tertiary hover:bg-slate-700 hover:-translate-y-px text-slate-100 border border-slate-700 hover:border-slate-600 focus:ring-slate-500 focus-visible:ring-2 active:scale-[0.97] active:translate-y-0",
    outline: "bg-transparent hover:bg-engineering-blue/10 hover:-translate-y-px text-slate-200 hover:text-white border border-slate-700 hover:border-engineering-blue/60 focus:ring-engineering-blue focus-visible:ring-2 active:scale-[0.97] active:translate-y-0",
    ghost: "bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white focus:ring-slate-600 focus-visible:ring-2",
    cyan: "bg-engineering-cyan/10 hover:bg-engineering-cyan/20 hover:-translate-y-px text-engineering-cyanGlow border border-engineering-cyan/40 hover:border-engineering-cyan shadow-sm focus:ring-engineering-cyan focus-visible:ring-2 active:scale-[0.97] active:translate-y-0",
    amber: "bg-engineering-amber/10 hover:bg-engineering-amber/20 hover:-translate-y-px text-engineering-amberGlow border border-engineering-amber/40 hover:border-engineering-amber focus:ring-engineering-amber focus-visible:ring-2 active:scale-[0.97] active:translate-y-0",
    danger: "bg-engineering-rose/10 hover:bg-engineering-rose/20 hover:-translate-y-px text-rose-400 border border-rose-500/40 hover:border-rose-500 focus:ring-rose-500 focus-visible:ring-2 active:scale-[0.97] active:translate-y-0",
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        icon && iconPosition === 'left' && <span className="transition-transform group-hover:-translate-x-0.5">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="transition-transform group-hover:translate-x-0.5">{icon}</span>
      )}
    </button>
  );
};
