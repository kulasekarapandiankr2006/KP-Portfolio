import React from 'react';
import type { ReactNode, HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
  cornerAccents?: boolean;
  glow?: 'none' | 'cyan' | 'blue' | 'amber';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  cornerAccents = false,
  glow = 'none',
  padding = 'md',
  className,
  ...props
}) => {
  const variantStyles = {
    default: "bg-background-card border border-engineering-border hover:border-slate-700 transition-[border-color] duration-200",
    elevated: "bg-background-card border border-slate-700/80 shadow-card-glow",
    glass: "bg-background-card/80 backdrop-blur-md border border-slate-700/60",
    interactive: "bg-background-card border border-engineering-border hover:border-engineering-blue/60 hover:shadow-tech-blue cursor-pointer transform hover:-translate-y-1 transition-[transform,box-shadow,border-color] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-engineering-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  };

  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const glowStyles = {
    none: "",
    cyan: "shadow-tech-cyan border-cyan-500/30",
    blue: "shadow-tech-blue border-sky-500/30",
    amber: "shadow-tech-amber border-amber-500/30",
  };

  return (
    <div
      className={twMerge(
        clsx(
          "rounded-xl transition-all duration-200 relative overflow-hidden",
          variantStyles[variant],
          paddingStyles[padding],
          glowStyles[glow],
          cornerAccents && "tech-corner-accent",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
