import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useNavigation } from '../hooks/useNavigation';
import { cadFilesystemService } from '../services/cadFilesystemService';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { SpecTable } from '../components/common/SpecTable';
import { 
  ArrowLeft, 
  Box, 
  Ruler, 
  Weight, 
  Download, 
  FileText, 
  CheckCircle2, 
  ChevronRight,
  Activity
} from 'lucide-react';

export const MechanicalDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getMechanicalBySlug } = usePortfolioData();
  const { navigateToPage, scrollToSection } = useNavigation();

  const mech = slug ? getMechanicalBySlug(slug) : undefined;
  const [activeImage, setActiveImage] = useState<string>('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadCad = async (fileId: string, fileName: string) => {
    if (!mech) return;
    setDownloadingId(fileId);
    try {
      // Use filesystem-based download via the Express backend
      const downloadUrl = cadFilesystemService.getCadDownloadUrl(mech.slug, fileName);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Error downloading CAD file:', e);
    } finally {
      setDownloadingId(null);
    }
  };

  if (!mech) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <Card padding="lg" className="text-center max-w-md space-y-4">
          <div className="text-rose-400 font-mono text-xl font-bold">404 - CAD Design Not Found</div>
          <p className="text-sm text-slate-300">
            The mechanical design specification for <code className="text-amber-300 font-mono">{slug}</code> was not found.
          </p>
          <Button variant="primary" onClick={() => navigateToPage('/')}>
            Return to Portfolio
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 bg-background page-enter">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <button onClick={() => navigateToPage('/')} className="hover:text-white transition-colors">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => scrollToSection('mechanical')} className="hover:text-white transition-colors">
            Mechanical CAD
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-amber-400 font-semibold">{mech.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Banner */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowLeft className="w-3.5 h-3.5" />}
              onClick={() => scrollToSection('mechanical')}
            >
              Back to Showroom
            </Button>
            <Badge variant="amber" size="md">
              {mech.category}
            </Badge>
            <span className="text-xs font-mono text-slate-400">
              Year {mech.year}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
              {mech.title}
            </h1>
            <p className="text-base sm:text-lg text-amber-400 font-mono">
              {mech.tagline}
            </p>
          </div>

          {/* Core Mechanical Specs Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/90 border border-amber-500/20 text-xs font-mono">
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Dimensions:</span>
              <span className="text-amber-300 font-semibold flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5" />
                {mech.dimensions}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Mass:</span>
              <span className="text-slate-200 font-semibold flex items-center gap-1">
                <Weight className="w-3.5 h-3.5 text-slate-400" />
                {mech.weight}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">CAD Software:</span>
              <span className="text-slate-200 font-semibold">{mech.cadSoftware.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Tolerances:</span>
              <span className="text-slate-200 font-semibold truncate block">{mech.tolerances}</span>
            </div>
          </div>
        </div>

        {/* CAD Render Showcase */}
        <div className="space-y-4">
          <div className="relative h-[340px] sm:h-[480px] w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
            <img
              src={activeImage || cadFilesystemService.getThumbnailUrl(mech.slug)}
              alt={mech.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (img.src !== mech.thumbnail) {
                  img.src = mech.thumbnail;
                }
              }}
            />
          </div>

          {mech.gallery && mech.gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {mech.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-20 w-32 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImage === img ? 'border-amber-400 shadow-tech-amber' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Render thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Narrative & Technical Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <Card padding="lg" className="space-y-4 border-slate-800">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Box className="w-5 h-5 text-amber-400" />
                <span>Design Narrative & Engineering Challenges</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {mech.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">
                    The Mechanical Problem:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {mech.problem}
                  </p>
                </div>

                <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                    CAD & DFM Solution:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {mech.solution}
                  </p>
                </div>
              </div>
            </Card>

            <Card padding="lg" className="space-y-4 border-slate-800">
              <h3 className="text-lg font-bold text-white">
                Key Mechanical Innovations & Features
              </h3>
              <ul className="space-y-3">
                {mech.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {mech.feaResults && (
              <Card padding="lg" className="space-y-3 border-cyan-500/30 bg-cyan-950/10">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-base">
                  <Activity className="w-5 h-5" />
                  <span>FEA Stress & Structural Simulation Validation</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {mech.feaResults}
                </p>
              </Card>
            )}

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white font-mono uppercase">
                Technical Parameter Specification Table
              </h3>
              <SpecTable specs={mech.specifications} />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card padding="md" className="space-y-3 border-slate-800">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Bill of Materials & Alloys:
              </div>
              <div className="space-y-2">
                {mech.materials.map((mat, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800 text-xs font-mono text-amber-200">
                    {mat}
                  </div>
                ))}
              </div>
            </Card>

            <Card padding="md" className="space-y-3 border-slate-800">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Fabrication & DFM Methods:
              </div>
              <div className="space-y-2">
                {mech.manufacturingMethods.map((mth, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
                    {mth}
                  </div>
                ))}
              </div>
            </Card>

            <Card padding="md" className="space-y-3 border-slate-800">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
                <span>CAD Files ({mech.cadFiles.length})</span>
                <Download className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="space-y-2">
                {mech.cadFiles.length === 0 ? (
                  <p className="text-[11px] font-mono text-slate-500 py-2">No CAD attachments.</p>
                ) : (
                  mech.cadFiles.map((file) => (
                    <div key={file.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-200 font-semibold truncate block max-w-[180px]">
                          {file.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                          {file.format}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Size: {file.size}</span>
                        <button
                          onClick={() => handleDownloadCad(file.id, file.name)}
                          disabled={downloadingId === file.id}
                          className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 focus:outline-none"
                        >
                          <Download className="w-3 h-3" />
                          <span>{downloadingId === file.id ? 'Downloading...' : 'Download'}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {mech.drawings && mech.drawings.length > 0 && (
              <Card padding="md" className="space-y-3 border-slate-800">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
                  <span>2D Drawings ({mech.drawings.length})</span>
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="space-y-2">
                  {mech.drawings.map((drw) => (
                    <div key={drw.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <div className="text-xs font-bold text-white">{drw.title}</div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {drw.drawingNumber} • {drw.revision}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
