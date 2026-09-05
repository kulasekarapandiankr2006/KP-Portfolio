import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { CursorGlow } from './components/layout/CursorGlow';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { MechanicalDetailPage } from './pages/MechanicalDetailPage';
import { ProjectRuntimePage } from './pages/ProjectRuntimePage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Components & Protected Pages
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { AdminLayout } from './admin/components/AdminLayout';
import { DashboardPage } from './admin/pages/DashboardPage';
import { ProjectsManagerPage } from './admin/pages/ProjectsManagerPage';
import { ProjectFormPage } from './admin/pages/ProjectFormPage';
import { MechanicalManagerPage } from './admin/pages/MechanicalManagerPage';
import { MechanicalFormPage } from './admin/pages/MechanicalFormPage';
import { ProfileEditorPage } from './admin/pages/ProfileEditorPage';
import { AboutEditorPage } from './admin/pages/AboutEditorPage';
import { ExperienceEditorPage } from './admin/pages/ExperienceEditorPage';
import { EducationEditorPage } from './admin/pages/EducationEditorPage';
import { SkillsEditorPage } from './admin/pages/SkillsEditorPage';
import { CertificationsEditorPage } from './admin/pages/CertificationsEditorPage';
import { PublicationsEditorPage } from './admin/pages/PublicationsEditorPage';
import { CompetitionsEditorPage } from './admin/pages/CompetitionsEditorPage';
import { LanguagesEditorPage } from './admin/pages/LanguagesEditorPage';
import { SocialsEditorPage } from './admin/pages/SocialsEditorPage';
import { ResumeEditorPage } from './admin/pages/ResumeEditorPage';
import { SettingsPage } from './admin/pages/SettingsPage';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';
  const isRuntimePage = location.pathname.includes('/run');
  const isLoginPage = location.pathname === '/admin/login' || location.pathname === '/login';
  const showPublicHeaderFooter = !isAdminRoute && !isRuntimePage && !isLoginPage;

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      {/* Global UI chrome — only on public pages */}
      {showPublicHeaderFooter && (
        <>
          <div id="scroll-progress" aria-hidden="true" />
          <CursorGlow />
          <Navbar />
        </>
      )}

      <div className="flex-1">
        <Routes>
          {/* Public Portfolio Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/projects/:slug/run" element={<ProjectRuntimePage />} />
          <Route path="/mechanical/:slug" element={<MechanicalDetailPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />

          {/* Protected Admin CMS Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsManagerPage />} />
            <Route path="projects/new" element={<ProjectFormPage />} />
            <Route path="projects/:id/edit" element={<ProjectFormPage />} />
            <Route path="mechanical" element={<MechanicalManagerPage />} />
            <Route path="mechanical/new" element={<MechanicalFormPage />} />
            <Route path="mechanical/:id/edit" element={<MechanicalFormPage />} />
            <Route path="profile" element={<ProfileEditorPage />} />
            <Route path="about" element={<AboutEditorPage />} />
            <Route path="experience" element={<ExperienceEditorPage />} />
            <Route path="education" element={<EducationEditorPage />} />
            <Route path="skills" element={<SkillsEditorPage />} />
            <Route path="certifications" element={<CertificationsEditorPage />} />
            <Route path="achievements" element={<CertificationsEditorPage />} />
            <Route path="publications" element={<PublicationsEditorPage />} />
            <Route path="competitions" element={<CompetitionsEditorPage />} />
            <Route path="languages" element={<LanguagesEditorPage />} />
            <Route path="socials" element={<SocialsEditorPage />} />
            <Route path="resume" element={<ResumeEditorPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {showPublicHeaderFooter && <Footer />}
      {showPublicHeaderFooter && <ScrollProgress />}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <Router>
          <AppLayout />
        </Router>
      </PortfolioProvider>
    </AuthProvider>
  );
}

export default App;
