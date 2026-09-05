import React from 'react';
import type { MechanicalSpecItem } from '../../types/mechanical';

interface SpecTableProps {
  specs: MechanicalSpecItem[];
  className?: string;
}

export const SpecTable: React.FC<SpecTableProps> = ({ specs, className = '' }) => {
  if (!specs || specs.length === 0) return null;

  return (
    <div className={`overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/50 ${className}`}>
      <table className="w-full text-left text-xs font-mono">
        <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700/60 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-2.5">Parameter</th>
            <th className="px-4 py-2.5">Value</th>
            <th className="px-4 py-2.5">Unit</th>
            <th className="px-4 py-2.5">Domain</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {specs.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
              <td className="px-4 py-2 text-slate-300 font-medium">{item.label}</td>
              <td className="px-4 py-2 text-cyan-300 font-semibold">{item.value}</td>
              <td className="px-4 py-2 text-slate-400">{item.unit || '-'}</td>
              <td className="px-4 py-2">
                {item.category ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.category}
                  </span>
                ) : (
                  '-'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
