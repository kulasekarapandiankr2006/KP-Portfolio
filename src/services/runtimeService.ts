import type { ExtractedFileNode } from '../types/project';

const RUNTIME_HOST = import.meta.env.DEV ? 'http://localhost:5000' : '';

export interface RuntimeHealthResponse {
  status: 'ok' | 'error';
  port?: number;
  timestamp?: string;
  error?: string;
}

export interface ScanProjectResult {
  exists: boolean;
  projectSlug: string;
  diskPath?: string;
  totalFiles: number;
  totalSize: number;
  detectedIndexFiles: string[];
  recommendedEntryPoint?: string;
  fileTree: ExtractedFileNode[];
  message?: string;
}

export const runtimeService = {
  /**
   * Checks if the local Express runtime server is active on port 5000
   */
  async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${RUNTIME_HOST}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) return false;
      const data = await res.json();
      return data.status === 'ok';
    } catch {
      return false;
    }
  },

  /**
   * Constructs the canonical runtime URL for a project and its selected entry point
   */
  getProjectRuntimeUrl(projectSlug: string, entryPoint: string = 'index.html'): string {
    const cleanEntry = entryPoint.replace(/^\/+/, '') || 'index.html';
    return `${RUNTIME_HOST}/runtime/${projectSlug}/${cleanEntry}`;
  },

  /**
   * Automatically initializes the local project directory on disk:
   * server/data/storage/projects/<slug>/
   */
  async createProject(projectSlug: string): Promise<{ success: boolean; diskPath?: string; error?: string }> {
    try {
      const res = await fetch(`${RUNTIME_HOST}/api/runtime/create-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: projectSlug }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { success: false, error: data.error || 'Failed to create project folder' };
      }
      const data = await res.json();
      return { success: true, diskPath: data.diskPath };
    } catch (e: any) {
      return { success: false, error: e.message || 'Server connection error' };
    }
  },

  /**
   * Checks if the Express server already has project files on disk for this slug
   */
  async checkServerHasProject(projectSlug: string): Promise<boolean> {
    try {
      const scan = await this.scanServerProject(projectSlug);
      return scan.exists && scan.totalFiles > 0;
    } catch {
      return false;
    }
  },

  /**
   * Scans the on-disk directory in server/data/storage/projects/<slug>/
   * Detects all index.html entry candidates, file sizes, and builds the file tree.
   */
  async scanServerProject(projectSlug: string): Promise<ScanProjectResult> {
    try {
      const res = await fetch(`${RUNTIME_HOST}/api/runtime/scan/${projectSlug}`);
      if (!res.ok) {
        return {
          exists: false,
          projectSlug,
          totalFiles: 0,
          totalSize: 0,
          detectedIndexFiles: [],
          fileTree: [],
        };
      }
      return await res.json();
    } catch {
      return {
        exists: false,
        projectSlug,
        totalFiles: 0,
        totalSize: 0,
        detectedIndexFiles: [],
        fileTree: [],
      };
    }
  },

  /**
   * Ensures that a project is available on the Express runtime server
   */
  async ensureProjectReady(projectSlug: string): Promise<boolean> {
    const isHealthy = await this.checkHealth();
    if (!isHealthy) return false;
    return await this.checkServerHasProject(projectSlug);
  },

  /**
   * Deletes a project from the Express runtime server on disk
   */
  async deleteProjectOnServer(projectSlug: string): Promise<void> {
    try {
      await fetch(`${RUNTIME_HOST}/api/runtime/${projectSlug}`, { method: 'DELETE' });
    } catch {
      // Best effort deletion
    }
  }
};
