import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { cadFilesystemService } from '../../services/cadFilesystemService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TagInput } from '../components/TagInput';
import { CadUploader } from '../components/CadUploader';
import type { 
  MechanicalDesign, 
  MechanicalCategory, 
  MechanicalSpecItem
} from '../../types/mechanical';
import { 
  Cog, 
  Save, 
  ArrowLeft, 
  Ruler, 
  Box, 
  Image as ImageIcon, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Layers, 
  Activity,
  Upload,
  HardDrive
} from 'lucide-react';

const MECHANICAL_CATEGORIES: MechanicalCategory[] = [
  'Robotic Mechanism',
  'Chassis & Structure',
  'Actuator & Drivetrain',
  'Enclosure & Packaging',
  'Tooling & Fixtures',
  'Biomechanical Design',
  'Aero & Fluid Structure',
];

export const MechanicalFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allMechanicalDesigns, saveMechanicalDesign } = usePortfolioData();

  const isEditMode = Boolean(id);
  const existingDesign = id ? allMechanicalDesigns.find(m => m.id === id) : undefined;

  const [formData, setFormData] = useState<MechanicalDesign>(() => {
    if (existingDesign) return { ...existingDesign };
    return {
      id: `mech-${Date.now()}`,
      slug: '',
      title: '',
      tagline: '',
      description: '',
      category: 'Actuator & Drivetrain',
      year: new Date().getFullYear().toString(),
      dimensions: 'Ø 96 mm x 42 mm length',
      weight: '485 grams',
      materials: ['Aircraft Aluminum 7075-T6', 'Hardened Tool Steel O1'],
      manufacturingMethods: ['CNC 4-Axis Milling', 'Wire EDM'],
      tolerances: 'ISO 2768-f, Bearing seats: k5/h6',
      cadSoftware: ['SolidWorks 2024'],
      simulationSoftware: ['ANSYS Workbench FEA'],
      problem: '',
      solution: '',
      keyFeatures: [''],
      feaResults: '',
      specifications: [
        { label: 'Reduction Ratio', value: '6:1', unit: '', category: 'Kinematics' },
        { label: 'Peak Torque', value: '48.0', unit: 'Nm', category: 'Performance' },
        { label: 'Backlash', value: '< 1.2', unit: 'arcmin', category: 'Kinematics' }
      ],
      thumbnail: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?fit=crop&w=800&h=500&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?fit=crop&w=1200&h=800&q=80'
      ],
      cadFiles: [],
      drawings: [],
      published: true,
      featured: false,
      displayOrder: allMechanicalDesigns.length + 1,
    };
  });

  const [autoSlug, setAutoSlug] = useState(!isEditMode);
  const [successToast, setSuccessToast] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailMsg, setThumbnailMsg] = useState<string | null>(null);
  const [thumbnailHasFile, setThumbnailHasFile] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // On mount: scan existing folder in edit mode (read-only, no folder creation)
  useEffect(() => {
    if (isEditMode && formData.slug) {
      cadFilesystemService.scanMechanicalDesign(formData.slug).then((scan) => {
        setThumbnailHasFile(scan.hasThumbnail);
      });
    }
  }, []);

  const handleTitleChange = (newTitle: string) => {
    setFormData(prev => {
      const updated = { ...prev, title: newTitle };
      if (autoSlug) {
        updated.slug = newTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handleThumbnailUpload = async (file: File | undefined) => {
    if (!file || !formData.slug) return;
    setThumbnailUploading(true);
    setThumbnailMsg(null);
    try {
      const result = await cadFilesystemService.uploadThumbnail(formData.slug, file);
      if (result.success) {
        setThumbnailHasFile(true);
        setThumbnailMsg('Thumbnail saved to thumbnail/<slug>.png on filesystem.');
        setTimeout(() => setThumbnailMsg(null), 3500);
      } else {
        setThumbnailMsg(`Upload failed: ${result.error || 'Unknown error'}`);
      }
    } catch (e) {
      setThumbnailMsg('Thumbnail upload error.');
    } finally {
      setThumbnailUploading(false);
    }
  };

  // Feature items
  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...formData.keyFeatures];
    updated[index] = val;
    setFormData({ ...formData, keyFeatures: updated });
  };

  const addFeature = () => {
    setFormData({ ...formData, keyFeatures: [...formData.keyFeatures, ''] });
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, keyFeatures: formData.keyFeatures.filter((_, idx) => idx !== index) });
  };

  // Specifications Dynamic Rows
  const handleSpecChange = (index: number, field: keyof MechanicalSpecItem, val: string) => {
    const updated = [...formData.specifications];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, specifications: updated });
  };

  const addSpecItem = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { label: '', value: '', unit: '', category: 'Geometry' }]
    });
  };

  const removeSpecItem = (index: number) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_, idx) => idx !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanDesign: MechanicalDesign = {
      ...formData,
      keyFeatures: formData.keyFeatures.filter(f => f.trim().length > 0),
      specifications: formData.specifications.filter(s => s.label.trim().length > 0),
      gallery: formData.gallery.filter(g => g.trim().length > 0),
    };

    // Create filesystem folders only on explicit submit
    if (cleanDesign.slug) {
      cadFilesystemService.initMechanicalDesign(cleanDesign.slug).catch(() => {
        // server might be offline
      });
    }

    saveMechanicalDesign(cleanDesign);
    setSuccessToast(true);

    setTimeout(() => {
      navigate('/admin/mechanical');
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top Sticky Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 sticky top-16 bg-slate-950/95 backdrop-blur-md z-20 py-2">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/admin/mechanical')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold font-display text-white">
              {isEditMode ? `Edit CAD Design: ${formData.title}` : 'New Mechanical CAD Specification'}
            </h1>
            <p className="text-xs font-mono text-amber-400">
              Slug: /{formData.slug || 'cad-slug'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/mechanical')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="amber"
            size="md"
            icon={<Save className="w-4 h-4" />}
          >
            {isEditMode ? 'Update CAD Design' : 'Save & Publish Model'}
          </Button>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Mechanical CAD specification saved to local persistent storage!</span>
        </div>
      )}

      {/* SECTION A — BASIC CAD INFO */}
      <Card padding="lg" className="space-y-6 border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase border-b border-slate-800 pb-3">
          <Cog className="w-4 h-4 text-amber-400" />
          <span>Section A — Basic CAD & Mechanism Details</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-mono text-slate-300">
              CAD Model Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Low-Backlash Cycloidal Actuator for Legged Robotics"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-amber-400"
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
                className="text-[10px] font-mono text-amber-400 hover:underline"
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
              placeholder="cycloidal-actuator-gearbox"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 text-xs font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">
              Mechanical Category <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as MechanicalCategory })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
            >
              {MECHANICAL_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-mono text-slate-300">
              Tagline / Mechanism Subtitle <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. High-Torque Density 6:1 Cycloidal Reduction with Integrated Crossed Roller Bearings"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-mono text-slate-300">
              Mechanical Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Functional principles, gear tooth geometry, kinematic packaging..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none resize-none"
            />
          </div>
        </div>
      </Card>

      {/* SECTION B — TECHNICAL SPECIFICATIONS & DFM */}
      <Card padding="lg" className="space-y-6 border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase border-b border-slate-800 pb-3">
          <Ruler className="w-4 h-4 text-amber-400" />
          <span>Section B — Physical Specs, Tolerances & Materials</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Dimensions (L x W x H)</label>
            <input
              type="text"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              placeholder="Ø 96 mm x 42 mm length"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 text-xs font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Mass / Total Weight</label>
            <input
              type="text"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="485 grams"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Tolerances & Standard</label>
            <input
              type="text"
              value={formData.tolerances}
              onChange={(e) => setFormData({ ...formData, tolerances: e.target.value })}
              placeholder="ISO 2768-f; Pin bores: H7"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <TagInput
            label="Materials & Alloys (BOM)"
            tags={formData.materials}
            onChange={(tags) => setFormData({ ...formData, materials: tags })}
            variant="amber"
            placeholder="e.g. Aluminum 7075-T6, Tool Steel O1..."
          />

          <TagInput
            label="Manufacturing & Fabrication Methods"
            tags={formData.manufacturingMethods}
            onChange={(tags) => setFormData({ ...formData, manufacturingMethods: tags })}
            variant="cyan"
            placeholder="e.g. CNC 4-Axis, Wire EDM, SLA 3D..."
          />

          <TagInput
            label="CAD Modeling Software"
            tags={formData.cadSoftware}
            onChange={(tags) => setFormData({ ...formData, cadSoftware: tags })}
            variant="blue"
            placeholder="e.g. SolidWorks 2024, Fusion 360..."
          />

          <TagInput
            label="FEA & Simulation Tools"
            tags={formData.simulationSoftware || []}
            onChange={(tags) => setFormData({ ...formData, simulationSoftware: tags })}
            variant="emerald"
            placeholder="e.g. ANSYS Workbench, SolidWorks FEA..."
          />
        </div>
      </Card>

      {/* SECTION C — NARRATIVE & FEA SIMULATION */}
      <Card padding="lg" className="space-y-6 border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase border-b border-slate-800 pb-3">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Section C — Design Narrative & FEA Analysis</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-rose-400 font-semibold">
              The Mechanical Challenge / Defect in Prior Art:
            </label>
            <textarea
              rows={2}
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              placeholder="Why standard planetary or harmonic drives failed in this scenario..."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-amber-400 font-semibold">
              CAD Solution & Kinetic Geometry:
            </label>
            <textarea
              rows={2}
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              placeholder="How the dual cycloidal disc offset and pin roller geometry solves this..."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-cyan-400 font-semibold">
              FEA Stress & Deflection Analysis Results:
            </label>
            <textarea
              rows={2}
              value={formData.feaResults || ''}
              onChange={(e) => setFormData({ ...formData, feaResults: e.target.value })}
              placeholder="Von Mises peak stress, safety factor, torsional stiffness..."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none"
            />
          </div>

          {/* Key Features */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Key Mechanical Innovations:
              </label>
              <Button type="button" variant="outline" size="sm" icon={<Plus className="w-3 h-3" />} onClick={addFeature}>
                Add Feature
              </Button>
            </div>

            {formData.keyFeatures.map((feat, idx) => (
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
        </div>
      </Card>

      {/* SECTION D — DYNAMIC PARAMETER SPEC TABLE */}
      <Card padding="lg" className="space-y-4 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Section D — Parametric Engineering Specification Table</span>
          </div>
          <Button type="button" variant="outline" size="sm" icon={<Plus className="w-3 h-3" />} onClick={addSpecItem}>
            Add Parameter Row
          </Button>
        </div>

        <div className="space-y-2">
          {formData.specifications.map((spec, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <input
                type="text"
                value={spec.label}
                onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                placeholder="Parameter (e.g. Reduction Ratio)"
                className="sm:col-span-4 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                placeholder="Value (e.g. 6:1)"
                className="sm:col-span-3 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none"
              />
              <input
                type="text"
                value={spec.unit || ''}
                onChange={(e) => handleSpecChange(idx, 'unit', e.target.value)}
                placeholder="Unit (e.g. Nm, mm)"
                className="sm:col-span-2 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-400 focus:outline-none"
              />
              <select
                value={spec.category || 'Geometry'}
                onChange={(e) => handleSpecChange(idx, 'category', e.target.value)}
                className="sm:col-span-2 px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 focus:outline-none"
              >
                <option value="Geometry">Geometry</option>
                <option value="Material">Material</option>
                <option value="Kinematics">Kinematics</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Performance">Performance</option>
              </select>
              <button
                type="button"
                onClick={() => removeSpecItem(idx)}
                className="sm:col-span-1 p-1.5 text-slate-500 hover:text-rose-400 flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* SECTION E — REAL CAD FILES ATTACHMENTS */}
      <Card padding="lg" className="space-y-4 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase">
            <Box className="w-4 h-4 text-amber-400" />
            <span>Section E — Real CAD File Attachments & 3D Models</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            Real Binary Persistence
          </span>
        </div>

        <CadUploader
          mechSlug={formData.slug}
          cadFiles={formData.cadFiles}
          onChange={(cadFiles) => setFormData({ ...formData, cadFiles })}
        />
      </Card>

      {/* SECTION F — MEDIA & SETTINGS */}
      <Card padding="lg" className="space-y-6 border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase border-b border-slate-800 pb-3">
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <span>Section F — Media & Visibility</span>
        </div>

        <div className="space-y-4">
          {/* Filesystem thumbnail upload */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-mono text-slate-300 font-semibold">Filesystem Thumbnail</span>
              </div>
              {thumbnailHasFile && (
                <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Thumbnail found on disk
                </span>
              )}
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Stored as: <code className="text-amber-300">mechanical-designs/{formData.slug || '[slug]'}/thumbnail/{formData.slug || '[slug]'}.png</code>
              <br />
              Manually placing a file there works identically to uploading below.
            </div>

            <div className="flex items-center gap-3">
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => handleThumbnailUpload(e.target.files?.[0])}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<Upload className="w-3.5 h-3.5" />}
                loading={thumbnailUploading}
                onClick={() => thumbnailInputRef.current?.click()}
              >
                {thumbnailHasFile ? 'Replace Thumbnail' : 'Upload Thumbnail'}
              </Button>

              {formData.slug && thumbnailHasFile && (
                <img
                  src={cadFilesystemService.getThumbnailUrl(formData.slug)}
                  alt="Current thumbnail"
                  className="w-16 h-12 object-cover rounded-lg border border-slate-700"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>

            {thumbnailMsg && (
              <div className={`p-2 rounded text-[11px] font-mono ${thumbnailMsg.includes('failed') || thumbnailMsg.includes('error') ? 'text-rose-300 bg-rose-950/40' : 'text-emerald-300 bg-emerald-950/40'}`}>
                {thumbnailMsg}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">
              CAD Render / Thumbnail URL <span className="text-slate-500">(fallback if no filesystem thumbnail)</span>
            </label>
            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
            <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
              />
              <div>
                <div className="text-xs font-bold text-white font-mono">Published Publicly</div>
                <div className="text-[10px] text-slate-400">Visible in CAD showroom</div>
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
                <div className="text-xs font-bold text-white font-mono">Featured CAD Model</div>
                <div className="text-[10px] text-slate-400">Highlighted on homepage</div>
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
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/mechanical')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="amber"
          size="lg"
          icon={<Save className="w-5 h-5" />}
        >
          {isEditMode ? 'Update CAD Model Specification' : 'Save & Publish CAD Model'}
        </Button>
      </div>
    </form>
  );
};
