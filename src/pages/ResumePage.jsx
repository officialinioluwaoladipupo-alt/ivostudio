import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { fetchResume } from '../lib/sanity';

export function ResumePage({ onNavigate }) {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchResume()
      .then((data) => {
        if (!cancelled && data) setResumeData(data);
      })
      .catch((err) => {
        console.warn('Could not load Resume data from Sanity:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const hasEducation = Array.isArray(resumeData?.education) && resumeData.education.length > 0;
  const hasExperience = Array.isArray(resumeData?.experience) && resumeData.experience.length > 0;
  const hasSkills = Array.isArray(resumeData?.skillsAndTools) && resumeData.skillsAndTools.length > 0;

  return (
    <div className="cv-page">
      <section className="cv-intro">
        <p className="cv-eyebrow">CV / WORKING RECORD</p>
        <h1>CV</h1>
        <p className="cv-lead">
          Education, current work, and tools — laid out here to be read, not downloaded as a file.
        </p>
        <p>This is a working record and will grow as things change; it's not meant to be a finished, final document.</p>
      </section>

      {loading ? (
        <section className="cv-content" style={{ minHeight: '200px' }}>
          <p>Loading CV details...</p>
        </section>
      ) : (
        <section className="cv-content">
          <div className="cv-block">
            <span>EDUCATION</span>
            <div>
              {hasEducation ? (
                resumeData.education.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: idx < resumeData.education.length - 1 ? '20px' : '0' }}>
                    <h2>{item.institution}</h2>
                    <p>{item.program}{item.dates ? ` (${item.dates})` : ''}</p>
                    {item.notes && <p className="cv-note">{item.notes}</p>}
                  </div>
                ))
              ) : <p className="cv-note">Education details are not published yet.</p>}
            </div>
          </div>

          <div className="cv-block">
            <span>EXPERIENCE / CURRENT WORK</span>
            <div>
              {hasExperience ? (
                resumeData.experience.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: idx < resumeData.experience.length - 1 ? '20px' : '0' }}>
                    <h2>{item.role} — {item.organization}</h2>
                    {item.dates && <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{item.dates}</span>}
                    {item.description && <p>{item.description}</p>}
                  </div>
                ))
              ) : <p className="cv-note">Current work details are not published yet.</p>}
            </div>
          </div>

          <div className="cv-block">
            <span>TOOLS & SKILLS</span>
            <div>
              {hasSkills ? (
                resumeData.skillsAndTools.map((s, idx) => {
                  if (typeof s === 'string') {
                    return <p key={idx}>{s}</p>;
                  }
                  if (s && s.category) {
                    return (
                      <div key={idx} style={{ marginBottom: '12px' }}>
                        <strong style={{ color: '#8d82a8', fontSize: '0.9rem' }}>{s.category}: </strong>
                        <span>{Array.isArray(s.skills) ? s.skills.join(', ') : ''}</span>
                      </div>
                    );
                  }
                  return null;
                })
              ) : (
                <p className="cv-note">
                  To be added — the actual software, methods, and fabrication skills used day to day, rather than a generic list.
                </p>
              )}
            </div>
          </div>

          <div className="cv-block">
            <span>AWARDS & RECOGNITION</span>
            <div>
              <p className="cv-note">None listed yet. This section will stay honest rather than padded — it updates only when there's something real to add.</p>
            </div>
          </div>

          <div className="cv-request">
            Full details, references, and academic records are available on request:<br />
            <a href="mailto:inioluwa@ivostudio.com.ng">inioluwa@ivostudio.com.ng</a>
          </div>

          <div className="cv-actions">
            <button onClick={() => onNavigate('contact')}>
              Get in touch <ArrowUpRight size={16} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default ResumePage;
