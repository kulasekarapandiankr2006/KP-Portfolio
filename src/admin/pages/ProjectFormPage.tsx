import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { runtimeService, type ScanProjectResult } from '../../services/runtimeService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TagInput } from '../components/TagInput';
import { FileTreeViewer } from '../components/FileTreeViewer';
import type { Project, ProjectCategory } from '../../types/project';
import { 
  FolderKanban, 
  Save, 
  ArrowLeft, 
  Layers, 
  Cpu, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  HardDrive,
  RefreshCw,
  Play,
  Settings, 
  CheckCircle2, 
  Plus, 
  Trash2
} from 'lucide-react';

const CATEGORIES: ProjectCategory[] = [
  'Robotics',
  'Embedded Systems',
  'Computer Vision',
  'Control Systems',
  'IoT & Industrial',
  'Software Engineering',
  'Mechatronics Integration',
];

export const ProjectFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allProjects, saveProject } = usePortfolioData();

  const isEditMode = Boolean(id);
  const existingProject = id ? allProjects.find(p => p.id === id) : undefined;

  const [formData, setFormData] = useState<Project>(() => {
    if (existingProject) return { ...existingProject };
    return {
      id: `proj-${Date.now()}`,
      slug: '',
      title: '',
      tagline: '',
      description: '',
      category: 'Robotics',
      year: new Date().getFullYear().toString(),
      role: 'Lead Mechatronics Engineer',
      duration: '3 Months',
      organization: '',
      team: 'Solo',
      problem: '',
      objective: '',
      approach: '',
      features: [''],
      results: [''],
      technologies: ['C++', 'ROS 2', 'STM32'],
      programmingLanguages: ['C++', 'C', 'Python'],
      frameworks: ['ROS 2'],
      hardware: ['STM32 Microcontroller'],
      sensors: ['IMU Sensor'],
      tools: ['SolidWorks', 'Logic Analyzer'],
      githubUrl: '',
      liveDemoUrl: '',
      docsUrl: '',
      youtubeUrl: '',
      downloadUrl: '',
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?fit=crop&w=800&h=500&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?fit=crop&w=1200&h=800&q=80'
      ],
      hasZip: false,
      zipFileName: '',
      zipFileSize: 0,
      entryPoint: 'index.html',
      runtimeUrl: '',
      extractedTree: [],
      published: true,
      featured: false,
      displayOrder: allProjects.length + 1,
    };
  });

  const [autoSlug, setAutoSlug] = useState(!isEditMode);
  const [successToast, setSuccessToast] = useState(false);
  const [scanningDisk, setScanningDisk] = useState(false);
  const [scanResult, setScanResult] = useState<ScanProjectResult | null>(null);

  // Create the project folder on disk — called ONLY from handleSubmit
  const ensureProjectFolder = async (slugToCreate: string) => {
    if (!slugToCreate || !/^[a-zA-Z0-9_-]+$/.test(slugToCreate)) return;
    try {
      await runtimeService.createProject(slugToCreate);
    } catch {
      // server might be offline
    }
  };

  const handleScanDisk = async (slugToScan?: string) => {
    const targetSlug = slugToScan || formData.slug;
    if (!targetSlug) return;
    setScanningDisk(true);
    try {
      const result = await runtimeService.scanServerProject(targetSlug);
      setScanResult(result);
      if (result.exists && result.totalFiles > 0) {
        setFormData(prev => ({
          ...prev,
          entryPoint: result.recommendedEntryPoint || prev.entryPoint || 'index.html',
          extractedTree: result.fileTree,
          runtimeUrl: `/runtime/${targetSlug}/${result.recommendedEntryPoint || 'index.html'}`,
          hasZip: true,
        }));
      }
    } catch (e) {
      console.error('Scan error:', e);
    } finally {
      setScanningDisk(false);
    }
  };

  // On mount: scan existing folder in edit mode (read-only, no folder creation)
  useEffect(() => {
    if (isEditMode && formData.slug) {
      handleScanDisk(formData.slug);
    }
  }, []);

  // Sync title → slug in form state only (no filesystem side effects)
  const handleTitleChange = (newTitle: string) => {
    setFormData(prev => {
      const updated = { ...prev, title: newTitle };
      if (autoSlug) {
        updated.slug = newTitle
          .toLowerCase()
          .replace(/[^a-z0-9_-]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  // Dynamic Array Handlers
  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...formData.features];
    updated[index] = val;
    setFormData({ ...formData, features: updated });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, idx) => idx !== index) });
  };

  const handleResultChange = (index: number, val: string) => {
    const updated = [...formData.results];
    updated[index] = val;
    setFormData({ ...formData, results: updated });
  };

  const addResult = () => {
    setFormData({ ...formData, results: [...formData.results, ''] });
  };

  const removeResult = (index: number) => {
    setFormData({ ...formData, results: formData.results.filter((_, idx) => idx !== index) });
  };

  const handleGalleryChange = (index: number, val: string) => {
    const updated = [...formData.gallery];
    updated[index] = val;
    setFormData({ ...formData, gallery: updated });
  };

  const addGalleryImage = () => {
    setFormData({ ...formData, gallery: [...formData.gallery, ''] });
  };

  const removeGalleryImage = (index: number) => {
    setFormData({ ...formData, gallery: formData.gallery.filter((_, idx) => idx !== index) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure directory is on disk
    if (formData.slug) {
      ensureProjectFolder(formData.slug);
    }

    // Clean empty entries from features and results
    const cleanProject: Project = {
      ...formData,
      features: formData.features.filter(f => f.trim().length > 0),
      results: formData.results.filter(r => r.trim().length > 0),
      gallery: formData.gallery.filter(g => g.trim().length > 0),
      runtimeUrl: `/runtime/${formData.slug}/${formData.entryPoint || 'index.html'}`,
    };

    saveProject(cleanProject);
    setSuccessToast(true);

    setTimeout(() => {
      navigate('/admin/projects');
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 sticky top-16 bg-slate-950/95 backdrop-blur-md z-20 py-2">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/admin/projects')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold font-display text-white">
              {isEditMode ? `Edit Project: ${formData.title}` : 'Add New Engineering Project'}
            </h1>
            <p className="text-xs font-mono text-cyan-400">
              Target Slug: /{formData.slug || 'project-slug'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/projects')}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Save className="w-4 h-4" />}
          >
            {isEditMode ? 'Update Project' : 'Save & Publish'}
          </Button>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Project specification successfully saved to local persistent storage!</span>
        </div>
      )}

      {/* SECTION A — BASIC INFORMATION */}
      <Card padding="lg" className="space-y-6 border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase border-b border-slate-800 pb-3">
          <FolderKanban className="w-4 h-4 text-cyan-400" />
          <span>Section A — Basic Information</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-mono text-slate-300">
              Project Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Agile Quadruped Legged Robot"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-engineering-cyan font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300">
                URL Slug <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setAutoSlug(!autoSlug)}
                className="text-[10px] font-mono text-cyan-400 hover:underline"
              >
                {autoSlug ? 'Auto-generating' : 'Manual entry'}
              </button>
            </div>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => {
                setAutoSlug(false);
                setFormData({ ...formData, slug: e.target.value });
              }}
              placeholder="quadruped-dynamic-robot"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono focus:outline-none focus:border-engineering-cyan"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">
              Category <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-engineering-cyan"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-mono text-slate-300">
              Short Tagline / Headline <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. Dynamic Legged Locomotion with Custom BLDC Cycloidal Actuators & Real-Time MPC"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-engineering-cyan"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-mono text-slate-300">
              Executive Description & Overview <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="High-level engineering overview of what this platform accomplishes..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none focus:border-engineering-cyan resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Year</label>
            <input
              type="text"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">My Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="Lead Controls Designer"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="6 Months"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Organization / Lab</label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="Robotics Research Group"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* SECTION B — CASE STUDY & METHODOLOGY */}
      <Card padding="lg" className="space-y-6 border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase border-b border-slate-800 pb-3">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>Section B — Engineering Case Study & Methodology</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-rose-400 font-semibold">
              The Engineering Problem Statement:
            </label>
            <textarea
              rows={3}
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              placeholder="What technical problem or limitation existed prior to this project?"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-emerald-400 font-semibold">
              Core Objective & Target Specifications:
            </label>
            <textarea
              rows={2}
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
              placeholder="Target engineering specs (e.g. torque density, frequency, repeatability)..."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-cyan-400 font-semibold">
              Technical Approach & System Architecture:
            </label>
            <textarea
              rows={3}
              value={formData.approach}
              onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
              placeholder="Hardware architecture, control loops, simulation methodology..."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none"
            />
          </div>

          {/* Dynamic Features List */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Engineered Capabilities & Subsystem Highlights:
              </label>
              <Button type="button" variant="outline" size="sm" icon={<Plus className="w-3 h-3" />} onClick={addFeature}>
                Add Subsystem Feature
              </Button>
            </div>

            {formData.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feat}
                  onChange={(e) => handleFeatureChange(idx, e.target.value)}
                  placeholder={`Feature #${idx + 1}...`}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  className="p-2 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Dynamic Results List */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-emerald-400 font-semibold">
                Validated Experimental Results & Metrics:
              </label>
              <Button type="button" variant="outline" size="sm" icon={<Plus className="w-3 h-3" />} onClick={addResult}>
                Add Metric
              </Button>
            </div>

            {formData.results.map((res, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={res}
                  onChange={(e) => handleResultChange(idx, e.target.value)}
                  placeholder={`Result / Validation metric #${idx + 1}...`}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeResult(idx)}
                  className="p-2 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* SECTION C — TECHNICAL SPECIFICATIONS & TAGS */}
      <Card padding="lg" className="space-y-6 border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase border-b border-slate-800 pb-3">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Section C — Technical Stack & Hardware Tags</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TagInput
            label="General Technologies & Protocols"
            tags={formData.technologies}
            onChange={(tags) => setFormData({ ...formData, technologies: tags })}
            variant="cyan"
            placeholder="e.g. ROS 2, CANopen, FreeRTOS..."
          />

          <TagInput
            label="Programming Languages"
            tags={formData.programmingLanguages}
            onChange={(tags) => setFormData({ ...formData, programmingLanguages: tags })}
            variant="blue"
            placeholder="e.g. C++, C, Python, MATLAB..."
          />

          <TagInput
            label="Hardware & Computing Modules"
            tags={formData.hardware}
            onChange={(tags) => setFormData({ ...formData, hardware: tags })}
            variant="amber"
            placeholder="e.g. STM32F767, Jetson Orin..."
          />

          <TagInput
            label="Sensors & Transducers"
            tags={formData.sensors}
            onChange={(tags) => setFormData({ ...formData, sensors: tags })}
            variant="emerald"
            placeholder="e.g. BNO085 IMU, Magnetic Encoder..."
          />

          <TagInput
            label="Tools, Software & Instruments"
            tags={formData.tools}
            onChange={(tags) => setFormData({ ...formData, tools: tags })}
            variant="slate"
            placeholder="e.g. SolidWorks, Saleae Logic Pro..."
          />
        </div>
      </Card>

      {/* SECTION D — LOCAL FILESYSTEM STORAGE & SCANNER */}
      <Card padding="lg" className="space-y-6 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span>Section D — Local Filesystem Storage & Runtime</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            Local Disk Mode
          </span>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Local Disk Location:</span>
                <div className="text-xs font-mono font-semibold text-cyan-300 break-all mt-0.5">
                  server/data/storage/projects/{formData.slug || '[project-slug]'}/
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  loading={scanningDisk}
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                  onClick={() => handleScanDisk()}
                >
                  Scan Filesystem
                </Button>

                {formData.slug && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    icon={<Play className="w-3.5 h-3.5" />}
                    onClick={() => {
                      const url = runtimeService.getProjectRuntimeUrl(formData.slug, formData.entryPoint || 'index.html');
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    Test Runtime
                  </Button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Place your project files (e.g. <code className="text-cyan-300">index.html</code>, <code className="text-cyan-300">css/</code>, <code className="text-cyan-300">js/</code>, <code className="text-cyan-300">assets/</code>) or nested project folder (e.g. <code className="text-cyan-300">landing/</code>) directly into this directory. Click <strong>Scan Filesystem</strong> to auto-detect files and entry points.
            </p>
          </div>

          {/* Scan Results & Entry Point Selector */}
          {scanResult && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${scanResult.exists && scanResult.totalFiles > 0 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className="text-white font-semibold">
                    {scanResult.exists && scanResult.totalFiles > 0
                      ? `${scanResult.totalFiles} Files Detected on Disk`
                      : 'No files detected in directory yet'}
                  </span>
                </div>
                {scanResult.totalSize > 0 && (
                  <span className="text-slate-400">
                    Total: {(scanResult.totalSize / 1024).toFixed(1)} KB
                  </span>
                )}
              </div>

              {scanResult.detectedIndexFiles.length > 0 && (
                <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <label className="text-xs font-mono text-slate-300 font-semibold block">
                    Selected Entry Point:
                  </label>
                  <select
                    value={formData.entryPoint || 'index.html'}
                    onChange={(e) => setFormData({ ...formData, entryPoint: e.target.value })}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-cyan-300 text-xs font-mono focus:outline-none focus:border-cyan-400"
                  >
                    {scanResult.detectedIndexFiles.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* File Tree Display */}
              {scanResult.fileTree && scanResult.fileTree.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase text-slate-400 font-semibold">
                    Project File Tree Hierarchy:
                  </div>
                  <FileTreeViewer
                    nodes={scanResult.fileTree}
                    selectedEntryPoint={formData.entryPoint}
                    onSelectEntryPoint={(entry) => setFormData({ ...formData, entryPoint: entry })}
                    className="max-h-64"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* SECTION E — REPOSITORIES & EXTERNAL LINKS */}
      <Card padding="lg" className="space-y-6 border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase border-b border-slate-800 pb-3">
          <LinkIcon className="w-4 h-4 text-purple-400" />
          <span>Section E — Repositories & External Links (Optional)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">GitHub Repository URL</label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/user/project-name"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">YouTube Demo URL</label>
            <input
              type="url"
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Documentation Wiki URL</label>
            <input
              type="url"
              value={formData.docsUrl}
              onChange={(e) => setFormData({ ...formData, docsUrl: e.target.value })}
              placeholder="https://github.com/user/project/wiki"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Live Demo / Web Interface URL</label>
            <input
              type="url"
              value={formData.liveDemoUrl}
              onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
              placeholder="https://demo.project.com"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* SECTION F — MEDIA & GALLERY */}
      <Card padding="lg" className="space-y-6 border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase border-b border-slate-800 pb-3">
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <span>Section F — Media & Showcase Graphics</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">
              Primary Thumbnail Image URL <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300">
                Gallery Image URLs ({formData.gallery.length})
              </label>
              <Button type="button" variant="outline" size="sm" icon={<Plus className="w-3 h-3" />} onClick={addGalleryImage}>
                Add Gallery Image
              </Button>
            </div>

            {formData.gallery.map((img, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleGalleryChange(idx, e.target.value)}
                  placeholder={`Gallery image URL #${idx + 1}...`}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(idx)}
                  className="p-2 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* SECTION G — PUBLISHING & SETTINGS */}
      <Card padding="lg" className="space-y-6 border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase border-b border-slate-800 pb-3">
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Section G — Publication & Visibility Settings</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded text-engineering-blue focus:ring-engineering-blue bg-slate-800 border-slate-700"
            />
            <div>
              <div className="text-xs font-bold text-white font-mono">Published Publicly</div>
              <div className="text-[10px] text-slate-400">Visible on public portfolio</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
            />
            <div>
              <div className="text-xs font-bold text-white font-mono">Featured Showcase</div>
              <div className="text-[10px] text-slate-400">Prioritized in hero / top grid</div>
            </div>
          </label>

          <div className="space-y-1.5 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <label className="text-xs font-mono text-slate-300 font-bold block">
              Display Sort Order
            </label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/projects')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={<Save className="w-5 h-5" />}
        >
          {isEditMode ? 'Update Project Specification' : 'Save & Publish Project'}
        </Button>
      </div>
    </form>
  );
};
