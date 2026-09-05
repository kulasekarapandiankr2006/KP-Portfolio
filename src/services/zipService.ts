import JSZip from 'jszip';
import type { ExtractedFileNode } from '../types/project';

export interface ZipProcessingResult {
  success: boolean;
  zipFileName: string;
  zipFileSize: number;
  extractedFileCount: number;
  fileTree: ExtractedFileNode[];
  detectedIndexFiles: string[];
  recommendedEntryPoint?: string;
  error?: string;
}

// Simple IndexedDB wrapper for isolated project ZIP blobs and extracted file buffers
const DB_NAME = 'kp_portfolio_project_blobs_v1';
const ZIP_STORE = 'original_zips';
const FILES_STORE = 'extracted_files';

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(ZIP_STORE)) {
        db.createObjectStore(ZIP_STORE);
      }
      if (!db.objectStoreNames.contains(FILES_STORE)) {
        db.createObjectStore(FILES_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const zipService = {
  /**
   * Processes an uploaded project ZIP file:
   * 1. Validates safety (rejects path traversal '../').
   * 2. Extracts file hierarchy.
   * 3. Detects all index.html files.
   * 4. Persists the original ZIP blob and extracted files in IndexedDB isolated to projectSlug.
   * 5. Syncs files to the local Express runtime server on disk.
   */
  async processProjectZip(file: File, projectSlug: string): Promise<ZipProcessingResult> {
    try {
      if (!file.name.toLowerCase().endsWith('.zip')) {
        return {
          success: false,
          zipFileName: file.name,
          zipFileSize: file.size,
          extractedFileCount: 0,
          fileTree: [],
          detectedIndexFiles: [],
          error: 'Uploaded file is not a valid .zip archive.',
        };
      }

      const arrayBuffer = await file.arrayBuffer();
      const zip = new JSZip();
      const unzipped = await zip.loadAsync(arrayBuffer);

      const filesMap: Record<string, Uint8Array> = {};
      const detectedIndexFiles: string[] = [];
      const relativePaths: string[] = [];

      // Validate entries and extract paths
      const entries = Object.keys(unzipped.files);
      if (entries.length === 0) {
        return {
          success: false,
          zipFileName: file.name,
          zipFileSize: file.size,
          extractedFileCount: 0,
          fileTree: [],
          detectedIndexFiles: [],
          error: 'The uploaded ZIP archive is empty.',
        };
      }

      for (const relativePath of entries) {
        // Path Traversal Security Check
        if (relativePath.includes('..') || relativePath.startsWith('/') || relativePath.startsWith('\\')) {
          return {
            success: false,
            zipFileName: file.name,
            zipFileSize: file.size,
            extractedFileCount: 0,
            fileTree: [],
            detectedIndexFiles: [],
            error: `Security violation: Archive contains unsafe path traversal reference (${relativePath}).`,
          };
        }

        const zipEntry = unzipped.files[relativePath];
        if (!zipEntry.dir) {
          relativePaths.push(relativePath);
          const content = await zipEntry.async('uint8array');
          filesMap[relativePath] = content;

          // Check if file is index.html
          const baseName = relativePath.split('/').pop()?.toLowerCase();
          if (baseName === 'index.html' || baseName === 'index.htm') {
            detectedIndexFiles.push(relativePath);
          }
        }
      }

      // Build structured File Tree hierarchy
      const fileTree = this.buildFileTree(entries, unzipped);

      // Determine recommended entry point
      let recommendedEntryPoint: string | undefined = undefined;
      if (detectedIndexFiles.length === 1) {
        recommendedEntryPoint = detectedIndexFiles[0];
      } else if (detectedIndexFiles.length > 1) {
        // Sort by path depth to prefer shallowest (e.g. "index.html" or "dist/index.html")
        const sorted = [...detectedIndexFiles].sort((a, b) => {
          const depthA = a.split('/').length;
          const depthB = b.split('/').length;
          return depthA - depthB;
        });
        recommendedEntryPoint = sorted[0];
      }

      // 1. Save raw ZIP and extracted files to isolated project storage in IndexedDB
      await this.saveProjectFiles(projectSlug, file, filesMap);

      // 2. Sync files to Express runtime server on port 5000 (disk storage bridge)
      this.syncToServer(projectSlug, filesMap).catch((err) => {
        console.warn(`[ZipService] Server sync notice for ${projectSlug}:`, err);
      });

      return {
        success: true,
        zipFileName: file.name,
        zipFileSize: file.size,
        extractedFileCount: relativePaths.length,
        fileTree,
        detectedIndexFiles,
        recommendedEntryPoint,
      };
    } catch (e: any) {
      console.error('ZIP extraction error:', e);
      return {
        success: false,
        zipFileName: file.name,
        zipFileSize: file.size,
        extractedFileCount: 0,
        fileTree: [],
        detectedIndexFiles: [],
        error: `ZIP extraction failed: ${e.message || 'Corrupted or unreadable archive.'}`,
      };
    }
  },

  /**
   * Helper to sync in-memory filesMap to Express runtime server
   */
  async syncToServer(projectSlug: string, filesMap: Record<string, Uint8Array>): Promise<void> {
    try {
      const payloadFiles: Record<string, string> = {};
      for (const [relativePath, buffer] of Object.entries(filesMap)) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        payloadFiles[relativePath] = `base64:${btoa(binary)}`;
      }

      await fetch(`http://localhost:5000/api/runtime/sync/${projectSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: payloadFiles }),
      });
    } catch (e) {
      console.warn('Express runtime server sync deferred:', e);
    }
  },

  /**
   * Builds an ExtractedFileNode tree from JSZip entries
   */
  buildFileTree(paths: string[], zip: JSZip): ExtractedFileNode[] {
    const rootNodes: ExtractedFileNode[] = [];
    const dirMap: Record<string, ExtractedFileNode> = {};

    // Sort paths so parents are processed first
    const sortedPaths = [...paths].sort();

    for (const rawPath of sortedPaths) {
      // Normalize slashes and remove trailing slash
      const cleanPath = rawPath.replace(/\\/g, '/');
      const isDir = cleanPath.endsWith('/') || zip.files[rawPath]?.dir;
      const normalizedPath = isDir ? cleanPath.replace(/\/$/, '') : cleanPath;
      
      if (!normalizedPath) continue;

      const segments = normalizedPath.split('/');
      const fileName = segments[segments.length - 1];
      const ext = !isDir && fileName.includes('.') ? fileName.split('.').pop() : undefined;

      const entryObj = zip.files[rawPath] as any;
      const uncompressedSize: number | undefined = entryObj?._data?.uncompressedSize;

      const node: ExtractedFileNode = {
        name: fileName,
        path: normalizedPath,
        type: isDir ? 'directory' : 'file',
        size: isDir ? undefined : uncompressedSize,
        extension: ext,
        isEntryCandidate: fileName.toLowerCase() === 'index.html',
        children: isDir ? [] : undefined,
      };

      if (isDir) {
        dirMap[normalizedPath] = node;
      }

      if (segments.length === 1) {
        rootNodes.push(node);
      } else {
        const parentPath = segments.slice(0, -1).join('/');
        const parentNode = dirMap[parentPath];
        if (parentNode && parentNode.children) {
          parentNode.children.push(node);
        } else {
          rootNodes.push(node);
        }
      }
    }

    return rootNodes;
  },

  /**
   * Persists original ZIP file and extracted files into IndexedDB under an isolated key
   */
  async saveProjectFiles(projectSlug: string, originalZip: File, filesMap: Record<string, Uint8Array>): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction([ZIP_STORE, FILES_STORE], 'readwrite');
      
      const zipStore = tx.objectStore(ZIP_STORE);
      const filesStore = tx.objectStore(FILES_STORE);

      zipStore.put(originalZip, `zip_${projectSlug}`);
      filesStore.put(filesMap, `files_${projectSlug}`);

      await new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('Failed to write project files to IndexedDB', e);
    }
  },

  /**
   * Retrieves the original uploaded ZIP file for a project
   */
  async getOriginalZipBlob(projectSlug: string): Promise<Blob | null> {
    try {
      const db = await getDB();
      const tx = db.transaction([ZIP_STORE], 'readonly');
      const store = tx.objectStore(ZIP_STORE);
      const request = store.get(`zip_${projectSlug}`);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          resolve(request.result || null);
        };
        request.onerror = () => resolve(null);
      });
    } catch (e) {
      console.error('Error fetching ZIP blob', e);
      return null;
    }
  },

  /**
   * Retrieves extracted files map for an isolated project
   */
  async getExtractedFiles(projectSlug: string): Promise<Record<string, Uint8Array> | null> {
    try {
      const db = await getDB();
      const tx = db.transaction([FILES_STORE], 'readonly');
      const store = tx.objectStore(FILES_STORE);
      const request = store.get(`files_${projectSlug}`);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          resolve(request.result || null);
        };
        request.onerror = () => resolve(null);
      });
    } catch (e) {
      console.error('Error fetching extracted files', e);
      return null;
    }
  },

  /**
   * Deletes all isolated ZIP and extracted files for a project
   */
  async deleteProjectStorage(projectSlug: string): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction([ZIP_STORE, FILES_STORE], 'readwrite');
      tx.objectStore(ZIP_STORE).delete(`zip_${projectSlug}`);
      tx.objectStore(FILES_STORE).delete(`files_${projectSlug}`);

      // Delete from Express server as well
      fetch(`http://localhost:5000/api/runtime/${projectSlug}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {
      console.warn('Error deleting project storage from IndexedDB', e);
    }
  }
};
