import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TechBadgeProps {
  name: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const TechBadge: React.FC<TechBadgeProps> = ({
  name,
  size = 'sm',
  className,
}) => {
  // Determine color theme based on technology keyword
  const getTheme = (tech: string) => {
    const lower = tech.toLowerCase();
    if (lower.includes('stm32') || lower.includes('arm') || lower.includes('freertos') || lower.includes('bare-metal') || lower.includes('esp32')) {
      return 'border-sky-500/30 bg-sky-950/40 text-sky-300';
    }
    if (lower.includes('ros') || lower.includes('nav2') || lower.includes('slam') || lower.includes('moveit') || lower.includes('gazebo')) {
      return 'border-cyan-500/30 bg-cyan-950/40 text-cyan-300';
    }
    if (lower.includes('solidworks') || lower.includes('fusion') || lower.includes('ansys') || lower.includes('cad') || lower.includes('fea')) {
      return 'border-amber-500/30 bg-amber-950/40 text-amber-300';
    }
    if (lower.includes('c++') || lower.includes('c#') || lower.includes('c ') || lower.endsWith(' c')) {
      return 'border-blue-500/30 bg-blue-950/40 text-blue-300';
    }
    if (lower.includes('python') || lower.includes('pytorch') || lower.includes('yolo') || lower.includes('opencv') || lower.includes('tensorrt')) {
      return 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300';
    }
    if (lower.includes('can') || lower.includes('spi') || lower.includes('i2c') || lower.includes('uart') || lower.includes('modbus')) {
      return 'border-purple-500/30 bg-purple-950/40 text-purple-300';
    }
    return 'border-slate-700/80 bg-slate-800/60 text-slate-300';
  };

  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 rounded',
    sm: 'text-xs px-2 py-0.5 rounded-md font-mono',
    md: 'text-xs px-2.5 py-1 rounded-md font-mono',
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center font-medium border select-none transition-colors",
          getTheme(name),
          sizeStyles[size],
          className
        )
      )}
    >
      {name}
    </span>
  );
};
