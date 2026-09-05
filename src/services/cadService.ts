// IndexedDB service for storing and retrieving real CAD file attachments

const DB_NAME = 'kp_portfolio_cad_blobs_v1';
const CAD_STORE = 'cad_files';

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(CAD_STORE)) {
        db.createObjectStore(CAD_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredCadFile {
  id: string;
  mechSlug: string;
  name: string;
  format: string;
  size: string;
  blob: Blob;
  updatedAt: string;
}

export const cadService = {
  /**
   * Saves an actual uploaded CAD file blob to IndexedDB isolated by mechanical slug & file ID
   */
  async saveCadFile(mechSlug: string, fileId: string, file: File): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction(CAD_STORE, 'readwrite');
      const store = tx.objectStore(CAD_STORE);
      const storageKey = `cad_${mechSlug}_${fileId}`;

      const data: StoredCadFile = {
        id: fileId,
        mechSlug,
        name: file.name,
        format: this.detectFormat(file.name),
        size: this.formatFileSize(file.size),
        blob: file,
        updatedAt: new Date().toISOString(),
      };

      store.put(data, storageKey);

      await new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('Failed to save CAD file to IndexedDB:', e);
    }
  },

  /**
   * Retrieves the stored CAD file for a specific mechanical design
   */
  async getCadFile(mechSlug: string, fileId: string): Promise<StoredCadFile | null> {
    try {
      const db = await getDB();
      const tx = db.transaction(CAD_STORE, 'readonly');
      const store = tx.objectStore(CAD_STORE);
      const storageKey = `cad_${mechSlug}_${fileId}`;
      const request = store.get(storageKey);

      return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      });
    } catch (e) {
      console.error('Error fetching CAD file from IndexedDB:', e);
      return null;
    }
  },

  /**
   * Deletes an individual CAD file attachment
   */
  async deleteCadFile(mechSlug: string, fileId: string): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction(CAD_STORE, 'readwrite');
      const store = tx.objectStore(CAD_STORE);
      const storageKey = `cad_${mechSlug}_${fileId}`;
      store.delete(storageKey);
    } catch (e) {
      console.warn('Error deleting CAD file from IndexedDB:', e);
    }
  },

  /**
   * Deletes all CAD files belonging to a mechanical design slug
   */
  async deleteMechanicalCadFiles(mechSlug: string): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction(CAD_STORE, 'readwrite');
      const store = tx.objectStore(CAD_STORE);
      const request = store.getAllKeys();

      request.onsuccess = () => {
        const keys = request.result as string[];
        const prefix = `cad_${mechSlug}_`;
        for (const key of keys) {
          if (typeof key === 'string' && key.startsWith(prefix)) {
            store.delete(key);
          }
        }
      };
    } catch (e) {
      console.warn('Error deleting CAD files for slug from IndexedDB:', e);
    }
  },

  detectFormat(fileName: string): 'STEP' | 'IGES' | 'STL' | 'SLDPRT' | 'SLDASM' | 'F3D' | 'PDF' {
    const ext = fileName.split('.').pop()?.toUpperCase() || '';
    if (ext === 'STEP' || ext === 'STP') return 'STEP';
    if (ext === 'IGES' || ext === 'IGS') return 'IGES';
    if (ext === 'STL') return 'STL';
    if (ext === 'SLDPRT') return 'SLDPRT';
    if (ext === 'SLDASM') return 'SLDASM';
    if (ext === 'F3D') return 'F3D';
    if (ext === 'PDF') return 'PDF';
    return 'STEP';
  },

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
};
