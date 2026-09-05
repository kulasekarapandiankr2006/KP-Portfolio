import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  helperText?: string;
  variant?: 'cyan' | 'blue' | 'amber' | 'emerald' | 'slate';
}

export const TagInput: React.FC<TagInputProps> = ({
  label,
  tags = [],
  onChange,
  placeholder = 'Type and press Enter...',
  helperText,
  variant = 'cyan',
}) => {
  const [inputVal, setInputVal] = useState('');

  const addTag = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputVal('');
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const getTagStyle = () => {
    switch (variant) {
      case 'cyan': return 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40';
      case 'amber': return 'bg-amber-950/60 text-amber-300 border-amber-500/40';
      case 'emerald': return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
      case 'blue': return 'bg-sky-950/60 text-sky-300 border-sky-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-mono text-slate-300 block font-medium">
          {label}
        </label>
      )}

      <div className="min-h-[42px] p-1.5 rounded-lg bg-slate-900 border border-slate-700/80 flex flex-wrap items-center gap-1.5 focus-within:border-engineering-cyan focus-within:ring-1 focus-within:ring-engineering-cyan transition-colors">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono border ${getTagStyle()}`}
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-current opacity-70 hover:opacity-100 p-0.5 hover:bg-black/20 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <div className="flex-1 flex items-center min-w-[140px]">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => inputVal && addTag(inputVal)}
            placeholder={tags.length === 0 ? placeholder : 'Add more...'}
            className="w-full bg-transparent px-2 py-1 text-xs text-white placeholder:text-slate-600 focus:outline-none font-mono"
          />
          {inputVal.trim() && (
            <button
              type="button"
              onClick={() => addTag(inputVal)}
              className="p-1 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700 mr-1"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] font-mono text-slate-500">{helperText}</p>
      )}
    </div>
  );
};
