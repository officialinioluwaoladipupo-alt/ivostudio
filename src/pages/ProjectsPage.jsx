import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { fetchProjects, urlFor } from '../lib/sanity';
import ResponsiveImage from '../components/ResponsiveImage';

export function ProjectsPage({ onNavigate, onSelectProject, projects: initialProjects }) {
  const [projects, setProjects] = useState(initialProjects || []);
  const [loading, setLoading] = useState(!initialProjects || initialProjects.length === 0);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    let cancelled = false;
    fetchProjects()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load projects from Sanity:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const types = ['ALL', ...new Set(projects.flatMap((p) => {
    if (Array.isArray(p.projectType)) return p.projectType;
    if (p.projectType) return [p.projectType];
    if (p.type) return [p.type];
    return [];
  }))];

  const filteredProjects = filterType === 'ALL'
    ? projects
    : projects.filter((p) => {
        const pTypes = Array.isArray(p.projectType) ? p.projectType : [p.projectType || p.type];
        return pTypes.includes(filterType);
      });

  return (
    <div className="work-page">
      <section className="work-page-intro">
        <p className="work-eyebrow">WORK / ARCHIVE</p>
        <h1>Work</h1>
        <p className="work-lead">
          This page exists for the work that's finished, not the work that's in progress or half-decided.
        </p>
        <p>
          Projects go up here once they're actually ready to be looked at properly — studio assignments taken further than the brief required, personal explorations, and anything else worth presenting as a full case study rather than a quick image dump.
        </p>
      </section>

      {loading ? (
        <section className="work-empty-state" style={{ minHeight: '300px' }}>
          <p>Loading projects archive...</p>
        </section>
      ) : projects.length === 0 ? (
        <section className="work-empty-state">
          <span className="work-empty-mark">—</span>
          <h2>Nothing is published here yet.</h2>
          <p>
            That's not an oversight — I'd rather this page stay empty until there's something worth showing than fill it with placeholder work just to make the page look busy.
          </p>
          <p>
            The first case studies are coming, and when they do, each one will walk through the brief, the concept, the process, and the outcome, so the thinking behind the work is as visible as the result.
          </p>
          <p className="work-coming-note">
            Once there's a real set of projects here, this page will let you filter by type, year, or scale, so it stays easy to navigate as it grows.
          </p>
          <button onClick={() => onNavigate('contact')} className="work-contact-link">
            Get in touch in the meantime <ArrowUpRight size={17} />
          </button>
        </section>
      ) : (
        <section className="work-gallery-section" style={{ padding: '40px 0' }}>
          {types.length > 2 && (
            <div className="work-filter-bar" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`pill-btn ${filterType === t ? 'primary' : 'secondary'}`}
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  <span>{t}</span>
                </button>
              ))}
            </div>
          )}

          <div
            className="projects-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '32px',
            }}
          >
            {filteredProjects.map((project) => {
              const cover = urlFor(project.coverImage) || project.coverImage;
              const pType = Array.isArray(project.projectType) ? project.projectType.join(', ') : (project.type || project.projectType);
              const pId = project.id || project._id;

              return (
                <article
                  key={pId}
                  onClick={() => onSelectProject && onSelectProject(project)}
                  style={{
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'border-color 0.2s ease',
                  }}
                  className="project-card"
                >
                  <div style={{ position: 'relative', width: '100%', height: '220px', background: '#111' }}>
                    {cover && (
                      <ResponsiveImage source={cover} alt={`${project.title} project cover`} width={1200} height={800} sizes="(max-width: 700px) 100vw, 50vw" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{project.title}</h2>
                      {project.year && (
                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                          {project.year}
                        </span>
                      )}
                    </div>

                    {pType && (
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8d82a8', marginBottom: '12px' }}>
                        {pType}
                      </span>
                    )}

                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, flex: 1, margin: 0, marginBottom: '16px' }}>
                      {project.summary || project.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>
                      <span>Explore Case Study</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProjectsPage;
