import React from 'react';
import type { ReactNode } from 'react';
import { Badge } from './Badge';

export interface SectionHeaderProps {
  badgeText?: string;
  badgeVariant?: 'blue' | 'cyan' | 'amber' | 'emerald' | 'slate' | 'purple';
  title: string;
  subtitle?: string;
  action?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badgeText,
  badgeVariant = 'blue',
  title,
  subtitle,
  action,
  align = 'left',
  className = '',
}) => {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center' : ''} ${className}`}>
      <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : 'justify-between'} flex-wrap mb-3 reveal-on-scroll`}>
        {badgeText && (
          <Badge variant={badgeVariant} dot size="md">
            {badgeText}
          </Badge>
        )}
        {action && <div className="ml-auto">{action}</div>}
      </div>
      
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-white tracking-tight reveal-on-scroll delay-100">
        {title}
      </h2>

      {subtitle && (
        <p className={`mt-3 text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed reveal-on-scroll delay-200 ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}

      <div className={`mt-4 flex items-center gap-2 reveal-on-scroll delay-200 ${align === 'center' ? 'justify-center' : ''}`}>
        <div className="h-0.5 w-12 bg-engineering-blue rounded-full" />
        <div className="h-0.5 w-4 bg-engineering-cyan rounded-full" />
        <div className="h-0.5 w-24 bg-slate-800 rounded-full" />
      </div>
    </div>
  );
};
