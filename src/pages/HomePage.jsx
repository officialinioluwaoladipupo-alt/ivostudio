import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, Plus, Minus, ExternalLink } from 'lucide-react';
import { Silk } from '../components/Silk';
import AccordionGallery from '../components/AccordionGallery';
import { fetchHomeHero, fetchAlsoBuilding, urlFor } from '../lib/sanity';

export function HomePage({ onNavigate, onSelectProject, projects = [] }) {
  const [expandedProject, setExpandedProject] = useState(projects[0]?.id || projects[0]?._id || null);
  const [heroData, setHeroData] = useState(null);
  const [alsoBuilding, setAlsoBuilding] = useState([]);
  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingAlsoBuilding, setLoadingAlsoBuilding] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchHomeHero()
      .then((data) => {
        if (!cancelled && data) setHeroData(data);
      })
      .catch((err) => console.warn('Could not fetch homeHero from Sanity:', err))
      .finally(() => {
        if (!cancelled) setLoadingHero(false);
      });

    fetchAlsoBuilding()
      .then((entries) => {
        if (!cancelled && Array.isArray(entries) && entries.length > 0) {
          setAlsoBuilding(entries);
        }
      })
      .catch((err) => console.warn('Could not fetch alsoBuilding from Sanity:', err))
      .finally(() => {
        if (!cancelled) setLoadingAlsoBuilding(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleProject = (id) => {
    setExpandedProject(expandedProject === id ? null : id);
  };

  const handleCtaClick = () => {
    if (heroData?.ctaLink) {
      if (heroData.ctaLink.startsWith('http')) {
        window.open(heroData.ctaLink, '_blank', 'noopener,noreferrer');
      } else {
        const route = heroData.ctaLink.replace(/^\//, '');
        onNavigate(route || 'projects');
      }
    } else {
      onNavigate('projects');
    }
  };

  return (
    <div className="home-page walaszczyk-style">
      {/* 1. Pure Silk Hero Section */}
      <section className="hero-section pure-silk-hero">
        <div className="hero-silk-bg" aria-hidden="true">
          <Silk
            speed={5}
            scale={1}
            color="#8d82a8"
            noiseIntensity={1.1}
            rotation={0}
          />
        </div>

        <div className="hero-content-wrapper">
          {heroData?.eyebrow && <p className="hero-eyebrow">{heroData.eyebrow}</p>}
          
          <h1 className="hero-main-title">
            {loadingHero ? 'Loading…' : heroData?.headline ? (
              heroData.headline
            ) : (
              'Hero content is being prepared.'
            )}
          </h1>

          <p className="hero-main-copy">
            {heroData?.subtext || (!loadingHero && 'Hero introduction is not published yet.')}
          </p>

          <div className="hero-buttons-row">
            <button
              onClick={handleCtaClick}
              className="pill-btn primary"
            >
              <span>{heroData?.ctaLabel || 'See the Work'}</span>
              <ArrowRight size={14} className="btn-arrow" />
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="pill-btn secondary"
            >
              <span>About</span>
              <ArrowRight size={14} className="btn-arrow" />
            </button>
          </div>
        </div>
      </section>

      {/* Top Transition Bar */}
      <div className="section-divider-bar">
        <span className="divider-dash">—</span>
        <span className="divider-logo-mark">IVO</span>
      </div>

      {/* 2. Interactive Projects Section */}
      <section className="projects-accordion-section">
        <div className="accordion-section-header">
          <div className="header-label-col">
            <span className="label-tag">PROJECTS →</span>
          </div>
          <div className="header-title-col">
            <h2 className="section-statement-title">Case studies as they’re finished, not a highlight reel of final renders.</h2>
          </div>
        </div>

        <div className="home-project-index">
          <p className="home-project-intro">
            Case studies as they’re finished, not a highlight reel of final renders. Each one shows the brief, the thinking, and the decisions in between.
          </p>
          {projects.length > 0 ? (
            <AccordionGallery
              items={projects.slice(0, 5).map((project) => ({
                id: project.id || project._id,
                image: urlFor(project.coverImage) || project.coverImage,
                label: project.title,
                alt: project.title,
              }))}
              defaultIndex={0}
              trigger="hover"
              onSelect={onSelectProject}
            />
          ) : (
            <div className="work-empty-state home-projects-empty">
              <h3>Projects are being prepared.</h3>
              <p>The first case studies will appear here once they are published.</p>
            </div>
          )}
          <button onClick={() => onNavigate('projects')} className="home-project-more">
            See all work <ArrowRight size={15} />
          </button>
        </div>

        <div className="project-rows-list legacy-project-list">
          {projects.map((project) => {
            const pId = project.id || project._id;
            const isExpanded = expandedProject === pId;
            const projectCover = urlFor(project.coverImage) || project.coverImage;
            const pType = Array.isArray(project.projectType) ? project.projectType.join(', ') : (project.type || project.projectType);
            const pTags = project.tags || project.tools || [];

            return (
              <div key={pId} className={`project-accordion-item ${isExpanded ? 'open' : ''}`}>
                <div
                  className="project-row-main"
                  onClick={() => toggleProject(pId)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                >
                  <div className="project-title-wrap">
                    <h3 className="project-row-name">{project.title}</h3>
                  </div>

                  <div className="project-pill-tags">
                    {pType && <span className="row-pill-badge">{pType}</span>}
                    {pTags.slice(0, 3).map((tag) => (
                      <span key={tag} className="row-pill-badge">{tag}</span>
                    ))}
                    {project.year && <span className="row-pill-badge year">{project.year}</span>}
                  </div>

                  <div className="project-action-icon">
                    {isExpanded ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </div>

                {/* Expanded Project Preview Drawer */}
                {isExpanded && (
                  <div className="project-drawer-content">
                    <div className="drawer-preview-grid">
                      <div className="drawer-image-wrapper" onClick={() => onSelectProject(project)}>
                        <img src={projectCover} alt={project.title} loading="lazy" />
                      </div>

                      <div className="drawer-details">
                        <span className="drawer-subtitle">{project.subtitle || pType}</span>
                        <p className="drawer-summary">{project.summary || project.description}</p>
                        <div className="drawer-meta-grid">
                          <div>
                            <span className="meta-k">LOCATION</span>
                            <span className="meta-v">{project.location || '—'}</span>
                          </div>
                          <div>
                            <span className="meta-k">SCALE</span>
                            <span className="meta-v">{project.scale || '—'}</span>
                          </div>
                          <div>
                            <span className="meta-k">ROLE</span>
                            <span className="meta-v">{project.role || '—'}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectProject(project)}
                          className="pill-btn primary drawer-cta"
                        >
                          <span>Explore Full Case Study & 3D Model</span>
                          <ArrowRight size={14} className="btn-arrow" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Also Building Section */}
      <section className="also-building-section">
        <span className="label-tag">ALSO BUILDING</span>
        <h2 className="section-statement-title">Architecture, for me, isn’t only what happens at my own desk.</h2>
        
        {loadingAlsoBuilding ? (
          <div className="also-building-grid">
            <div><p>Loading updates...</p></div>
          </div>
        ) : alsoBuilding.length > 0 ? (
          <div className="also-building-grid">
            {alsoBuilding.map((entry) => (
              <div key={entry._id}>
                <h3>{entry.name}</h3>
                <p>{entry.description}</p>
                {entry.link && (
                  <a
                    href={entry.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '0.9rem' }}
                  >
                    <span>Visit</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : <div className="also-building-grid"><div><p>Additional work is not published yet.</p></div></div>}
      </section>
    </div>
  );
}

export default HomePage;
