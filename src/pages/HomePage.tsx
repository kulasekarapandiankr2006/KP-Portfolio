import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { FocusAreasSection } from '../components/sections/FocusAreasSection';
import { ExperienceSection } from '../components/sections/ExperienceSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { MechanicalSection } from '../components/sections/MechanicalSection';
import { SkillsSection } from '../components/sections/SkillsSection';
import { EducationSection } from '../components/sections/EducationSection';
import { PublicationsSection } from '../components/sections/PublicationsSection';
import { CertificationsSection } from '../components/sections/CertificationsSection';
import { CompetitionsSection } from '../components/sections/CompetitionsSection';
import { ContactSection } from '../components/sections/ContactSection';

export const HomePage: React.FC = () => {
  const location = useLocation();

  // Handle incoming scroll requests via search params (e.g. /?section=experience)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectionParam = params.get('section');
    const hash = location.hash.replace('#', '');
    const targetId = sectionParam || hash;

    if (targetId) {
      // Small timeout to guarantee DOM is rendered
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const navHeight = 72;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - navHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [location.search, location.hash]);

  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <AboutSection />
      <FocusAreasSection />
      <ExperienceSection />
      <ProjectsSection />
      <MechanicalSection />
      <SkillsSection />
      <EducationSection />
      <PublicationsSection />
      <CertificationsSection />
      <CompetitionsSection />
      <ContactSection />
    </main>
  );
};
