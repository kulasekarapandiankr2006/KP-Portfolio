// Service for managing Mechanical CAD files and thumbnails directly on the local filesystem
// Storage convention:
// server/data/storage/mechanical-designs/<slug>/files/
// server/data/storage/mechanical-designs/<slug>/thumbnail/<slug>.png

const RUNTIME_HOST = 'http://localhost:5000';

export interface ScannedCadFile {
  id: string;
  name: string;
  format: string;
  size: string;
  sizeBytes?: number;
  downloadUrl: string;
  description?: string;
}

export interface ScanMechanicalResult {
  exists: boolean;
  slug: string;
  cadFiles: ScannedCadFile[];
  hasThumbnail: boolean;
  thumbnailFileName?: string;
  thumbnailUrl: string | null;
  filesDir?: string;
  thumbnailDir?: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export const cadFilesystemService = {
  /**
   * Initializes mechanical design folders on disk:
   * server/data/storage/mechanical-designs/<slug>/files/
   * server/data/storage/mechanical-designs/<slug>/thumbnail/
   */
  async initMechanicalDesign(slug: string): Promise<{ success: boolean; filesDir?: string; thumbnailDir?: string }> {
    try {
      const res = await fetch(`${RUNTIME_HOST}/api/mechanical/init/${encodeURIComponent(slug)}`, {
        method: 'POST',
      });
      if (!res.ok) return { success: false };
      return await res.json();
    } catch (e) {
      console.warn(`[cadFilesystemService] Init failed for ${slug}:`, e);
      return { success: false };
    }
  },

  /**
   * Scans mechanical design directory on disk for manually placed or uploaded CAD files & thumbnails
   */
  async scanMechanicalDesign(slug: string): Promise<ScanMechanicalResult> {
    try {
      const res = await fetch(`${RUNTIME_HOST}/api/mechanical/scan/${encodeURIComponent(slug)}`);
      if (!res.ok) {
        return {
          exists: false,
          slug,
          cadFiles: [],
          hasThumbnail: false,
          thumbnailUrl: null,
        };
      }
      return await res.json();
    } catch {
      return {
        exists: false,
        slug,
        cadFiles: [],
        hasThumbnail: false,
        thumbnailUrl: null,
      };
    }
  },

  /**
   * Uploads a real CAD file to server/data/storage/mechanical-designs/<slug>/files/<filename>
   */
  async uploadCadFile(slug: string, file: File): Promise<{ success: boolean; fileName?: string; size?: string; error?: string }> {
    try {
      const base64Content = await fileToBase64(file);
      const res = await fetch(`${RUNTIME_HOST}/api/mechanical/upload-cad/${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileContent: base64Content,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return { success: false, error: (errData as any).error || 'Failed to upload CAD file' };
      }
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Error uploading CAD file' };
    }
  },

  /**
   * Deletes a CAD file from server/data/storage/mechanical-designs/<slug>/files/<filename>
   */
  async deleteCadFile(slug: string, filename: string): Promise<boolean> {
    try {
      const res = await fetch(
        `${RUNTIME_HOST}/api/mechanical/${encodeURIComponent(slug)}/file/${encodeURIComponent(filename)}`,
        { method: 'DELETE' }
      );
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Uploads a thumbnail to server/data/storage/mechanical-designs/<slug>/thumbnail/<slug>.png
   */
  async uploadThumbnail(slug: string, file: File): Promise<{ success: boolean; thumbnailUrl?: string; error?: string }> {
    try {
      const base64Content = await fileToBase64(file);
      const res = await fetch(`${RUNTIME_HOST}/api/mechanical/upload-thumbnail/${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageContent: base64Content }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return { success: false, error: (errData as any).error || 'Failed to upload thumbnail' };
      }
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Error uploading thumbnail' };
    }
  },

  /**
   * Returns canonical thumbnail URL from Express runtime
   */
  getThumbnailUrl(slug: string): string {
    return `${RUNTIME_HOST}/api/mechanical/${encodeURIComponent(slug)}/thumbnail`;
  },

  /**
   * Returns canonical CAD file download URL
   */
  getCadDownloadUrl(slug: string, filename: string): string {
    return `${RUNTIME_HOST}/api/mechanical/${encodeURIComponent(slug)}/file/${encodeURIComponent(filename)}`;
  }
};
