import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Edit3, 
  Copy, 
  Trash2, 
  ArrowUpRight, 
  Star
} from 'lucide-react';

export const ProjectsManagerPage: React.FC = () => {
  const navigate = useNavigate();
  const { allProjects, saveProject, deleteProject, duplicateProject } = usePortfolioData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; title: string } | null>(null);

  const categories = ['All', 'Robotics', 'Embedded Systems', 'Computer Vision', 'Control Systems', 'IoT & Industrial', 'Software Engineering'];

  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const togglePublish = (id: string) => {
    const proj = allProjects.find(p => p.id === id);
    if (proj) {
      saveProject({ ...proj, published: !proj.published });
    }
  };

  const toggleFeatured = (id: string) => {
    const proj = allProjects.find(p => p.id === id);
    if (proj) {
      saveProject({ ...proj, featured: !proj.featured });
    }
  };

  const handleDuplicate = (id: string) => {
    const duplicated = duplicateProject(id);
    if (duplicated) {
      navigate(`/admin/projects/${duplicated.id}/edit`);
    }
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-engineering-cyan" />
            <h1 className="text-2xl font-bold font-display text-white">
              Projects Manager
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Manage software, firmware, robotics projects, and local filesystem runtimes.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/admin/projects/new')}
        >
          Add New Project
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects or technologies..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-engineering-cyan"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-engineering-cyan text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card padding="none" className="overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Project</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Year</th>
                <th className="px-4 py-3.5">Runtime Status</th>
                <th className="px-4 py-3.5">Featured</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No projects found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-900/50 transition-colors">
                    {/* Project & Thumbnail */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.thumbnail}
                          alt=""
                          className="w-12 h-9 rounded-lg object-cover bg-slate-800 border border-slate-700 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white text-sm truncate max-w-xs sm:max-w-sm">
                            {project.title}
                          </div>
                          <div className="text-[11px] text-cyan-400 truncate">
                            /{project.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {project.category}
                      </span>
                    </td>

                    {/* Year */}
                    <td className="px-4 py-4 text-slate-400">{project.year}</td>

                    {/* Runtime Status */}
                    <td className="px-4 py-4">
                      {project.runtimeUrl || project.hasZip ? (
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="truncate max-w-[120px]">{project.entryPoint || 'index.html'}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600">No Files</span>
                      )}
                    </td>

                    {/* Featured Toggle */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleFeatured(project.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          project.featured
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                            : 'bg-slate-900 text-slate-600 border-slate-800 hover:text-slate-400'
                        }`}
                        title={project.featured ? 'Featured on Home' : 'Not Featured'}
                      >
                        <Star className={`w-3.5 h-3.5 ${project.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    {/* Published Toggle */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => togglePublish(project.id)}
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold border transition-all ${
                          project.published
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {project.published ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right space-x-1.5">
                      <button
                        onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDuplicate(project.id)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 transition-colors"
                        title="Duplicate Project"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 transition-colors"
                        title="View Public Page"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => setProjectToDelete({ id: project.id, title: project.title })}
                        className="p-1.5 rounded-lg bg-rose-950/30 text-rose-400 border border-rose-500/30 hover:bg-rose-900/40 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={projectToDelete !== null}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project Specification"
        message={`Are you sure you want to permanently delete "${projectToDelete?.title}" and its isolated project files? This action cannot be undone.`}
        confirmLabel="Delete Project"
        variant="danger"
      />
    </div>
  );
};
