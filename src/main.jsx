import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AboutPage from './pages/AboutPage';
import ResumePage from './pages/ResumePage';
import ContactPage from './pages/ContactPage';
import { fetchProjects } from './lib/sanity';
import './styles.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);

  // URL Hash Sync for deep linking & browser history
  useEffect(() => {
    const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
    if (!projectId || projectId === 'your-project-id') return undefined;

    let cancelled = false;
    fetchProjects()
      .then((remoteProjects) => {
        if (!cancelled && Array.isArray(remoteProjects)) setProjects(remoteProjects);
      })
      .catch((error) => {
        console.warn('Sanity projects could not be loaded; using local fallback.', error);
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash.startsWith('project/')) {
        const slug = hash.replace('project/', '');
        const found = projects.find((p) => p.slug === slug || p.id === slug);
        if (found) {
          setSelectedProject(found);
          setCurrentPage('project-detail');
          return;
        }
      }

      if (['home', 'projects', 'about', 'resume', 'contact'].includes(hash)) {
        setCurrentPage(hash);
        setSelectedProject(null);
      } else if (!hash) {
        setCurrentPage('home');
        setSelectedProject(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [projects]);

  useEffect(() => {
    const targets = document.querySelectorAll('main section, .work-empty-state, .about-simple-copy, .cv-block, .also-building-grid > div');
    targets.forEach((el) => el.classList.add('motion-reveal'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('motion-reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [currentPage, selectedProject]);

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    setSelectedProject(null);
    window.location.hash = `#${pageId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setCurrentPage('project-detail');
    window.location.hash = `#project/${project.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToProjects = () => {
    setCurrentPage('projects');
    setSelectedProject(null);
    window.location.hash = '#projects';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-root">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header
        currentPage={selectedProject ? 'projects' : currentPage}
        onNavigate={navigateTo}
      />

      <main id="main-content" key={selectedProject ? `project-${selectedProject.id}` : currentPage} className="page-transition">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectProject={handleSelectProject}
            projects={projects}
          />
        )}

        {currentPage === 'projects' && (
          <ProjectsPage
            onNavigate={navigateTo}
            onSelectProject={handleSelectProject}
            projects={projects}
          />
        )}

        {currentPage === 'project-detail' && selectedProject && (
          <ProjectDetailPage
            project={selectedProject}
            allProjects={projects}
            onBack={handleBackToProjects}
            onSelectProject={handleSelectProject}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'resume' && (
          <ResumePage
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage />
        )}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
