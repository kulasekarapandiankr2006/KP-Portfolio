import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import type { SkillGroup, SkillItem } from '../../types/portfolio';
import { 
  Cpu, 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2 
} from 'lucide-react';

export const SkillsEditorPage: React.FC = () => {
  const { skillGroups, updateSkillGroups } = usePortfolioData();
  const [groups, setGroups] = useState<SkillGroup[]>(() => [...skillGroups]);
  const [saved, setSaved] = useState(false);

  const handleGroupFieldChange = (groupIndex: number, field: keyof SkillGroup, val: any) => {
    const updated = [...groups];
    updated[groupIndex] = { ...updated[groupIndex], [field]: val };
    setGroups(updated);
  };

  const handleSkillChange = (groupIndex: number, skillIndex: number, field: keyof SkillItem, val: any) => {
    const updated = [...groups];
    const skills = [...updated[groupIndex].skills];
    skills[skillIndex] = { ...skills[skillIndex], [field]: val };
    updated[groupIndex] = { ...updated[groupIndex], skills };
    setGroups(updated);
  };

  const addSkill = (groupIndex: number) => {
    const updated = [...groups];
    updated[groupIndex] = {
      ...updated[groupIndex],
      skills: [
        ...updated[groupIndex].skills,
        { name: '', level: 'Advanced', highlighted: false }
      ]
    };
    setGroups(updated);
  };

  const removeSkill = (groupIndex: number, skillIndex: number) => {
    const updated = [...groups];
    updated[groupIndex] = {
      ...updated[groupIndex],
      skills: updated[groupIndex].skills.filter((_, idx) => idx !== skillIndex)
    };
    setGroups(updated);
  };

  const addGroup = () => {
    setGroups([
      ...groups,
      {
        id: `group-${Date.now()}`,
        category: 'New Technical Category',
        description: 'Category description...',
        icon: 'Cpu',
        skills: [{ name: 'Skill 1', level: 'Advanced', highlighted: true }],
      }
    ]);
  };

  const removeGroup = (groupIndex: number) => {
    setGroups(groups.filter((_, idx) => idx !== groupIndex));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSkillGroups(groups);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 sticky top-16 bg-slate-950/95 backdrop-blur-md z-20 py-2">
        <div>
          <h1 className="text-xl font-bold font-display text-white">
            Technical Skills Matrix Management
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Manage hardware, firmware, CAD, software categories, proficiency levels, and highlighted skills.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={addGroup}
          >
            Add Skill Category
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Save className="w-4 h-4" />}
          >
            Save Skills Matrix
          </Button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Technical skills matrix saved successfully!</span>
        </div>
      )}

      <div className="space-y-8">
        {groups.map((group, groupIdx) => (
          <Card key={group.id || groupIdx} padding="lg" className="space-y-5 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  Category #{groupIdx + 1}: {group.category} ({group.skills.length} skills)
                </span>
              </div>

              <button
                type="button"
                onClick={() => removeGroup(groupIdx)}
                className="text-slate-500 hover:text-rose-400 p-1"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Category Name</label>
                <input
                  type="text"
                  required
                  value={group.category}
                  onChange={(e) => handleGroupFieldChange(groupIdx, 'category', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Subtitle / Domain Description</label>
                <input
                  type="text"
                  required
                  value={group.description}
                  onChange={(e) => handleGroupFieldChange(groupIdx, 'description', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Individual Skills List */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                  Skills in this category:
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-3 h-3" />}
                  onClick={() => addSkill(groupIdx)}
                >
                  Add Skill
                </Button>
              </div>

              <div className="space-y-2">
                {group.skills.map((skill, skillIdx) => (
                  <div key={skillIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2 rounded-lg bg-slate-900/70 border border-slate-800 items-center">
                    <input
                      type="text"
                      required
                      value={skill.name}
                      onChange={(e) => handleSkillChange(groupIdx, skillIdx, 'name', e.target.value)}
                      placeholder="Skill name (e.g. STM32 / ARM Cortex-M)"
                      className="sm:col-span-6 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none"
                    />

                    <select
                      value={skill.level || 'Advanced'}
                      onChange={(e) => handleSkillChange(groupIdx, skillIdx, 'level', e.target.value)}
                      className="sm:col-span-3 px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none"
                    >
                      <option value="Expert">Expert</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Familiar">Familiar</option>
                    </select>

                    <label className="sm:col-span-2 flex items-center gap-1.5 text-xs font-mono text-slate-300 cursor-pointer pl-1">
                      <input
                        type="checkbox"
                        checked={skill.highlighted || false}
                        onChange={(e) => handleSkillChange(groupIdx, skillIdx, 'highlighted', e.target.checked)}
                        className="rounded bg-slate-800 border-slate-700 text-cyan-500"
                      />
                      <span className="text-[11px]">Highlight</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => removeSkill(groupIdx, skillIdx)}
                      className="sm:col-span-1 p-1.5 text-slate-500 hover:text-rose-400 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </form>
  );
};
