import { useState, useEffect } from 'react';

export const useScrollSpy = (sectionIds: string[], offset = 120): string => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      // Check if at the top
      if (window.scrollY < 100) {
        setActiveSection(sectionIds[0] || 'hero');
        return;
      }

      // Check if near bottom of page
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 80) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionIds[i]);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
};
