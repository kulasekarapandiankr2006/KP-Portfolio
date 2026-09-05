import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Root directories for isolated project and mechanical design runtime files
const STORAGE_DIR = path.resolve(__dirname, 'data', 'storage', 'projects');
const MECH_STORAGE_DIR = path.resolve(__dirname, 'data', 'storage', 'mechanical-designs');

// Idempotent directory creation helper
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Ensure base storage directories exist idempotently
ensureDir(STORAGE_DIR);
ensureDir(MECH_STORAGE_DIR);

// CMS JSON data file (authoritative persistence layer)
const CMS_DATA_DIR = path.resolve(__dirname, 'data');
const CMS_DATA_FILE = path.resolve(CMS_DATA_DIR, 'portfolio-cms.json');

function loadCmsData() {
  try {
    if (fs.existsSync(CMS_DATA_FILE)) {
      const raw = fs.readFileSync(CMS_DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.profile && Array.isArray(parsed.projects)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[CMS] Failed to load portfolio-cms.json, will return null:', err.message);
  }
  return null;
}

function saveCmsData(data) {
  ensureDir(CMS_DATA_DIR);
  fs.writeFileSync(CMS_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}
async function syncCmsDataToGitHub(data) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !owner || !repo) {
    console.warn('[GitHub] Sync skipped: GitHub environment variables are missing.');
    return;
  }

  const filePath = 'server/data/portfolio-cms.json';
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };

  let sha;

  const existing = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, {
    headers,
  });

  if (existing.ok) {
    const existingData = await existing.json();
    sha = existingData.sha;
  } else if (existing.status !== 404) {
    throw new Error(`GitHub file lookup failed: ${existing.status}`);
  }

  const content = Buffer
    .from(JSON.stringify(data, null, 2), 'utf8')
    .toString('base64');

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: 'Update portfolio CMS data',
      content,
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub sync failed: ${response.status} ${errorText}`);
  }

  console.log('[GitHub] CMS data synced successfully.');
}

// Safe slug validation helper
function isValidSlug(slug) {
  return typeof slug === 'string' && /^[a-zA-Z0-9_-]+$/.test(slug) && !slug.includes('..');
}

// Enable CORS and high-limit JSON parsing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range'],
  exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length', 'Content-Disposition']
}));

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));

// Allow iframe embedding from localhost:5173
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "frame-ancestors * 'self' http://localhost:5173 http://localhost:5174 http://localhost:5175 http://localhost:5176 http://127.0.0.1:*");
  next();
});

// Comprehensive MIME Type Mapper (including Executables & Large Binaries)
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.dxf': 'application/dxf',
  '.step': 'application/step',
  '.stp': 'application/step',
  '.iges': 'application/iges',
  '.igs': 'application/iges',
  '.stl': 'model/stl',
  // Executables and Archives
  '.exe': 'application/x-msdownload',
  '.msi': 'application/x-msi',
  '.bin': 'application/octet-stream',
  '.iso': 'application/x-iso9660-image',
  '.zip': 'application/zip',
  '.tar': 'application/x-tar',
  '.gz': 'application/gzip',
  '.7z': 'application/x-7z-compressed',
  '.apk': 'application/vnd.android.package-archive',
};

// ============================================================================
// --- CMS DATA PERSISTENCE API ---
// ============================================================================

// GET /api/cms/data — load full portfolio database from server filesystem
app.get('/api/cms/data', (req, res) => {
  try {
    const data = loadCmsData();
    if (data) {
      res.json({ found: true, data });
    } else {
      // No file yet — client will send initialData to seed the server
      res.json({ found: false, data: null });
    }
  } catch (err) {
    console.error('[CMS] GET error:', err);
    res.status(500).json({ error: 'Failed to load CMS data', message: err.message });
  }
});

// POST /api/cms/data — save full portfolio database to server filesystem
app.post('/api/cms/data', async (req, res) => {
  try {
    const body = req.body;
    if (!body || !body.profile || !Array.isArray(body.projects)) {
      return res.status(400).json({ error: 'Invalid CMS data payload' });
    }
    saveCmsData(body);
    await syncCmsDataToGitHub(body);
    res.json({ success: true });
  } catch (err) {
    console.error('[CMS] POST error:', err);
    res.status(500).json({ error: 'Failed to save CMS data', message: err.message });
  }
});

// --- HEALTH CHECK ENDPOINT ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', port: PORT, timestamp: new Date().toISOString() });
});

// --- LIST SYNCED PROJECTS ---
app.get('/api/runtime/projects', (req, res) => {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      return res.json({ projects: [] });
    }
    const slugs = fs.readdirSync(STORAGE_DIR).filter(item => {
      const p = path.join(STORAGE_DIR, item);
      return fs.statSync(p).isDirectory();
    });
    res.json({ projects: slugs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list projects', message: err.message });
  }
});

// --- CHECK IF PROJECT HAS RUNTIME FILES ---
app.get('/api/runtime/check/:projectSlug', (req, res) => {
  const { projectSlug } = req.params;
  const projectRoot = path.join(STORAGE_DIR, projectSlug, 'extracted');
  const exists = fs.existsSync(projectRoot) && fs.readdirSync(projectRoot).length > 0;
  res.json({ exists, projectSlug });
});

// Helper to recursively scan on-disk directory safely
function scanDirectoryOnDisk(dirPath, rootDir, currentDepth = 0) {
  const nodes = [];
  const indexCandidates = [];
  let totalFiles = 0;
  let totalBytes = 0;

  if (currentDepth > 10) return { nodes, indexCandidates, totalFiles, totalBytes };

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    // Sort: directories first, then files alphabetically
    entries.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    for (const entry of entries) {
      // Ignore git and OS metadata
      if (entry.name === '.git' || entry.name === '.DS_Store' || entry.name === 'Thumbs.db') {
        continue;
      }

      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

      if (entry.isDirectory()) {
        const subScan = scanDirectoryOnDisk(fullPath, rootDir, currentDepth + 1);
        totalFiles += subScan.totalFiles;
        totalBytes += subScan.totalBytes;
        indexCandidates.push(...subScan.indexCandidates);

        nodes.push({
          name: entry.name,
          path: relativePath,
          type: 'directory',
          children: subScan.nodes,
        });
      } else if (entry.isFile()) {
        totalFiles += 1;
        let fileSize = 0;
        try {
          const stats = fs.statSync(fullPath);
          fileSize = stats.size;
          totalBytes += stats.size;
        } catch {
          // Ignore stat errors
        }

        const ext = entry.name.includes('.') ? entry.name.split('.').pop() : undefined;
        const isIndex = entry.name.toLowerCase() === 'index.html' || entry.name.toLowerCase() === 'index.htm';
        if (isIndex) {
          indexCandidates.push(relativePath);
        }

        nodes.push({
          name: entry.name,
          path: relativePath,
          type: 'file',
          size: fileSize,
          extension: ext,
          isEntryCandidate: isIndex,
        });
      }
    }
  } catch (err) {
    console.warn(`[Scanner] Error reading directory ${dirPath}:`, err.message);
  }

  return { nodes, indexCandidates, totalFiles, totalBytes };
}

// --- CREATE PROJECT DIRECTORY ON DISK ---
app.post('/api/runtime/create-project', (req, res) => {
  try {
    const slug = req.body?.slug || req.query?.slug;
    if (!isValidSlug(slug)) {
      return res.status(400).json({ error: 'Invalid project slug identifier. Use letters, numbers, hyphens, or underscores.' });
    }

    const projectDir = path.resolve(STORAGE_DIR, slug);
    ensureDir(projectDir);

    res.json({
      success: true,
      slug,
      diskPath: projectDir,
      message: `Project folder ready at ${projectDir}`
    });
  } catch (err) {
    console.error('Error creating project directory:', err);
    res.status(500).json({ error: 'Failed to create project folder', message: err.message });
  }
});

// --- SCAN LOCAL ON-DISK PROJECT DIRECTORY ---
// Supports files placed directly in projects/<slug>/ or nested (e.g. landing/ or legacy extracted/)
app.get('/api/runtime/scan/:projectSlug', (req, res) => {
  try {
    const { projectSlug } = req.params;
    if (!isValidSlug(projectSlug)) {
      return res.status(400).json({ error: 'Invalid project slug identifier' });
    }

    const projectDir = path.resolve(STORAGE_DIR, projectSlug);

    if (!fs.existsSync(projectDir) || fs.readdirSync(projectDir).length === 0) {
      return res.json({
        exists: false,
        projectSlug,
        totalFiles: 0,
        totalSize: 0,
        detectedIndexFiles: [],
        fileTree: [],
        message: `No files found at: ${projectDir}`
      });
    }

    const scanResult = scanDirectoryOnDisk(projectDir, projectDir);

    // Pick recommended entry point (shallowest index.html / index.htm)
    let recommendedEntryPoint = '';
    if (scanResult.indexCandidates.length > 0) {
      const sorted = [...scanResult.indexCandidates].sort((a, b) => a.split('/').length - b.split('/').length);
      recommendedEntryPoint = sorted[0];
    }

    res.json({
      exists: true,
      projectSlug,
      diskPath: projectDir,
      totalFiles: scanResult.totalFiles,
      totalSize: scanResult.totalBytes,
      detectedIndexFiles: scanResult.indexCandidates,
      recommendedEntryPoint,
      fileTree: scanResult.nodes,
    });
  } catch (err) {
    console.error('Error scanning project directory:', err);
    res.status(500).json({ error: 'Failed to scan project directory', message: err.message });
  }
});

// --- SYNC / STORE PROJECT FILES BRIDGE ---
app.post('/api/runtime/sync/:projectSlug', (req, res) => {
  try {
    const { projectSlug } = req.params;
    if (!/^[a-zA-Z0-9_-]+$/.test(projectSlug)) {
      return res.status(400).json({ error: 'Invalid project slug identifier' });
    }

    const { files } = req.body;
    if (!files || typeof files !== 'object') {
      return res.status(400).json({ error: 'Files payload is required' });
    }

    const projectExtractedDir = path.join(STORAGE_DIR, projectSlug, 'extracted');

    // Clean or create target directory
    if (!fs.existsSync(projectExtractedDir)) {
      fs.mkdirSync(projectExtractedDir, { recursive: true });
    }

    let writtenCount = 0;

    for (const [relativePath, content] of Object.entries(files)) {
      // Security Check: Path Traversal
      const normalizedRelative = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
      if (relativePath.includes('..') || path.isAbsolute(relativePath)) {
        console.warn(`[Security] Rejected unsafe path in sync: ${relativePath}`);
        continue;
      }

      const filePath = path.resolve(projectExtractedDir, normalizedRelative);

      // Verify filePath stays inside projectExtractedDir
      if (!filePath.startsWith(projectExtractedDir + path.sep) && filePath !== projectExtractedDir) {
        console.warn(`[Security] Traversal boundary violation: ${filePath}`);
        continue;
      }

      // Ensure subdirectories exist
      const fileDir = path.dirname(filePath);
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }

      // Write file (handle base64 or text)
      if (typeof content === 'string') {
        if (content.startsWith('base64:')) {
          const buffer = Buffer.from(content.substring(7), 'base64');
          fs.writeFileSync(filePath, buffer);
        } else {
          fs.writeFileSync(filePath, content, 'utf8');
        }
        writtenCount++;
      }
    }

    res.json({
      success: true,
      projectSlug,
      filesWritten: writtenCount,
      runtimePath: `/runtime/${projectSlug}/`
    });
  } catch (err) {
    console.error('Error syncing project runtime:', err);
    res.status(500).json({ error: 'Failed to write project files', message: err.message });
  }
});

// --- DELETE PROJECT RUNTIME ---
app.delete('/api/runtime/:projectSlug', (req, res) => {
  try {
    const { projectSlug } = req.params;
    const projectDir = path.join(STORAGE_DIR, projectSlug);
    if (fs.existsSync(projectDir)) {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }
    res.json({ success: true, deleted: projectSlug });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project runtime', message: err.message });
  }
});

// --- RUNTIME STATIC SERVING ROUTE (Supports Range Streaming for .EXE and Media Files) ---
// Handles GET /runtime/:projectSlug/*
app.use('/runtime/:projectSlug', (req, res) => {
  const { projectSlug } = req.params;

  // 1. Validate project slug format
  if (!isValidSlug(projectSlug)) {
    return res.status(400).send('Invalid project slug identifier.');
  }

  const projectDir = path.resolve(STORAGE_DIR, projectSlug);

  // Check if project exists on disk
  if (!fs.existsSync(projectDir)) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
        <head><title>404 - Project Not Found</title></head>
        <body style="background:#0b0f19; color:#94a3b8; font-family:monospace; padding:40px; text-align:center;">
          <h2 style="color:#f43f5e;">404 - Runtime Project Not Found</h2>
          <p>No project files found on disk for project: <strong style="color:#38bdf8;">${projectSlug}</strong></p>
          <p style="font-size:12px; color:#64748b;">Place files in <code>server/data/storage/projects/${projectSlug}/</code></p>
        </body>
      </html>
    `);
  }

  // 2. Resolve relative path inside project
 let rawRelativePath = (req.path || '').replace(/^\/+/, '');

if (rawRelativePath.includes('?')) {
  rawRelativePath = rawRelativePath.split('?')[0];
}

try {
  rawRelativePath = decodeURIComponent(rawRelativePath);
} catch (err) {
  return res.status(400).send('Bad Request: Invalid URL encoding.');
}

const normalizedRelative = path.normalize(rawRelativePath);

  // 3. Resolve target file with candidate paths (direct, extracted, landing)
  let finalPath = null;

  if (!rawRelativePath) {
    // Empty path: discover index.html
    const indexCandidates = [
      path.join(projectDir, 'index.html'),
      path.join(projectDir, 'index.htm'),
      path.join(projectDir, 'landing', 'index.html'),
      path.join(projectDir, 'extracted', 'landing', 'index.html'),
      path.join(projectDir, 'extracted', 'index.html'),
    ];
    for (const candidate of indexCandidates) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        finalPath = candidate;
        break;
      }
    }
    if (!finalPath) {
      const scan = scanDirectoryOnDisk(projectDir, projectDir);
      if (scan.indexCandidates.length > 0) {
        const sorted = [...scan.indexCandidates].sort((a, b) => a.split('/').length - b.split('/').length);
        finalPath = path.resolve(projectDir, sorted[0]);
      }
    }
  } else {
    // Check candidate resolution paths
    const candidates = [
      path.resolve(projectDir, normalizedRelative),
      path.resolve(projectDir, 'extracted', normalizedRelative),
      path.resolve(projectDir, 'landing', normalizedRelative),
      path.resolve(projectDir, 'extracted', 'landing', normalizedRelative),
    ];

    for (const candidate of candidates) {
      // Strict Path Traversal Check (MANDATORY)
      if (candidate.startsWith(projectDir + path.sep) && fs.existsSync(candidate)) {
        if (fs.statSync(candidate).isDirectory()) {
          const defaultIndex = path.join(candidate, 'index.html');
          if (fs.existsSync(defaultIndex) && fs.statSync(defaultIndex).isFile()) {
            finalPath = defaultIndex;
            break;
          }
        } else {
          finalPath = candidate;
          break;
        }
      }
    }
  }

  // Strict Path Traversal Check verification
  if (finalPath && (!finalPath.startsWith(projectDir + path.sep) && finalPath !== projectDir)) {
    console.warn(`[Security Alert] Traversal attempt blocked: slug=${projectSlug}, requested=${rawRelativePath}, target=${finalPath}`);
    return res.status(403).send('Forbidden: Path traversal is strictly prohibited.');
  }

  // 4. File existence check
  if (!finalPath || !fs.existsSync(finalPath) || fs.statSync(finalPath).isDirectory()) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
        <head><title>404 - File Not Found</title></head>
        <body style="background:#0b0f19; color:#94a3b8; font-family:monospace; padding:40px; text-align:center;">
          <h2 style="color:#f43f5e;">404 - File Not Found</h2>
          <p>The requested file does not exist in project <strong style="color:#38bdf8;">${projectSlug}</strong>: <code style="color:#f59e0b;">${rawRelativePath}</code></p>
        </body>
      </html>
    `);
  }

  // 6. High-Performance Streaming with Range Header Support for Large Files (.exe, video, etc.)
  try {
    const stat = fs.statSync(finalPath);
    const fileSize = stat.size;
    const ext = path.extname(finalPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const range = req.headers.range;

    // Force download (Content-Disposition: attachment) for binary/executable types
    const DOWNLOAD_EXTS = new Set(['.exe', '.msi', '.bin', '.iso', '.7z', '.apk', '.dmg', '.pkg']);
    const fileName = path.basename(finalPath);
    const isDownloadType = DOWNLOAD_EXTS.has(ext);
    // RFC 5987: encode filename* for correct handling of spaces and non-ASCII chars
    const encodedFileName = encodeURIComponent(fileName).replace(/['()]/g, escape).replace(/\*/g, '%2A');
    const contentDisposition = isDownloadType
      ? `attachment; filename="${fileName}"; filename*=UTF-8''${encodedFileName}`
      : undefined;

    // Handle Range Requests (resumable downloads for 200MB+ binaries)
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
        return;
      }

      const chunksize = (end - start) + 1;
      const fileStream = fs.createReadStream(finalPath, { start, end });
      const rangeHeaders = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      };
      if (contentDisposition) rangeHeaders['Content-Disposition'] = contentDisposition;
      res.writeHead(206, rangeHeaders);
      fileStream.pipe(res);
    } else {
      const headers = {
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
      };
      if (contentDisposition) headers['Content-Disposition'] = contentDisposition;
      res.writeHead(200, headers);
      const fileStream = fs.createReadStream(finalPath);
      fileStream.pipe(res);
    }
  } catch (err) {
    console.error(`Error serving file ${finalPath}:`, err);
    if (!res.headersSent) {
      res.status(500).send('Internal server error while streaming file.');
    }
  }
});

// ============================================================================
// --- MECHANICAL DESIGNS FILESYSTEM API ---
// ============================================================================

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function detectCadFormat(fileName) {
  const ext = (fileName.split('.').pop() || '').toUpperCase();
  if (ext === 'STP') return 'STEP';
  if (ext === 'IGS') return 'IGES';
  return ext || 'CAD';
}

// 1. Initialize mechanical design folders on disk
// Creates server/data/storage/mechanical-designs/<slug>/files/ and thumbnail/
app.post('/api/mechanical/init/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    if (!isValidSlug(slug)) {
      return res.status(400).json({ error: 'Invalid mechanical design slug identifier' });
    }

    const designDir = path.resolve(MECH_STORAGE_DIR, slug);
    const filesDir = path.join(designDir, 'files');
    const thumbnailDir = path.join(designDir, 'thumbnail');

    ensureDir(filesDir);
    ensureDir(thumbnailDir);

    res.json({
      success: true,
      slug,
      designDir,
      filesDir,
      thumbnailDir,
    });
  } catch (err) {
    console.error('Error initializing mechanical design directory:', err);
    res.status(500).json({ error: 'Failed to initialize mechanical directory', message: err.message });
  }
});

// 2. Scan mechanical design directory (detects manual placement & admin uploads identically)
app.get('/api/mechanical/scan/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    if (!isValidSlug(slug)) {
      return res.status(400).json({ error: 'Invalid mechanical design slug identifier' });
    }

    const designDir = path.resolve(MECH_STORAGE_DIR, slug);
    const filesDir = path.join(designDir, 'files');
    const thumbnailDir = path.join(designDir, 'thumbnail');

    if (!fs.existsSync(designDir)) {
      return res.json({
        exists: false,
        slug,
        cadFiles: [],
        hasThumbnail: false,
        thumbnailUrl: null,
      });
    }

    // Scan CAD files in files/
    const cadFiles = [];
    if (fs.existsSync(filesDir)) {
      const entries = fs.readdirSync(filesDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && !entry.name.startsWith('.')) {
          const filePath = path.join(filesDir, entry.name);
          const stat = fs.statSync(filePath);
          cadFiles.push({
            id: `cad-${entry.name}`,
            name: entry.name,
            format: detectCadFormat(entry.name),
            size: formatBytes(stat.size),
            sizeBytes: stat.size,
            downloadUrl: `/api/mechanical/${slug}/file/${encodeURIComponent(entry.name)}`,
          });
        }
      }
    }

    // Scan thumbnail in thumbnail/ (looks for <slug>.png, or any valid image file)
    let hasThumbnail = false;
    let thumbnailFileName = null;
    if (fs.existsSync(thumbnailDir)) {
      const tEntries = fs.readdirSync(thumbnailDir, { withFileTypes: true });
      // Prioritize <slug>.png
      const exactPng = tEntries.find(e => e.isFile() && e.name.toLowerCase() === `${slug.toLowerCase()}.png`);
      const imgEntry = exactPng || tEntries.find(e => e.isFile() && /\.(png|jpe?g|webp|svg)$/i.test(e.name));
      if (imgEntry) {
        hasThumbnail = true;
        thumbnailFileName = imgEntry.name;
      }
    }

    res.json({
      exists: true,
      slug,
      cadFiles,
      hasThumbnail,
      thumbnailFileName,
      thumbnailUrl: hasThumbnail ? `/api/mechanical/${slug}/thumbnail` : null,
      filesDir,
      thumbnailDir,
    });
  } catch (err) {
    console.error('Error scanning mechanical design:', err);
    res.status(500).json({ error: 'Failed to scan mechanical design', message: err.message });
  }
});

// 3. Upload CAD file directly into mechanical-designs/<slug>/files/
app.post('/api/mechanical/upload-cad/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    if (!isValidSlug(slug)) {
      return res.status(400).json({ error: 'Invalid mechanical design slug identifier' });
    }

    const { fileName, fileContent } = req.body;
    if (!fileName || !fileContent) {
      return res.status(400).json({ error: 'fileName and fileContent are required' });
    }

    const cleanFileName = path.basename(fileName);
    if (!cleanFileName || cleanFileName.includes('..')) {
      return res.status(400).json({ error: 'Invalid file name' });
    }

    const filesDir = path.resolve(MECH_STORAGE_DIR, slug, 'files');
    ensureDir(filesDir);

    const targetPath = path.resolve(filesDir, cleanFileName);
    if (!targetPath.startsWith(filesDir + path.sep)) {
      return res.status(403).json({ error: 'Path traversal strictly prohibited' });
    }

    // Decode base64 payload
    const base64Data = fileContent.replace(/^data:.*?;base64,/, '').replace(/^base64:/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(targetPath, buffer);

    res.json({
      success: true,
      slug,
      fileName: cleanFileName,
      size: formatBytes(buffer.length),
      downloadUrl: `/api/mechanical/${slug}/file/${encodeURIComponent(cleanFileName)}`,
    });
  } catch (err) {
    console.error('Error uploading CAD file:', err);
    res.status(500).json({ error: 'Failed to write CAD file', message: err.message });
  }
});

// 4. Download CAD file from mechanical-designs/<slug>/files/<filename>
app.get('/api/mechanical/:slug/file/:filename', (req, res) => {
  try {
    const { slug, filename } = req.params;
    if (!isValidSlug(slug)) {
      return res.status(400).send('Invalid slug identifier');
    }

    const cleanFileName = path.basename(filename);
    const filesDir = path.resolve(MECH_STORAGE_DIR, slug, 'files');
    const targetPath = path.resolve(filesDir, cleanFileName);

    if (!targetPath.startsWith(filesDir + path.sep)) {
      return res.status(403).send('Forbidden: Path traversal blocked');
    }

    if (!fs.existsSync(targetPath) || fs.statSync(targetPath).isDirectory()) {
      return res.status(404).send('CAD file not found');
    }

    const stat = fs.statSync(targetPath);
    const ext = path.extname(cleanFileName).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Content-Disposition': `attachment; filename="${cleanFileName}"`,
    });

    const readStream = fs.createReadStream(targetPath);
    readStream.pipe(res);
  } catch (err) {
    console.error('Error downloading CAD file:', err);
    if (!res.headersSent) res.status(500).send('Server error');
  }
});

// 5. Delete CAD file from mechanical-designs/<slug>/files/<filename>
app.delete('/api/mechanical/:slug/file/:filename', (req, res) => {
  try {
    const { slug, filename } = req.params;
    if (!isValidSlug(slug)) return res.status(400).json({ error: 'Invalid slug identifier' });

    const cleanFileName = path.basename(filename);
    const filesDir = path.resolve(MECH_STORAGE_DIR, slug, 'files');
    const targetPath = path.resolve(filesDir, cleanFileName);

    if (!targetPath.startsWith(filesDir + path.sep)) {
      return res.status(403).json({ error: 'Forbidden: Path traversal blocked' });
    }

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }
    res.json({ success: true, deleted: cleanFileName });
  } catch (err) {
    console.error('Error deleting CAD file:', err);
    res.status(500).json({ error: 'Failed to delete file', message: err.message });
  }
});

// 6. Upload Thumbnail directly to mechanical-designs/<slug>/thumbnail/<slug>.png
app.post('/api/mechanical/upload-thumbnail/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    if (!isValidSlug(slug)) return res.status(400).json({ error: 'Invalid slug identifier' });

    const { imageContent } = req.body;
    if (!imageContent) return res.status(400).json({ error: 'imageContent is required' });

    const thumbnailDir = path.resolve(MECH_STORAGE_DIR, slug, 'thumbnail');
    ensureDir(thumbnailDir);

    const targetPath = path.resolve(thumbnailDir, `${slug}.png`);
    const base64Data = imageContent.replace(/^data:.*?;base64,/, '').replace(/^base64:/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(targetPath, buffer);

    res.json({
      success: true,
      slug,
      thumbnailUrl: `/api/mechanical/${slug}/thumbnail`,
    });
  } catch (err) {
    console.error('Error uploading thumbnail:', err);
    res.status(500).json({ error: 'Failed to save thumbnail', message: err.message });
  }
});

// 7. Serve Thumbnail from mechanical-designs/<slug>/thumbnail/<slug>.png
app.get('/api/mechanical/:slug/thumbnail', (req, res) => {
  try {
    const { slug } = req.params;
    if (!isValidSlug(slug)) return res.status(400).send('Invalid slug identifier');

    const thumbnailDir = path.resolve(MECH_STORAGE_DIR, slug, 'thumbnail');
    if (!fs.existsSync(thumbnailDir)) {
      return res.status(404).send('Thumbnail not found');
    }

    // Check <slug>.png first, then any image
    let targetImg = path.join(thumbnailDir, `${slug}.png`);
    if (!fs.existsSync(targetImg)) {
      const entries = fs.readdirSync(thumbnailDir);
      const found = entries.find(e => /\.(png|jpe?g|webp|svg)$/i.test(e));
      if (found) {
        targetImg = path.join(thumbnailDir, found);
      } else {
        return res.status(404).send('Thumbnail not found');
      }
    }

    const ext = path.extname(targetImg).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'image/png';
    const stat = fs.statSync(targetImg);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': 'no-cache',
    });

    const stream = fs.createReadStream(targetImg);
    stream.pipe(res);
  } catch (err) {
    console.error('Error serving thumbnail:', err);
    if (!res.headersSent) res.status(500).send('Server error');
  }
});

// ============================================================================
// --- STARTUP / SEED INITIAL PROJECTS & STORAGE ---
// ============================================================================

function seedInitialProjects() {
  ensureDir(STORAGE_DIR);
  ensureDir(MECH_STORAGE_DIR);

  // 1. Seed RE-Sensor IQ with Live Telemetry + Downloadable .EXE Desktop Application
  const reSensorDir = path.join(STORAGE_DIR, 're-sensor-iq', 'extracted', 'landing');
  const downloadsDir = path.join(reSensorDir, 'downloads');

  // Idempotent creation of all required directories
  ensureDir(reSensorDir);
  ensureDir(path.join(reSensorDir, 'css'));
  ensureDir(path.join(reSensorDir, 'js'));
  ensureDir(path.join(reSensorDir, 'assets'));
  ensureDir(downloadsDir);

  // Seed a 5MB test .EXE installer binary for immediate test downloads
  const exePath = path.join(downloadsDir, 'RE-Sensor-IQ-Desktop-Setup-v2.4.exe');
  if (!fs.existsSync(exePath)) {
    const mockExeBuffer = Buffer.alloc(5 * 1024 * 1024); // 5 MB binary buffer
    mockExeBuffer.write('MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xFF\xFF\x00\x00', 0); // DOS / PE Executable header
    mockExeBuffer.write('RE-SENSOR-IQ-DESKTOP-APP-EXE-BINARY', 100);
    fs.writeFileSync(exePath, mockExeBuffer);
    console.log('[Seed] Created RE-Sensor IQ 5MB test .EXE binary');
  }

  // 2. Seed default mechanical design directories idempotently
  const seedMechSlugs = ['cycloidal-actuator-gearbox', 'quadruped-composite-chassis'];
  for (const mSlug of seedMechSlugs) {
    ensureDir(path.join(MECH_STORAGE_DIR, mSlug, 'files'));
    ensureDir(path.join(MECH_STORAGE_DIR, mSlug, 'thumbnail'));
  }

    // landing/index.html with interactive telemetry and EXE Download Card
    const reSensorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RE-Sensor IQ — Industrial Telemetry & Edge AI Monitor</title>
  <link rel="stylesheet" href="./css/style.css">
</head>
<body>
  <div class="dashboard-container">
    <header class="top-nav">
      <div class="brand">
        <div class="pulse-dot"></div>
        <h1>RE-Sensor IQ <span class="badge">v2.4 Live</span></h1>
      </div>
      <div class="header-actions">
        <a href="./downloads/RE-Sensor-IQ-Desktop-Setup-v2.4.exe" download="RE-Sensor-IQ-Desktop-Setup-v2.4.exe" class="btn-download-top">
          ⬇ Download Desktop Client (.EXE)
        </a>
        <div class="status-pill">
          <span class="dot"></span> CAN Bus Active @ 1 Mbps
        </div>
      </div>
    </header>

    <!-- Download Banner for Desktop App -->
    <div class="banner-card">
      <div class="banner-content">
        <div class="banner-icon">⚡</div>
        <div>
          <h3>RE-Sensor IQ Desktop Telemetry Station (Windows x64)</h3>
          <p>High-bandwidth 10,000 Hz real-time CAN FD stream, USB-CDC hardware driver, and offline FFT spectrum analyzer.</p>
        </div>
      </div>
      <a href="./downloads/RE-Sensor-IQ-Desktop-Setup-v2.4.exe" download="RE-Sensor-IQ-Desktop-Setup-v2.4.exe" class="btn-download-main">
        <span>Download Installer (.EXE)</span>
        <small>v2.4.0 • Standalone Executable</small>
      </a>
    </div>

    <main class="grid-layout">
      <!-- Metric Cards -->
      <div class="card metric-card">
        <div class="label">Vibration FFT Peak</div>
        <div class="value" id="vib-val">1.24 <small>g</small></div>
        <div class="bar-container"><div class="bar bar-cyan" style="width: 42%;"></div></div>
      </div>

      <div class="card metric-card">
        <div class="label">Core Die Temp</div>
        <div class="value" id="temp-val">41.8 <small>°C</small></div>
        <div class="bar-container"><div class="bar bar-emerald" style="width: 38%;"></div></div>
      </div>

      <div class="card metric-card">
        <div class="label">Supply Bus Voltage</div>
        <div class="value" id="volt-val">24.18 <small>V</small></div>
        <div class="bar-container"><div class="bar bar-amber" style="width: 82%;"></div></div>
      </div>

      <div class="card metric-card">
        <div class="label">Anomaly Score</div>
        <div class="value" id="anomaly-val">0.02 <small>Normal</small></div>
        <div class="bar-container"><div class="bar bar-purple" style="width: 4%;"></div></div>
      </div>

      <!-- Live Waveform Section -->
      <div class="card wide-card">
        <div class="card-header">
          <h3>Real-Time 3-Axis Accelerometer Stream (BNO085)</h3>
          <span class="stream-rate">Sampling Rate: 1000 Hz</span>
        </div>
        <canvas id="waveform-canvas" width="800" height="180"></canvas>
      </div>

      <!-- System Log & Controls -->
      <div class="card log-card">
        <div class="card-header">
          <h3>CAN FD Telemetry Packet Log</h3>
          <button id="clear-btn" class="btn-sm">Clear</button>
        </div>
        <div class="log-terminal" id="log-box">
          <div class="log-line">[00:00:01.120] CAN_ID=0x140 LEN=8 DATA: 02 4A 1B 88 FF 00 12 C4</div>
          <div class="log-line">[00:00:01.140] IMU_QUAT: w=0.982 x=0.012 y=-0.045 z=0.184</div>
          <div class="log-line">[00:00:01.160] HEALTH_OK: All transducers calibrated. Loop time: 1.2ms</div>
        </div>
      </div>
    </main>
  </div>
  <script src="./js/app.js"></script>
</body>
</html>`;

    // landing/css/style.css
    const reSensorCss = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background-color: #080c14;
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  min-height: 100vh;
  padding: 24px;
}
.dashboard-container {
  max-width: 1100px;
  margin: 0 auto;
}
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #1e293b;
  margin-bottom: 20px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand h1 {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #ffffff;
}
.badge {
  font-size: 10px;
  font-family: monospace;
  background: #0284c7;
  color: #fff;
  padding: 2px 8px;
  border-radius: 9999px;
  font-weight: 600;
  margin-left: 8px;
}
.pulse-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { transform: scale(0.9); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.8; }
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.btn-download-top {
  background: #0284c7;
  color: #ffffff;
  font-size: 11px;
  font-family: monospace;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid #38bdf8;
}
.btn-download-top:hover {
  background: #0369a1;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
}
.status-pill {
  font-family: monospace;
  font-size: 12px;
  color: #38bdf8;
  background: #0c4a6e22;
  border: 1px solid #0284c744;
  padding: 6px 14px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.status-pill .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #38bdf8;
}
.banner-card {
  background: linear-gradient(135deg, #0c4a6e33, #0284c722);
  border: 1px solid #0284c766;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.banner-content {
  display: flex;
  align-items: center;
  gap: 14px;
}
.banner-icon {
  font-size: 28px;
  background: #0284c733;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #38bdf844;
}
.banner-content h3 {
  font-size: 15px;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 4px;
}
.banner-content p {
  font-size: 12px;
  color: #94a3b8;
}
.btn-download-main {
  background: #10b981;
  color: #022c22;
  padding: 10px 18px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s;
  border: 1px solid #34d399;
}
.btn-download-main:hover {
  background: #34d399;
  box-shadow: 0 0 16px rgba(52, 211, 153, 0.4);
}
.btn-download-main small {
  font-size: 10px;
  font-family: monospace;
  opacity: 0.8;
  font-weight: 500;
}
.grid-layout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}
.metric-card .label {
  font-size: 11px;
  text-transform: uppercase;
  font-family: monospace;
  color: #94a3b8;
  margin-bottom: 6px;
}
.metric-card .value {
  font-size: 24px;
  font-family: monospace;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}
.metric-card .value small {
  font-size: 13px;
  color: #64748b;
  font-weight: 400;
}
.bar-container {
  height: 4px;
  background: #1e293b;
  border-radius: 2px;
  overflow: hidden;
}
.bar { height: 100%; border-radius: 2px; }
.bar-cyan { background: #06b6d4; }
.bar-emerald { background: #10b981; }
.bar-amber { background: #f59e0b; }
.bar-purple { background: #a855f7; }
.wide-card {
  grid-column: span 4;
}
.log-card {
  grid-column: span 4;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.card-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
}
.stream-rate {
  font-size: 11px;
  font-family: monospace;
  color: #38bdf8;
}
#waveform-canvas {
  width: 100%;
  height: 180px;
  background: #020617;
  border-radius: 8px;
  border: 1px solid #1e293b;
}
.log-terminal {
  background: #020617;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 12px;
  font-family: monospace;
  font-size: 11px;
  height: 120px;
  overflow-y: auto;
  color: #10b981;
}
.log-line { margin-bottom: 4px; }
.btn-sm {
  background: #1e293b;
  color: #94a3b8;
  border: 1px solid #334155;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
}
.btn-sm:hover { color: #fff; background: #334155; }
@media (max-width: 768px) {
  .grid-layout { grid-template-columns: repeat(2, 1fr); }
  .wide-card, .log-card { grid-column: span 2; }
}`;

    // landing/js/app.js
    const reSensorJs = `document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('waveform-canvas');
  const ctx = canvas.getContext('2d');
  const logBox = document.getElementById('log-box');
  const vibVal = document.getElementById('vib-val');
  const tempVal = document.getElementById('temp-val');

  let points = [];
  const maxPoints = 120;
  for (let i = 0; i < maxPoints; i++) points.push(90);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grid lines
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(canvas.width, x);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Waveform line
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 8;
    ctx.beginPath();

    const sliceWidth = canvas.width / (maxPoints - 1);
    for (let i = 0; i < points.length; i++) {
      const x = i * sliceWidth;
      const y = points[i];
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function updateTelemetry() {
    const noise = (Math.random() - 0.5) * 20;
    const sinWave = Math.sin(Date.now() / 150) * 35;
    const nextY = 90 + sinWave + noise;

    points.shift();
    points.push(nextY);
    draw();

    // Metric Jitter
    const currentVib = (1.2 + (Math.random() * 0.1 - 0.05)).toFixed(2);
    const currentTemp = (41.5 + (Math.random() * 0.6 - 0.3)).toFixed(1);
    if (vibVal) vibVal.innerHTML = currentVib + ' <small>g</small>';
    if (tempVal) tempVal.innerHTML = currentTemp + ' <small>°C</small>';

    // Add CAN packet log occasionally
    if (logBox && Math.random() > 0.7) {
      const time = new Date().toISOString().substring(11, 23);
      const hex1 = Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0');
      const hex2 = Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0');
      const line = document.createElement('div');
      line.className = 'log-line';
      line.textContent = \`[\${time}] CAN_ID=0x140 PKT: \${hex1} \${hex2} 88 FF 00 12 C4\`;
      logBox.appendChild(line);
      logBox.scrollTop = logBox.scrollHeight;
      if (logBox.children.length > 20) {
        logBox.removeChild(logBox.children[0]);
      }
    }
  }

  setInterval(updateTelemetry, 40);

  document.getElementById('clear-btn')?.addEventListener('click', () => {
    if (logBox) logBox.innerHTML = '';
  });
});`;

  fs.writeFileSync(path.join(reSensorDir, 'index.html'), reSensorHtml, 'utf8');
  fs.writeFileSync(path.join(reSensorDir, 'css', 'style.css'), reSensorCss, 'utf8');
  fs.writeFileSync(path.join(reSensorDir, 'js', 'app.js'), reSensorJs, 'utf8');
  console.log('[Seed] Created default runtime assets for RE-Sensor IQ with downloadable .EXE');
}

seedInitialProjects();

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Express Static Runtime Server running on Port ${PORT}`);
  console.log(`📡 Health endpoint: http://localhost:${PORT}/health`);
  console.log(`📂 Project Storage Root: ${STORAGE_DIR}`);
  console.log(`====================================================`);
});
