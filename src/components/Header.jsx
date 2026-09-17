import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

export function Header({ currentPage, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const drawer = drawerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => drawer?.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])') || [];
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') { setMobileOpen(false); menuButtonRef.current?.focus(); return; }
      if (event.key !== 'Tab') return;
      const nodes = [...focusable()]; if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => focusable()[0]?.focus());
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Work' },
    { id: 'about', label: 'About' },
    { id: 'resume', label: 'CV' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNav = (pageId) => {
    onNavigate(pageId);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-left">
          <Logo onClick={() => handleNav('home')} />
        </div>

        {/* Center Minimalist Navigation (matching Walaszczyk & Kott screenshot) */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`nav-link ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Simple menu control */}
        <div className="header-utilities">
          <button
            ref={menuButtonRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div id="mobile-navigation-drawer" ref={drawerRef} className={`mobile-nav-drawer ${mobileOpen ? 'open' : ''}`} aria-hidden={!mobileOpen} role="dialog" aria-label="Mobile navigation">
        <div className="mobile-nav-content">
          <div className="mobile-nav-header">
            <span className="mobile-nav-title">IVO STUDIO // 2026</span>
            <span className="mobile-nav-loc">IVO STUDIO</span>
          </div>
          <div className="mobile-nav-links">
            {navItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`mobile-nav-link ${currentPage === item.id ? 'active' : ''}`}
              >
                <span className="mobile-nav-idx">0{idx + 1}</span>
                <span className="mobile-nav-txt">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="mobile-nav-footer">
            <p>IVO STUDIO — INIOLUWA OLADIPUPO</p>
            <p className="footer-email">inioluwa@ivostudio.com.ng</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
