import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { storageService, initStorageFromServer } from '../services/storageService';
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

interface PortfolioContextType {
  data: PortfolioDatabase;
  // Profile & Focus
  updateProfile: (profile: Partial<Profile>) => void;
  updateFocusAreas: (focusAreas: FocusArea[]) => void;
  // Projects
  projects: Project[];
  featuredProjects: Project[];
  allProjects: Project[];
  getProjectById: (id: string) => Project | undefined;
  getProjectBySlug: (slug: string) => Project | undefined;
  saveProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => Project | null;
  // Mechanical Designs
  mechanicalDesigns: MechanicalDesign[];
  featuredMechanical: MechanicalDesign[];
  allMechanicalDesigns: MechanicalDesign[];
  getMechanicalById: (id: string) => MechanicalDesign | undefined;
  getMechanicalBySlug: (slug: string) => MechanicalDesign | undefined;
  saveMechanicalDesign: (design: MechanicalDesign) => void;
  deleteMechanicalDesign: (id: string) => void;
  duplicateMechanicalDesign: (id: string) => MechanicalDesign | null;
  // Sections
  experiences: Experience[];
  updateExperiences: (experiences: Experience[]) => void;
  education: Education[];
  updateEducation: (education: Education[]) => void;
  skillGroups: SkillGroup[];
  updateSkillGroups: (skillGroups: SkillGroup[]) => void;
  certifications: Certification[];
  updateCertifications: (certifications: Certification[]) => void;
  achievements: Achievement[];
  updateAchievements: (achievements: Achievement[]) => void;
  publications: Publication[];
  updatePublications: (publications: Publication[]) => void;
  competitions: Competition[];
  updateCompetitions: (competitions: Competition[]) => void;
  languages: Language[];
  updateLanguages: (languages: Language[]) => void;
  socialLinks: SocialLink[];
  updateSocialLinks: (socialLinks: SocialLink[]) => void;
  // Utilities
  refreshData: () => void;
  resetToDefaults: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioDatabase>(() => storageService.loadDatabase());

  const refreshData = useCallback(() => {
    setData(storageService.loadDatabase());
  }, []);

  // On mount: load authoritative data from server filesystem
  useEffect(() => {
    initStorageFromServer().then((serverData) => {
      setData(serverData);
    });
  }, []);

  // Poll server every 5 seconds so that changes from other browsers appear
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('/api/cms/data');
        if (res.ok) {
          const json = await res.json() as { found: boolean; data: PortfolioDatabase | null };
          if (json.found && json.data) {
            setData(json.data);
          }
        }
      } catch {
        // server offline — keep current data
      }
    };
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, []);

  // Also listen for same-tab localStorage events (fast path for same-window updates)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kp_mechatronics_portfolio_db_v1') {
        refreshData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshData]);

  // Profile
  const updateProfile = (profile: Partial<Profile>) => {
    storageService.updateProfile(profile);
    refreshData();
  };

  const updateFocusAreas = (focusAreas: FocusArea[]) => {
    storageService.updateFocusAreas(focusAreas);
    refreshData();
  };

  // Projects
  const getProjectById = (id: string) => data.projects.find(p => p.id === id);
  const getProjectBySlug = (slug: string) => data.projects.find(p => p.slug === slug);
  
  const saveProject = (project: Project) => {
    storageService.saveProject(project);
    refreshData();
  };

  const deleteProject = (id: string) => {
    storageService.deleteProject(id);
    refreshData();
  };

  const duplicateProject = (id: string) => {
    const res = storageService.duplicateProject(id);
    refreshData();
    return res;
  };

  // Mechanical Designs
  const getMechanicalById = (id: string) => data.mechanicalDesigns.find(m => m.id === id);
  const getMechanicalBySlug = (slug: string) => data.mechanicalDesigns.find(m => m.slug === slug);

  const saveMechanicalDesign = (design: MechanicalDesign) => {
    storageService.saveMechanicalDesign(design);
    refreshData();
  };

  const deleteMechanicalDesign = (id: string) => {
    storageService.deleteMechanicalDesign(id);
    refreshData();
  };

  const duplicateMechanicalDesign = (id: string) => {
    const res = storageService.duplicateMechanicalDesign(id);
    refreshData();
    return res;
  };

  // Experiences
  const updateExperiences = (experiences: Experience[]) => {
    storageService.updateExperiences(experiences);
    refreshData();
  };

  // Education
  const updateEducation = (education: Education[]) => {
    storageService.updateEducation(education);
    refreshData();
  };

  // Skills
  const updateSkillGroups = (skillGroups: SkillGroup[]) => {
    storageService.updateSkillGroups(skillGroups);
    refreshData();
  };

  // Certifications & Achievements
  const updateCertifications = (certifications: Certification[]) => {
    storageService.updateCertifications(certifications);
    refreshData();
  };

  const updateAchievements = (achievements: Achievement[]) => {
    storageService.updateAchievements(achievements);
    refreshData();
  };

  // Publications
  const updatePublications = (publications: Publication[]) => {
    storageService.updatePublications(publications);
    refreshData();
  };

  // Competitions
  const updateCompetitions = (competitions: Competition[]) => {
    storageService.updateCompetitions(competitions);
    refreshData();
  };

  // Languages
  const updateLanguages = (languages: Language[]) => {
    storageService.updateLanguages(languages);
    refreshData();
  };

  // Social Links
  const updateSocialLinks = (socialLinks: SocialLink[]) => {
    storageService.updateSocialLinks(socialLinks);
    refreshData();
  };

  // Reset
  const resetToDefaults = () => {
    storageService.resetToDefaults();
    refreshData();
  };

  const publishedProjects = data.projects.filter(p => p.published).sort((a, b) => a.displayOrder - b.displayOrder);
  const featuredProjects = publishedProjects.filter(p => p.featured);

  const publishedMechanical = data.mechanicalDesigns.filter(m => m.published).sort((a, b) => a.displayOrder - b.displayOrder);
  const featuredMechanical = publishedMechanical.filter(m => m.featured);

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateProfile,
        updateFocusAreas,
        projects: publishedProjects,
        featuredProjects,
        allProjects: data.projects,
        getProjectById,
        getProjectBySlug,
        saveProject,
        deleteProject,
        duplicateProject,
        mechanicalDesigns: publishedMechanical,
        featuredMechanical,
        allMechanicalDesigns: data.mechanicalDesigns,
        getMechanicalById,
        getMechanicalBySlug,
        saveMechanicalDesign,
        deleteMechanicalDesign,
        duplicateMechanicalDesign,
        experiences: data.experiences,
        updateExperiences,
        education: data.education,
        updateEducation,
        skillGroups: data.skillGroups,
        updateSkillGroups,
        certifications: data.certifications,
        updateCertifications,
        achievements: data.achievements,
        updateAchievements,
        publications: data.publications,
        updatePublications,
        competitions: data.competitions,
        updateCompetitions,
        languages: data.languages,
        updateLanguages,
        socialLinks: data.socialLinks,
        updateSocialLinks,
        refreshData,
        resetToDefaults,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
