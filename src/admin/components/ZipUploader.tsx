import React, { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { zipService } from '../../services/zipService';
import { runtimeService } from '../../services/runtimeService';
import type { ExtractedFileNode } from '../../types/project';
import { FileTreeViewer } from './FileTreeViewer';
import { Button } from '../../components/common/Button';
import { 
  Upload, 
  FileArchive, 
  AlertCircle, 
  Trash2, 
  Layers, 
  FolderCheck,
  RefreshCw,
  FolderOpen,
  HardDrive
} from 'lucide-react';

interface ZipUploaderProps {
  projectSlug: string;
  hasZip: boolean;
  zipFileName?: string;
  zipFileSize?: number;
  entryPoint?: string;
  extractedTree?: ExtractedFileNode[];
  onZipProcessed: (result: {
    hasZip: boolean;
    zipFileName?: string;
    zipFileSize?: number;
    entryPoint?: string;
    extractedTree?: ExtractedFileNode[];
  }) => void;
  onClearZip: () => void;
}

export const ZipUploader: React.FC<ZipUploaderProps> = ({
  projectSlug,
  hasZip,
  zipFileName,
  zipFileSize,
  entryPoint,
  extractedTree = [],
  onZipProcessed,
  onClearZip,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanningDisk, setIsScanningDisk] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detectedIndexFiles, setDetectedIndexFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scan existing tree on mount if multiple HTML files exist
  useEffect(() => {
    if (extractedTree && extractedTree.length > 0 && detectedIndexFiles.length === 0) {
      const candidates: string[] = [];
      const traverse = (list: ExtractedFileNode[]) => {
        for (const item of list) {
          if (item.type === 'file' && item.name.toLowerCase().endsWith('.html')) {
            candidates.push(item.path);
          }
          if (item.children) {
            traverse(item.children);
          }
        }
      };
      traverse(extractedTree);
      if (candidates.length > 1) {
        setDetectedIndexFiles(candidates);
      }
    }
  }, [extractedTree, detectedIndexFiles.length]);

  // Handler to scan on-disk folder (e.g. server/data/storage/projects/<slug>/extracted/)
  const handleScanDiskFolder = async () => {
    if (!projectSlug.trim()) {
      setErrorMessage('Please specify a valid Project Slug before scanning directory.');
      return;
    }

    setIsScanningDisk(true);
    setErrorMessage(null);

    try {
      const scan = await runtimeService.scanServerProject(projectSlug);
      if (scan.exists && scan.fileTree.length > 0) {
        setDetectedIndexFiles(scan.detectedIndexFiles);
        onZipProcessed({
          hasZip: true,
          zipFileName: `local_folder://${projectSlug}`,
          zipFileSize: scan.totalSize,
          entryPoint: entryPoint || scan.recommendedEntryPoint || scan.detectedIndexFiles[0] || 'index.html',
          extractedTree: scan.fileTree,
        });
      } else {
        setErrorMessage(`No files detected on disk for "${projectSlug}". Ensure files are placed in "server/data/storage/projects/${projectSlug}/extracted/".`);
      }
    } catch (e: any) {
      setErrorMessage(`Failed to scan disk folder: ${e.message}`);
    } finally {
      setIsScanningDisk(false);
    }
  };

  const handleFile = async (file: File) => {
    if (!projectSlug.trim()) {
      setErrorMessage('Please specify a valid Project Slug before uploading a ZIP archive.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const result = await zipService.processProjectZip(file, projectSlug);
    setIsProcessing(false);

    if (result.success) {
      setDetectedIndexFiles(result.detectedIndexFiles);
      onZipProcessed({
        hasZip: true,
        zipFileName: result.zipFileName,
        zipFileSize: result.zipFileSize,
        entryPoint: result.recommendedEntryPoint || (result.detectedIndexFiles[0] ?? ''),
        extractedTree: result.fileTree,
      });
    } else {
      setErrorMessage(result.error || 'Failed to process ZIP archive.');
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const isLocalFolder = zipFileName?.startsWith('local_folder://');

  return (
    <div className="space-y-4">
      {/* Upload Box or Status Strip */}
      {!hasZip ? (
        <div className="space-y-3">
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-engineering-cyan bg-cyan-950/30 shadow-tech-cyan'
                : 'border-slate-700/80 hover:border-slate-500 bg-slate-900/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileInputChange}
              accept=".zip"
              className="hidden"
            />

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center mx-auto shadow-sm">
                {isProcessing ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  {isProcessing ? 'Extracting & Analyzing ZIP Hierarchy...' : 'Option 1: Upload or Drag & Drop Project ZIP'}
                </p>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Supports standalone index.html or nested subfolders (e.g. dist/, build/, landing/)
                </p>
              </div>

              <div className="text-[11px] font-mono text-slate-500">
                Safe in-browser extraction • Stored under slug: <span className="text-cyan-400">{projectSlug || '(enter slug above)'}</span>
              </div>
            </div>
          </div>

          {/* Option 2: Direct Local Folder Placement on Disk */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <span>Option 2: Direct Local Folder on Disk (Best for Large 200MB+ Apps)</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Place files in <code className="text-cyan-300">server/data/storage/projects/{projectSlug || '<slug>'}/extracted/</code>
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              icon={isScanningDisk ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FolderOpen className="w-3.5 h-3.5" />}
              disabled={isScanningDisk || !projectSlug.trim()}
              onClick={handleScanDiskFolder}
              className="whitespace-nowrap"
            >
              {isScanningDisk ? 'Scanning...' : 'Scan Local Folder'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active ZIP / Local Folder Summary Strip */}
          <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                {isLocalFolder ? <HardDrive className="w-6 h-6" /> : <FileArchive className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-mono">
                    {isLocalFolder ? `Local Disk Directory: ${projectSlug}` : (zipFileName || 'project_archive.zip')}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <FolderCheck className="w-3 h-3" />
                    {isLocalFolder ? 'Live Disk Directory' : 'Isolated & Extracted'}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  Size: {formatBytes(zipFileSize)} • Entry Point: <code className="text-cyan-300 font-semibold">{entryPoint || 'index.html'}</code>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={isScanningDisk ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                disabled={isScanningDisk}
                onClick={handleScanDiskFolder}
                title="Rescan server directory on disk"
              >
                Rescan Disk
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<Upload className="w-3.5 h-3.5" />}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload ZIP
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                icon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={onClearZip}
              >
                Remove
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileInputChange}
                accept=".zip"
                className="hidden"
              />
            </div>
          </div>

          {/* Multiple Index.html Candidate Selector */}
          {detectedIndexFiles.length > 1 && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Multiple HTML entry candidates detected ({detectedIndexFiles.length})</span>
              </div>
              <p className="text-xs text-slate-300">
                Select the primary entry point to launch when clicking "Run Project":
              </p>
              <select
                value={entryPoint}
                onChange={(e) => onZipProcessed({
                  hasZip: true,
                  zipFileName,
                  zipFileSize,
                  entryPoint: e.target.value,
                  extractedTree,
                })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-amber-500/50 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                {detectedIndexFiles.map((path, idx) => (
                  <option key={idx} value={path}>
                    {path} {idx === 0 ? '(Recommended)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Extracted File Tree Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 uppercase font-semibold">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Project Directory Structure & Assets:
              </span>
              <span className="text-[11px] text-slate-500">
                Click any HTML file to set as active entry point
              </span>
            </div>

            <FileTreeViewer
              nodes={extractedTree}
              selectedEntryPoint={entryPoint}
              onSelectEntryPoint={(newEntry) => {
                onZipProcessed({
                  hasZip: true,
                  zipFileName,
                  zipFileSize,
                  entryPoint: newEntry,
                  extractedTree,
                });
              }}
            />
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-start gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
