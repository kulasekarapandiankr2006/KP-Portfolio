import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ConfirmModal } from '../components/ConfirmModal';
import { 
  Cog, 
  Plus, 
  Search, 
  Edit3, 
  Copy, 
  Trash2, 
  ArrowUpRight, 
  Star
} from 'lucide-react';

export const MechanicalManagerPage: React.FC = () => {
  const navigate = useNavigate();
  const { allMechanicalDesigns, saveMechanicalDesign, deleteMechanicalDesign, duplicateMechanicalDesign } = usePortfolioData();

  const [searchTerm, setSearchTerm] = useState('');
  const [designToDelete, setDesignToDelete] = useState<{ id: string; title: string } | null>(null);

  const filteredDesigns = allMechanicalDesigns.filter((mech) => {
    const matchesSearch = mech.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mech.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mech.materials.some(m => m.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mech.cadSoftware.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const togglePublish = (id: string) => {
    const mech = allMechanicalDesigns.find(m => m.id === id);
    if (mech) {
      saveMechanicalDesign({ ...mech, published: !mech.published });
    }
  };

  const toggleFeatured = (id: string) => {
    const mech = allMechanicalDesigns.find(m => m.id === id);
    if (mech) {
      saveMechanicalDesign({ ...mech, featured: !mech.featured });
    }
  };

  const handleDuplicate = (id: string) => {
    const duplicated = duplicateMechanicalDesign(id);
    if (duplicated) {
      navigate(`/admin/mechanical/${duplicated.id}/edit`);
    }
  };

  const handleDeleteConfirm = () => {
    if (designToDelete) {
      deleteMechanicalDesign(designToDelete.id);
      setDesignToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Cog className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold font-display text-white">
              Mechanical & CAD Designs Manager
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Manage robotic mechanisms, actuators, chassis monocoques, CAD files, and technical drawings.
          </p>
        </div>

        <Button
          variant="amber"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/admin/mechanical/new')}
        >
          Add CAD Design
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search CAD models, materials, tools..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Table */}
      <Card padding="none" className="border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">CAD Model</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Dimensions & Mass</th>
                <th className="px-4 py-3.5">Materials</th>
                <th className="px-4 py-3.5">CAD Software</th>
                <th className="px-4 py-3.5">Featured</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDesigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    No mechanical designs found.
                  </td>
                </tr>
              ) : (
                filteredDesigns.map((mech) => (
                  <tr key={mech.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={mech.thumbnail}
                          alt=""
                          className="w-12 h-9 rounded-lg object-cover bg-slate-800 border border-slate-700 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white text-sm truncate max-w-xs">
                            {mech.title}
                          </div>
                          <div className="text-[11px] text-amber-400 truncate">
                            /{mech.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {mech.category}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-slate-300">
                      <div className="text-amber-300">{mech.dimensions}</div>
                      <div className="text-[10px] text-slate-500">{mech.weight}</div>
                    </td>

                    <td className="px-4 py-4 text-slate-300">
                      <div className="truncate max-w-[140px]">{mech.materials.join(', ')}</div>
                    </td>

                    <td className="px-4 py-4 text-slate-400">
                      <div className="truncate max-w-[140px]">{mech.cadSoftware.join(', ')}</div>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleFeatured(mech.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          mech.featured
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                            : 'bg-slate-900 text-slate-600 border-slate-800 hover:text-slate-400'
                        }`}
                        title={mech.featured ? 'Featured on Home' : 'Not Featured'}
                      >
                        <Star className={`w-3.5 h-3.5 ${mech.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => togglePublish(mech.id)}
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold border transition-all ${
                          mech.published
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {mech.published ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    <td className="px-4 py-4 text-right space-x-1.5">
                      <button
                        onClick={() => navigate(`/admin/mechanical/${mech.id}/edit`)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Edit CAD Model"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDuplicate(mech.id)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-300 hover:bg-slate-700 transition-colors"
                        title="Duplicate CAD Model"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={`/mechanical/${mech.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-300 hover:bg-slate-700 transition-colors"
                        title="View Public Page"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => setDesignToDelete({ id: mech.id, title: mech.title })}
                        className="p-1.5 rounded-lg bg-rose-950/30 text-rose-400 border border-rose-500/30 hover:bg-rose-900/40 transition-colors"
                        title="Delete CAD Model"
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

      <ConfirmModal
        isOpen={designToDelete !== null}
        onClose={() => setDesignToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Mechanical Design"
        message={`Are you sure you want to permanently delete "${designToDelete?.title}"? This will also remove its associated specifications.`}
        confirmLabel="Delete Design"
        variant="danger"
      />
    </div>
  );
};
