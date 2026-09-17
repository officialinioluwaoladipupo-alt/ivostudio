import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, ArrowRight } from 'lucide-react';
import { fetchContactInfo } from '../lib/sanity';

function MagneticLink({ children, className = '', ...props }) {
  const ref = useRef(null);
  useEffect(() => { const el=ref.current; if(!el)return; const move=e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px, ${(e.clientY-r.top-r.height/2)*.18}px)`}; const leave=()=>{el.style.transform='translate(0, 0)'}; el.addEventListener('mousemove',move);el.addEventListener('mouseleave',leave);return()=>{el.removeEventListener('mousemove',move);el.removeEventListener('mouseleave',leave)} },[]);
  return <a ref={ref} className={`cinematic-pill ${className}`} {...props}>{children}</a>;
}

export function Footer({ onNavigate }) {
  const sectionRef=useRef(null);
  const [contact, setContact] = useState(null);
  useEffect(() => { fetchContactInfo().then(setContact).catch(() => {}); }, []);
  useEffect(()=>{const el=sectionRef.current;if(!el)return;const o=new IntersectionObserver(([e])=>e.isIntersecting&&el.classList.add('is-visible'),{threshold:.15});o.observe(el);return()=>o.disconnect()},[]);
  return <footer ref={sectionRef} className="cinematic-footer">
    <div className="footer-grid-bg" aria-hidden="true"/><div className="footer-aurora" aria-hidden="true"/>
    <div className="footer-marquee"><div>IVO STUDIO <span>✦</span> ARCHITECTURE <span>✦</span> DESIGN <span>✦</span> IVO STUDIO <span>✦</span> ARCHITECTURE <span>✦</span> DESIGN <span>✦</span></div></div>
    <div className="footer-giant-word" aria-hidden="true">IVO</div>
    <div className="cinematic-footer-content"><p className="footer-kicker">LET’S MAKE ROOM FOR IDEAS</p><h2>Have a place<br/><em>in mind?</em></h2><div className="footer-actions"><button onClick={()=>onNavigate('contact')} className="cinematic-pill primary">Start a conversation <ArrowRight size={15}/></button>{contact?.email && <MagneticLink href={`mailto:${contact.email}`}>{contact.email} <ArrowUpRight size={15}/></MagneticLink>}</div></div>
    <div className="cinematic-footer-bottom"><span>© 2026 Inioluwa Oladipupo. All rights reserved.</span>{contact?.location && <span>{contact.location}</span>}<button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Return to top" className="footer-top-button"><ArrowUp size={16}/></button></div>
  </footer>;
}
export default Footer;
