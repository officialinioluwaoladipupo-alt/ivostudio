import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { fetchAbout, urlFor, PortableTextRenderer } from '../lib/sanity';
import ResponsiveImage from '../components/ResponsiveImage';

export function AboutPage({ onNavigate }) {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchAbout()
      .then((data) => {
        if (!cancelled && data) setAboutData(data);
      })
      .catch((err) => {
        console.warn('Could not load About data from Sanity:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const photoUrl = aboutData?.photo ? urlFor(aboutData.photo) : null;

  return (
    <div className="about-page about-simple-page">
      <section className="about-simple-intro">
        <p className="about-eyebrow">ABOUT / IVO</p>
        <h1>About</h1>
        <p className="about-simple-lead">A working record of the person, practice, and ideas behind IVO.</p>
      </section>

      {loading ? (
        <section className="about-simple-copy" style={{ minHeight: '200px' }}>
          <p>Loading about details...</p>
        </section>
      ) : (
        <section className="about-simple-copy">
          {photoUrl && (
            <div style={{ marginBottom: '32px', maxWidth: '320px', borderRadius: '8px', overflow: 'hidden' }}>
              <ResponsiveImage source={photoUrl} alt="Portrait of Inioluwa Oladipupo" width={640} height={800} sizes="(max-width: 700px) 100vw, 320px" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}

          {aboutData?.philosophy && (
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', marginBottom: '24px', borderLeft: '2px solid #8d82a8', paddingLeft: '16px' }}>
              "{aboutData.philosophy}"
            </p>
          )}

          {aboutData?.bio && Array.isArray(aboutData.bio) && aboutData.bio.length > 0 ? (
            <div className="about-bio-portable-text">
              <PortableTextRenderer value={aboutData.bio} />
            </div>
          ) : <p className="empty-content-note">About details are being prepared.</p>}

          {aboutData?.education && <div className="about-education" style={{ marginTop: '32px' }}>
            <span>EDUCATION</span><strong>{aboutData.education}</strong>
          </div>}

          <div className="about-simple-actions">
            <button onClick={() => onNavigate('resume')}>
              Read the CV <ArrowUpRight size={16} />
            </button>
            <button onClick={() => onNavigate('contact')}>
              Get in touch <ArrowUpRight size={16} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default AboutPage;
