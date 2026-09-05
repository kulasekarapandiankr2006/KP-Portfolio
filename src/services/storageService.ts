import { initialPortfolioData } from '../data/initialData';
import type { PortfolioDatabase } from '../data/initialData';
import type { Project } from '../types/project';
import type { MechanicalDesign } from '../types/mechanical';
import type { 
  Profile, 
  FocusArea, 
  Experience, 
  Education, 
  SkillGroup, 
  Certification, 
  Achievement, 
  Publication, 
  Competition, 
  Language, 
  SocialLink 
} from '../types/portfolio';

// ============================================================================
// Server-backed CMS storage service
//
// Architecture:
//   React → storageService → Express /api/cms/data → portfolio-cms.json
//
// All reads and writes go through the server so that Normal Chrome and
// Incognito (which have isolated localStorage) both see the same data.
//
// localStorage is used ONLY as an in-memory cache for synchronous reads
// within a single browser session. It is never the authoritative source.
// ============================================================================

const DB_KEY = 'kp_mechatronics_portfolio_db_v1';
const CMS_API = '/api/cms/data';

// ---- Migration helpers (same as before, applied to any loaded payload) ----

function applyMigrations(parsed: PortfolioDatabase): { data: PortfolioDatabase; modified: boolean } {
  let modified = false;

  if (parsed.profile.name === 'Kavindu Priyashan' || parsed.profile.name.includes('Kavindu')) {
    parsed.profile.name = 'Kulasekara Pandian K R';
    parsed.profile.preferredName = 'Kulasekara';
    parsed.profile.githubUrl = 'https://github.com/kulasekarapandiankr2006';
    parsed.profile.linkedinUrl = 'https://www.linkedin.com/in/kulasekara-pandian-k-r/';
    modified = true;
  }

  if (parsed.profile.email && parsed.profile.email.includes('kavindu')) {
    parsed.profile.email = 'contact@kulasekarapandian.com';
    modified = true;
  }
  if (parsed.profile.youtubeUrl && parsed.profile.youtubeUrl.includes('kavindumechatronics')) {
    parsed.profile.youtubeUrl = '';
    modified = true;
  }
  if (parsed.profile.cadPortfolioUrl && parsed.profile.cadPortfolioUrl.includes('kavindu')) {
    parsed.profile.cadPortfolioUrl = '';
    modified = true;
  }
  if (Array.isArray(parsed.socialLinks)) {
    parsed.socialLinks = parsed.socialLinks.map((s: any) => {
      if (s.url && (s.url.includes('kavindumechatronics') || s.url.includes('kavindu.priyashan'))) {
        return { ...s, url: '', username: '' };
      }
      return s;
    });
  }

  if (!parsed.projects.some(p => p.slug === 're-sensor-iq')) {
    const reSensor = initialPortfolioData.projects.find(p => p.slug === 're-sensor-iq');
    if (reSensor) {
      parsed.projects.unshift(reSensor);
      modified = true;
    }
  }

  return { data: parsed, modified };
}

// ---- In-memory cache (populated lazily; invalidated by saves) ----
let _cache: PortfolioDatabase | null = null;

// ---- Synchronous read from cache / localStorage (fallback for UI) ----
function readCacheOrLocal(): PortfolioDatabase {
  if (_cache) return _cache;

  // Try localStorage as fast in-session cache
  try {
    const stored = localStorage.getItem(DB_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as PortfolioDatabase;
      if (parsed && parsed.profile && Array.isArray(parsed.projects) && Array.isArray(parsed.mechanicalDesigns)) {
        _cache = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // Absolute fallback: initial seed data
  _cache = initialPortfolioData;
  return initialPortfolioData;
}

// ---- Write through: server + cache + localStorage ----
async function persistToServer(data: PortfolioDatabase): Promise<void> {
  try {
    await fetch(CMS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn('[CMS] Server save failed (server offline?), data saved locally only.', err);
  }
}

function writeCache(data: PortfolioDatabase): void {
  _cache = data;
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  } catch {
    // storage quota exceeded — ignore
  }
}

// ---- Boot: load from server, migrate localStorage data if server is empty ----
// Returns a promise; PortfolioContext calls this once on init.
export async function initStorageFromServer(): Promise<PortfolioDatabase> {
  try {
    const res = await fetch(CMS_API);
    if (res.ok) {
      const json = await res.json() as { found: boolean; data: PortfolioDatabase | null };

      if (json.found && json.data) {
        // Server has data — apply migrations, update cache
        const { data, modified } = applyMigrations(json.data);
        writeCache(data);
        if (modified) {
          await persistToServer(data);
        }
        return data;
      }

      // Server has no file yet — check localStorage for existing user data to migrate
      let localData: PortfolioDatabase | null = null;
      try {
        const stored = localStorage.getItem(DB_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as PortfolioDatabase;
          if (parsed && parsed.profile && Array.isArray(parsed.projects)) {
            localData = parsed;
          }
        }
      } catch {
        // ignore
      }

      const seed = localData || initialPortfolioData;
      const { data: migrated } = applyMigrations(seed);
      writeCache(migrated);
      await persistToServer(migrated);
      return migrated;
    }
  } catch (err) {
    console.warn('[CMS] Server unreachable during init, falling back to local data.', err);
  }

  // Server offline — use localStorage or seed
  return readCacheOrLocal();
}

// ============================================================================
// Public storageService API — identical surface to before
// ============================================================================

export const storageService = {
  // Synchronous load — uses in-memory cache (populated by initStorageFromServer)
  loadDatabase(): PortfolioDatabase {
    return readCacheOrLocal();
  },

  // Async save to server + cache
  saveDatabase(data: PortfolioDatabase): void {
    writeCache(data);
    // Fire-and-forget server persist
    persistToServer(data).catch(() => {});
  },

  // --- Profile ---
  getProfile(): Profile {
    return this.loadDatabase().profile;
  },

  updateProfile(profile: Partial<Profile>): Profile {
    const db = this.loadDatabase();
    db.profile = { ...db.profile, ...profile };
    this.saveDatabase(db);
    return db.profile;
  },

  // --- Focus Areas ---
  getFocusAreas(): FocusArea[] {
    return this.loadDatabase().focusAreas;
  },

  updateFocusAreas(focusAreas: FocusArea[]): void {
    const db = this.loadDatabase();
    db.focusAreas = focusAreas;
    this.saveDatabase(db);
  },

  // --- Projects ---
  getProjects(): Project[] {
    return this.loadDatabase().projects;
  },

  getProjectById(id: string): Project | undefined {
    return this.loadDatabase().projects.find(p => p.id === id);
  },

  getProjectBySlug(slug: string): Project | undefined {
    return this.loadDatabase().projects.find(p => p.slug === slug);
  },

  saveProject(project: Project): Project {
    const db = this.loadDatabase();
    const index = db.projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      db.projects[index] = project;
    } else {
      db.projects.push(project);
    }
    this.saveDatabase(db);
    return project;
  },

  deleteProject(id: string): boolean {
    const db = this.loadDatabase();
    const initialLen = db.projects.length;
    db.projects = db.projects.filter(p => p.id !== id);
    if (db.projects.length !== initialLen) {
      this.saveDatabase(db);
      return true;
    }
    return false;
  },

  duplicateProject(id: string): Project | null {
    const db = this.loadDatabase();
    const existing = db.projects.find(p => p.id === id);
    if (!existing) return null;

    const newProject: Project = {
      ...existing,
      id: `proj-${Date.now()}`,
      slug: `${existing.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      title: `${existing.title} (Copy)`,
      published: false,
      featured: false,
      displayOrder: db.projects.length + 1,
    };
    db.projects.push(newProject);
    this.saveDatabase(db);
    return newProject;
  },

  // --- Mechanical Designs ---
  getMechanicalDesigns(): MechanicalDesign[] {
    return this.loadDatabase().mechanicalDesigns;
  },

  getMechanicalById(id: string): MechanicalDesign | undefined {
    return this.loadDatabase().mechanicalDesigns.find(m => m.id === id);
  },

  getMechanicalBySlug(slug: string): MechanicalDesign | undefined {
    return this.loadDatabase().mechanicalDesigns.find(m => m.slug === slug);
  },

  saveMechanicalDesign(design: MechanicalDesign): MechanicalDesign {
    const db = this.loadDatabase();
    const index = db.mechanicalDesigns.findIndex(m => m.id === design.id);
    if (index >= 0) {
      db.mechanicalDesigns[index] = design;
    } else {
      db.mechanicalDesigns.push(design);
    }
    this.saveDatabase(db);
    return design;
  },

  deleteMechanicalDesign(id: string): boolean {
    const db = this.loadDatabase();
    const initialLen = db.mechanicalDesigns.length;
    db.mechanicalDesigns = db.mechanicalDesigns.filter(m => m.id !== id);
    if (db.mechanicalDesigns.length !== initialLen) {
      this.saveDatabase(db);
      return true;
    }
    return false;
  },

  duplicateMechanicalDesign(id: string): MechanicalDesign | null {
    const db = this.loadDatabase();
    const existing = db.mechanicalDesigns.find(m => m.id === id);
    if (!existing) return null;

    const newDesign: MechanicalDesign = {
      ...existing,
      id: `mech-${Date.now()}`,
      slug: `${existing.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      title: `${existing.title} (Copy)`,
      published: false,
      featured: false,
      displayOrder: db.mechanicalDesigns.length + 1,
    };
    db.mechanicalDesigns.push(newDesign);
    this.saveDatabase(db);
    return newDesign;
  },

  // --- Experiences ---
  getExperiences(): Experience[] {
    return this.loadDatabase().experiences;
  },

  updateExperiences(experiences: Experience[]): void {
    const db = this.loadDatabase();
    db.experiences = experiences;
    this.saveDatabase(db);
  },

  // --- Education ---
  getEducation(): Education[] {
    return this.loadDatabase().education;
  },

  updateEducation(education: Education[]): void {
    const db = this.loadDatabase();
    db.education = education;
    this.saveDatabase(db);
  },

  // --- Skills ---
  getSkillGroups(): SkillGroup[] {
    return this.loadDatabase().skillGroups;
  },

  updateSkillGroups(skillGroups: SkillGroup[]): void {
    const db = this.loadDatabase();
    db.skillGroups = skillGroups;
    this.saveDatabase(db);
  },

  // --- Certifications & Achievements ---
  getCertifications(): Certification[] {
    return this.loadDatabase().certifications;
  },

  updateCertifications(certifications: Certification[]): void {
    const db = this.loadDatabase();
    db.certifications = certifications;
    this.saveDatabase(db);
  },

  getAchievements(): Achievement[] {
    return this.loadDatabase().achievements;
  },

  updateAchievements(achievements: Achievement[]): void {
    const db = this.loadDatabase();
    db.achievements = achievements;
    this.saveDatabase(db);
  },

  // --- Publications ---
  getPublications(): Publication[] {
    return this.loadDatabase().publications;
  },

  updatePublications(publications: Publication[]): void {
    const db = this.loadDatabase();
    db.publications = publications;
    this.saveDatabase(db);
  },

  // --- Competitions ---
  getCompetitions(): Competition[] {
    return this.loadDatabase().competitions;
  },

  updateCompetitions(competitions: Competition[]): void {
    const db = this.loadDatabase();
    db.competitions = competitions;
    this.saveDatabase(db);
  },

  // --- Languages ---
  getLanguages(): Language[] {
    return this.loadDatabase().languages;
  },

  updateLanguages(languages: Language[]): void {
    const db = this.loadDatabase();
    db.languages = languages;
    this.saveDatabase(db);
  },

  // --- Social Links ---
  getSocialLinks(): SocialLink[] {
    return this.loadDatabase().socialLinks;
  },

  updateSocialLinks(socialLinks: SocialLink[]): void {
    const db = this.loadDatabase();
    db.socialLinks = socialLinks;
    this.saveDatabase(db);
  },

  // --- Reset & Backup Utilities ---
  resetToDefaults(): PortfolioDatabase {
    this.saveDatabase(initialPortfolioData);
    return initialPortfolioData;
  },

  exportDatabaseJson(): string {
    return JSON.stringify(this.loadDatabase(), null, 2);
  },

  importDatabaseJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString) as PortfolioDatabase;
      if (parsed && parsed.profile && Array.isArray(parsed.projects)) {
        this.saveDatabase(parsed);
        return true;
      }
    } catch (e) {
      console.error('Failed to parse and import database JSON', e);
    }
    return false;
  }
};
