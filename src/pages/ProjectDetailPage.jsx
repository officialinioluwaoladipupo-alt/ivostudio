import React from 'react';
import { ArrowLeft, ArrowRight, Printer } from 'lucide-react';
import { urlFor } from '../lib/sanity';
import ResponsiveImage from '../components/ResponsiveImage';

function readable(value) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map((block) => block?.children?.map((child) => child.text).join('') || '').join('\n');
  return '';
}

export function ProjectDetailPage({ project, onBack, onSelectProject, allProjects = [] }) {
  const projectId = project.id || project._id;
  const currentIndex = allProjects.findIndex((item) => (item.id || item._id) === projectId);
  const previous = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;
  const cover = urlFor(project.coverImage) || project.coverImage;
  const gallery = [...(project.galleryImages || []), ...(project.processImages || [])];
  const type = Array.isArray(project.projectType) ? project.projectType.join(', ') : (project.projectType || project.type);

  return (
    <article className="project-detail-page project-blog-page">
      <div className="detail-top-nav">
        <button onClick={onBack} className="back-link-btn"><ArrowLeft size={16} /><span>Back to Work</span></button>
        <button onClick={() => window.print()} className="print-view-btn" aria-label="Print project page"><Printer size={15} /><span>Print</span></button>
      </div>

      <header className="project-blog-header">
        <p className="detail-eyebrow">{type || 'Project'} {project.year ? `· ${project.year}` : ''}</p>
        <h1 className="detail-title">{project.title}</h1>
        {project.summary && <p className="detail-subtitle">{project.summary}</p>}
        <div className="project-blog-meta">
          {project.location && <span><b>Location</b>{project.location}</span>}
          {project.scale && <span><b>Scale</b>{project.scale}</span>}
          {project.role && <span><b>Role</b>{project.role}</span>}
        </div>
      </header>

      {cover && <figure className="project-blog-cover"><ResponsiveImage source={cover} alt={`${project.title} cover`} width={1800} height={1100} sizes="100vw" priority /><figcaption>{project.title}</figcaption></figure>}

      <div className="project-blog-body">
        {readable(project.description) && <section><p className="project-blog-kicker">ABOUT THE PROJECT</p><p className="project-blog-lead">{readable(project.description)}</p></section>}
        {project.caseStudy?.brief && <section><h2>The brief</h2><p>{readable(project.caseStudy.brief)}</p></section>}
        {project.caseStudy?.concept && <section><h2>The idea</h2><p>{readable(project.caseStudy.concept)}</p></section>}
        {project.caseStudy?.process && <section><h2>The process</h2><p>{readable(project.caseStudy.process)}</p></section>}
        {project.caseStudy?.outcome && <section><h2>The outcome</h2><p>{readable(project.caseStudy.outcome)}</p></section>}
      </div>

      {gallery.length > 0 && <section className="project-blog-gallery" aria-label="Project images">
        {gallery.map((image, index) => {
          const source = urlFor(image) || image?.url || image;
          return <figure key={image._key || index}><ResponsiveImage source={source} alt={`${project.title} project image ${index + 1}`} width={1400} height={950} sizes="(max-width: 700px) 100vw, 50vw" /><figcaption>{image.caption || image.title || `Project image ${index + 1}`}</figcaption></figure>;
        })}
      </section>}

      {(previous || next) && <nav className="project-pagination" aria-label="Project pagination">
        {previous && <button onClick={() => onSelectProject(previous)} className="pag-btn prev-btn"><ArrowLeft size={18} /><span><small>Previous</small>{previous.title}</span></button>}
        {next && <button onClick={() => onSelectProject(next)} className="pag-btn next-btn"><span><small>Next</small>{next.title}</span><ArrowRight size={18} /></button>}
      </nav>}
    </article>
  );
}

export default ProjectDetailPage;
