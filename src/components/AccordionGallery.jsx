import { useRef, useEffect, useState, useCallback } from 'react';
import './AccordionGallery.css';
import ResponsiveImage from './ResponsiveImage';

export default function AccordionGallery({ items, defaultIndex = 0, trigger = 'hover', height = 460, gap = 10, radius = 16, expandRatio = .52, duration = .6, grayscale = true, onSelect }) {
  const panels=useRef([]), media=useRef([]);
  const [active,setActive]=useState(Math.min(defaultIndex,items.length-1));
  const grow=items.length>1?(expandRatio*(items.length-1))/(1-expandRatio):1;
  const choose=(i,e)=>{if(i!==active){e?.preventDefault();setActive(i)}else if(onSelect)onSelect(items[i])};
  return <div className="accordion-gallery" style={{'--ag-gap':`${gap}px`,'--ag-radius':`${radius}px`,'--ag-duration':`${duration}s`,'--ag-grow':grow,height:`${height}px`}} role="list" aria-label="Selected projects">
    {items.map((item,i)=><a key={item.id||i} href={item.link||'#'} className={`ag-panel ${i===active?'ag-panel--active':''}`} style={{flexGrow:i===active?grow:1,transition:`flex-grow ${duration}s cubic-bezier(.22,1,.36,1)`,transform:`rotateY(${i===active?0:i<active?8:-8}deg)`}} ref={el=>panels.current[i]=el} onMouseEnter={()=>trigger==='hover'&&setActive(i)} onFocus={()=>setActive(i)} onClick={e=>choose(i,e)} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();setActive((i+1)%items.length)}if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();setActive((i-1+items.length)%items.length)}}} role="listitem" tabIndex="0" aria-label={item.label}>
      <span className="ag-panel__frame"><span className="ag-panel__media" ref={el=>media.current[i]=el}><ResponsiveImage source={item.image} alt={item.alt||item.label||''} width={1200} height={900} sizes="(max-width: 700px) 100vw, 52vw" priority={i === active}/></span><span className="ag-panel__overlay"/></span>
      <span className="ag-panel__label"><span className="ag-panel__bar"/><span className="ag-panel__text">{item.label}</span></span>
    </a>)}
  </div>;
}
