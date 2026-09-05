import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  FolderKanban, 
  Cog, 
  Plus, 
  Edit3, 
  ArrowUpRight
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { allProjects, allMechanicalDesigns, certifications, achievements, publications, saveProject } = usePortfolioData();

  const totalProjects = allProjects.length;
  const publishedProjects = allProjects.filter(p => p.published).length;
  const draftProjects = totalProjects - publishedProjects;

  const totalMechanical = allMechanicalDesigns.length;
  const publishedMechanical = allMechanicalDesigns.filter(m => m.published).length;

  const toggleProjectPublish = (id: string) => {
    const proj = allProjects.find(p => p.id === id);
    if (proj) {
      saveProject({ ...proj, published: !proj.published });
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time control center for projects, mechanical CAD models, and portfolio sections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/admin/projects/new')}
          >
            Add Project
          </Button>

          <Button
            variant="amber"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/admin/mechanical/new')}
          >
            Add CAD Model
          </Button>
        </div>
      </div>

      {/* Dynamic Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card padding="md" className="border-slate-800 bg-slate-900/60">
          <div className="text-xs font-mono text-slate-400 uppercase">Total Projects</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{totalProjects}</div>
          <div className="text-[11px] font-mono text-cyan-400 mt-1 flex items-center gap-1">
            <span>{publishedProjects} Published</span>
          </div>
        </Card>

        <Card padding="md" className="border-slate-800 bg-slate-900/60">
          <div className="text-xs font-mono text-slate-400 uppercase">Draft Projects</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{draftProjects}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">Unpublished</div>
        </Card>

        <Card padding="md" className="border-slate-800 bg-slate-900/60">
          <div className="text-xs font-mono text-slate-400 uppercase">CAD Designs</div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">{totalMechanical}</div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">{publishedMechanical} Active</div>
        </Card>

        <Card padding="md" className="border-slate-800 bg-slate-900/60">
          <div className="text-xs font-mono text-slate-400 uppercase">Certifications</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{certifications.length}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">Verified Badges</div>
        </Card>

        <Card padding="md" className="border-slate-800 bg-slate-900/60">
          <div className="text-xs font-mono text-slate-400 uppercase">Achievements</div>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">{achievements.length}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">Honors & Awards</div>
        </Card>

        <Card padding="md" className="border-slate-800 bg-slate-900/60">
          <div className="text-xs font-mono text-slate-400 uppercase">Publications</div>
          <div className="text-2xl font-bold font-mono text-sky-400 mt-1">{publications.length}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">Research Papers</div>
        </Card>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => navigate('/admin/projects/new')}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-engineering-blue/60 hover:shadow-tech-blue cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="text-xs font-mono text-cyan-400 font-semibold uppercase">Project Pipeline</div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-300">
              Upload New Project ZIP
            </h3>
            <p className="text-xs text-slate-400">Extract archive and configure entrypoint</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-800 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
        </div>

        <div 
          onClick={() => navigate('/admin/mechanical/new')}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 hover:shadow-tech-amber cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="text-xs font-mono text-amber-400 font-semibold uppercase">Mechanical Showroom</div>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-300">
              New CAD Design Spec
            </h3>
            <p className="text-xs text-slate-400">Add 3D model, drawings & materials</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
        </div>

        <div 
          onClick={() => navigate('/admin/profile')}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="text-xs font-mono text-slate-400 font-semibold uppercase">Profile Settings</div>
            <h3 className="text-sm font-bold text-white group-hover:text-slate-200">
              Update Hero & Philosophy
            </h3>
            <p className="text-xs text-slate-400">Edit bio, stats, and contact channels</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Edit3 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <Card padding="none" className="border-slate-800 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-engineering-cyan" />
            <h3 className="text-base font-bold text-white">
              Projects Overview ({allProjects.length})
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/projects')}
          >
            Manage All Projects
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Project Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">ZIP / Runnable</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {allProjects.slice(0, 5).map((project) => (
                <tr key={project.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={project.thumbnail}
                        alt=""
                        className="w-10 h-8 rounded object-cover bg-slate-800"
                      />
                      <div>
                        <div className="font-bold text-white truncate max-w-xs">{project.title}</div>
                        <div className="text-[10px] text-slate-500">/{project.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-300">{project.category}</td>
                  <td className="px-4 py-3.5 text-slate-400">{project.year}</td>
                  <td className="px-4 py-3.5">
                    {project.hasZip ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                        {project.entryPoint || 'index.html'}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">No ZIP</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleProjectPublish(project.id)}
                      className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all ${
                        project.published
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {project.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <a
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300"
                      title="View Public Page"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Mechanical Designs */}
      <Card padding="none" className="border-slate-800 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cog className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Mechanical & CAD Designs ({allMechanicalDesigns.length})
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/mechanical')}
          >
            Manage All CAD Models
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">CAD Model</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Dimensions</th>
                <th className="px-4 py-3">Primary Material</th>
                <th className="px-4 py-3">CAD Software</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {allMechanicalDesigns.slice(0, 5).map((mech) => (
                <tr key={mech.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={mech.thumbnail}
                        alt=""
                        className="w-10 h-8 rounded object-cover bg-slate-800"
                      />
                      <div>
                        <div className="font-bold text-white truncate max-w-xs">{mech.title}</div>
                        <div className="text-[10px] text-slate-500">/{mech.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-300">{mech.category}</td>
                  <td className="px-4 py-3.5 text-amber-300">{mech.dimensions}</td>
                  <td className="px-4 py-3.5 text-slate-300">{mech.materials[0]}</td>
                  <td className="px-4 py-3.5 text-slate-400">{mech.cadSoftware.join(', ')}</td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/admin/mechanical/${mech.id}/edit`)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <a
                      href={`/mechanical/${mech.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-300"
                      title="View Public Page"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
