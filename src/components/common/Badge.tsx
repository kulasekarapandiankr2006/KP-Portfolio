import React from 'react';
import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'blue' | 'cyan' | 'amber' | 'emerald' | 'slate' | 'rose' | 'purple';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'sm',
  icon,
  dot = false,
  className,
}) => {
  const variantStyles = {
    blue: "bg-engineering-blue/10 text-sky-300 border-sky-500/30",
    cyan: "bg-engineering-cyan/10 text-cyan-300 border-cyan-500/30",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    slate: "bg-slate-800/80 text-slate-300 border-slate-700/60",
    rose: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    purple: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  };

  const dotColors = {
    blue: "bg-sky-400",
    cyan: "bg-cyan-400",
    amber: "bg-amber-400",
    emerald: "bg-emerald-400 animate-pulse",
    slate: "bg-slate-400",
    rose: "bg-rose-400",
    purple: "bg-purple-400",
  };

  const sizeStyles = {
    sm: "text-xs px-2.5 py-0.5 font-mono",
    md: "text-xs px-3 py-1 font-mono tracking-tight",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 rounded-full font-medium border shadow-sm select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
    >
      {dot && <span className={clsx("w-1.5 h-1.5 rounded-full", dotColors[variant])} />}
      {icon && <span className="text-current opacity-80">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
