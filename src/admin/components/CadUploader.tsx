import React, { useState, useRef, useEffect } from 'react';
import { cadFilesystemService } from '../../services/cadFilesystemService';
import type { CADFileAttachment } from '../../types/mechanical';
import { Button } from '../../components/common/Button';
import { 
  Upload, 
  FileCode, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  RefreshCw,
  HardDrive
} from 'lucide-react';

interface CadUploaderProps {
  mechSlug: string;
  cadFiles: CADFileAttachment[];
  onChange: (files: CADFileAttachment[]) => void;
}

export const CadUploader: React.FC<CadUploaderProps> = ({
  mechSlug,
  cadFiles,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Scan disk on mount / slug change (read-only — do NOT create folders here)
  // Folder creation only happens on actual file upload or on form submit
  useEffect(() => {
    if (mechSlug) {
      handleScanDisk();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mechSlug]);

  const handleScanDisk = async () => {
    if (!mechSlug) return;
    setScanning(true);
    try {
      const scanRes = await cadFilesystemService.scanMechanicalDesign(mechSlug);
      if (scanRes.exists && scanRes.cadFiles.length > 0) {
        // Merge disk files with existing attachments (deduplicate by name)
        const merged: CADFileAttachment[] = [...cadFiles];
        for (const diskFile of scanRes.cadFiles) {
          if (!merged.some(f => f.name.toLowerCase() === diskFile.name.toLowerCase())) {
            merged.push({
              id: diskFile.id,
              name: diskFile.name,
              format: diskFile.format,
              size: diskFile.size,
              description: `Filesystem CAD Model (${diskFile.format})`,
            });
          }
        }
        if (merged.length !== cadFiles.length) {
          onChange(merged);
        }
      }
    } catch (e) {
      console.warn('CAD scan error:', e);
    } finally {
      setScanning(false);
    }
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setUploading(true);

    const validExtensions = ['.step', '.stp', '.iges', '.igs', '.stl', '.sldprt', '.sldasm', '.f3d', '.pdf', '.dxf', '.zip'];
    const newAttachments: CADFileAttachment[] = [...cadFiles];
    let addedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = '.' + (file.name.split('.').pop()?.toLowerCase() || '');

      if (!validExtensions.includes(ext)) {
        setErrorMsg(`Unsupported file type: ${file.name}. Supported: STEP, STP, IGES, IGS, STL, SLDPRT, SLDASM, F3D, PDF, DXF, ZIP.`);
        continue;
      }

      const fileId = `cad-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const rawExt = (file.name.split('.').pop() || '').toUpperCase();
      const format = rawExt || 'CAD';
      const bytes = file.size;
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const sizeIdx = bytes === 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(k));
      const size = bytes === 0 ? '0 B' : parseFloat((bytes / Math.pow(k, sizeIdx)).toFixed(1)) + ' ' + sizes[sizeIdx];

      // Ensure folder exists and upload file (init is safe to call here — only on actual upload)
      if (mechSlug) {
        await cadFilesystemService.initMechanicalDesign(mechSlug);
        await cadFilesystemService.uploadCadFile(mechSlug, file);
      }

      // Add to list if not already there (deduplicate by name)
      if (!newAttachments.some(f => f.name.toLowerCase() === file.name.toLowerCase())) {
        newAttachments.push({
          id: fileId,
          name: file.name,
          format,
          size,
          description: `Uploaded CAD Model (${format})`,
        });
      }
      addedCount++;
    }

    onChange(newAttachments);
    setUploading(false);

    if (addedCount > 0) {
      setSuccessMsg(`Successfully saved ${addedCount} CAD file${addedCount > 1 ? 's' : ''} to local filesystem!`);
      setTimeout(() => setSuccessMsg(null), 3500);
    }
  };

  const handleRemove = async (fileId: string, fileName: string) => {
    if (mechSlug) {
      await cadFilesystemService.deleteCadFile(mechSlug, fileName);
    }
    const updated = cadFiles.filter(f => f.id !== fileId);
    onChange(updated);
  };

  const handleTestDownload = (_fileId: string, fileName: string) => {
    if (mechSlug) {
      const downloadUrl = cadFilesystemService.getCadDownloadUrl(mechSlug, fileName);
      window.open(downloadUrl, '_blank');
    }
  };

  const handleDescriptionChange = (fileId: string, desc: string) => {
    const updated = cadFiles.map(f => f.id === fileId ? { ...f, description: desc } : f);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Filesystem info bar */}
      {mechSlug && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Files directory: <code className="text-amber-300">server/data/storage/mechanical-designs/{mechSlug}/files/</code>
            </span>
          </div>
          <button
            type="button"
            onClick={handleScanDisk}
            disabled={scanning}
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Scanning...' : 'Scan Disk'}</span>
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFilesSelected(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-amber-400 bg-amber-950/20'
            : 'border-slate-700/80 bg-slate-900/50 hover:border-amber-500/50 hover:bg-slate-900'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".step,.stp,.iges,.igs,.stl,.sldprt,.sldasm,.f3d,.pdf,.dxf,.zip"
          className="hidden"
          onChange={(e) => handleFilesSelected(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-white">
              {uploading ? 'Uploading to Filesystem...' : 'Click to Browse or Drag & Drop CAD Files'}
            </span>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Supports: <code className="text-amber-300">.STEP</code>, <code className="text-amber-300">.STP</code>, <code className="text-amber-300">.IGES</code>, <code className="text-amber-300">.STL</code>, <code className="text-amber-300">.SLDPRT</code>, <code className="text-amber-300">.SLDASM</code>, <code className="text-amber-300">.F3D</code>, <code className="text-amber-300">.PDF</code>, <code className="text-amber-300">.DXF</code>
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Attached Files List */}
      <div className="space-y-2 pt-2">
        <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>CAD Files ({cadFiles.length})</span>
          <span className="text-[11px] font-normal text-amber-400">Stored on Local Filesystem</span>
        </div>

        {cadFiles.length === 0 ? (
          <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800 text-center text-xs font-mono text-slate-500">
            No CAD files attached yet. Upload above or manually copy files into the directory shown.
          </div>
        ) : (
          <div className="space-y-2">
            {cadFiles.map((file) => (
              <div
                key={file.id}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded bg-slate-800 text-amber-400 flex-shrink-0">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white truncate max-w-xs">
                        {file.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30 flex-shrink-0">
                        {file.format}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                      <FileCheck className="w-3 h-3 text-emerald-400" />
                      <span>{file.size}</span>
                      <span>•</span>
                      <input
                        type="text"
                        value={file.description || ''}
                        onChange={(e) => handleDescriptionChange(file.id, e.target.value)}
                        placeholder="Description (e.g. Production 3D Model)"
                        className="bg-transparent border-b border-slate-700 text-slate-300 focus:outline-none focus:border-amber-400 text-[11px] px-1 py-0.5 w-48 truncate"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    icon={<Download className="w-3.5 h-3.5" />}
                    onClick={() => handleTestDownload(file.id, file.name)}
                    className="text-amber-300 border-amber-500/30 hover:border-amber-400"
                  >
                    Download
                  </Button>

                  <button
                    type="button"
                    onClick={() => handleRemove(file.id, file.name)}
                    className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                    title="Remove CAD file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
