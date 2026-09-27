import React from 'react';
export function Tag({selected=false,onClick,children,style}){const [h,setH]=React.useState(false);
  return <button onClick={onClick} aria-pressed={selected} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
   style={{display:'inline-flex',alignItems:'center',height:36,padding:'0 16px',borderRadius:'var(--radius-pill)',cursor:'pointer',
   background:selected?'var(--surface-selected)':h?'var(--surface-hover)':'var(--surface-card)',border:'1.5px solid '+(selected?'var(--interactive)':'var(--border-strong)'),
   color:selected?'var(--mp-sky-700)':'var(--text-body)',font:'var(--fw-medium) 15px/1 var(--font-sans)',transition:'all var(--dur-fast) var(--ease-out)',...style}}>{children}</button>;}