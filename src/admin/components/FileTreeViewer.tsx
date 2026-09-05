import React, { useState } from 'react';
import type { ExtractedFileNode } from '../../types/project';
import { 
  Folder, 
  FolderOpen, 
  File, 
  FileCode, 
  FileText, 
  Image as ImageIcon, 
  ChevronRight, 
  ChevronDown,
  Play
} from 'lucide-react';

interface FileTreeViewerProps {
  nodes: ExtractedFileNode[];
  selectedEntryPoint?: string;
  onSelectEntryPoint?: (entryPath: string) => void;
  className?: string;
}

const TreeNode: React.FC<{
  node: ExtractedFileNode;
  selectedEntryPoint?: string;
  onSelectEntryPoint?: (entryPath: string) => void;
  depth?: number;
}> = ({ node, selectedEntryPoint, onSelectEntryPoint, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isDir = node.type === 'directory';
  const isSelected = selectedEntryPoint === node.path;
  const isHtml = node.extension === 'html' || node.extension === 'htm';

  const getFileIcon = () => {
    if (isDir) {
      return isOpen ? (
        <FolderOpen className="w-4 h-4 text-amber-400 flex-shrink-0" />
      ) : (
        <Folder className="w-4 h-4 text-amber-400 flex-shrink-0" />
      );
    }
    if (isHtml) return <FileCode className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
    if (['css', 'js', 'ts', 'jsx', 'tsx', 'json', 'py', 'cpp', 'c', 'h'].includes(node.extension || '')) {
      return <FileCode className="w-4 h-4 text-cyan-400 flex-shrink-0" />;
    }
    if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(node.extension || '')) {
      return <ImageIcon className="w-4 h-4 text-purple-400 flex-shrink-0" />;
    }
    if (node.extension === 'pdf' || node.extension === 'md') {
      return <FileText className="w-4 h-4 text-rose-400 flex-shrink-0" />;
    }
    return <File className="w-4 h-4 text-slate-400 flex-shrink-0" />;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div
        className={`flex items-center justify-between py-1 px-2 rounded text-xs font-mono transition-colors group select-none ${
          isSelected 
            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 font-semibold' 
            : 'hover:bg-slate-800/60 text-slate-300'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <div 
          className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
          onClick={() => isDir && setIsOpen(!isOpen)}
        >
          {isDir ? (
            <span className="text-slate-500">
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </span>
          ) : (
            <span className="w-3.5" />
          )}

          {getFileIcon()}

          <span className="truncate">{node.name}</span>

          {node.isEntryCandidate && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Play className="w-2 h-2 fill-current" />
              HTML Entry Candidate
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          {node.size !== undefined && (
            <span className="text-[10px] text-slate-500">{formatSize(node.size)}</span>
          )}

          {isHtml && onSelectEntryPoint && (
            <button
              type="button"
              onClick={() => onSelectEntryPoint(node.path)}
              className={`text-[10px] px-2 py-0.5 rounded transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {isSelected ? 'Active Entry' : 'Set as Entry'}
            </button>
          )}
        </div>
      </div>

      {isDir && isOpen && node.children && (
        <div className="space-y-0.5">
          {node.children.map((child, idx) => (
            <TreeNode
              key={idx}
              node={child}
              selectedEntryPoint={selectedEntryPoint}
              onSelectEntryPoint={onSelectEntryPoint}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTreeViewer: React.FC<FileTreeViewerProps> = ({
  nodes,
  selectedEntryPoint,
  onSelectEntryPoint,
  className = '',
}) => {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-center text-xs font-mono text-slate-500">
        No files extracted yet.
      </div>
    );
  }

  return (
    <div className={`rounded-lg bg-slate-950 border border-slate-800 p-2 overflow-x-auto max-h-80 overflow-y-auto ${className}`}>
      <div className="space-y-0.5">
        {nodes.map((node, idx) => (
          <TreeNode
            key={idx}
            node={node}
            selectedEntryPoint={selectedEntryPoint}
            onSelectEntryPoint={onSelectEntryPoint}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
};
