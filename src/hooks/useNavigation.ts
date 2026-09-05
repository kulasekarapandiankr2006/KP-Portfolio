import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = useCallback((sectionId: string) => {
    // Clean sectionId in case it was passed with '#'
    const cleanId = sectionId.replace(/^#/, '');

    if (location.pathname === '/' || location.pathname === '') {
      // We are on home page: find element and scroll directly
      const element = document.getElementById(cleanId);
      if (element) {
        const navHeight = 72; // height of sticky navbar
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Update URL hash quietly without breaking history
        window.history.pushState(null, '', `#${cleanId}`);
      } else if (cleanId === 'hero' || cleanId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '/');
      }
    } else {
      // We are on a subpage: navigate to home page with query param
      navigate(`/?section=${cleanId}`);
    }
  }, [location.pathname, navigate]);

  const navigateToPage = useCallback((path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  return {
    scrollToSection,
    navigateToPage,
    currentPath: location.pathname,
    isHomePage: location.pathname === '/' || location.pathname === '',
  };
};
