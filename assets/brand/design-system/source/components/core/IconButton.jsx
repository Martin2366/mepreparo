import React from 'react';
import { Icon } from './Icon.jsx';
export function IconButton({icon,label,variant='ghost',size=44,active=false,disabled=false,onClick,style}){
  const [h,setH]=React.useState(false);
  const V={ghost:{bg:h||active?'var(--surface-hover)':'transparent',fg:active?'var(--interactive-press)':'var(--text-body)',bd:'transparent'},
    outline:{bg:h?'var(--surface-hover)':'var(--surface-card)',fg:'var(--text-body)',bd:'var(--border-strong)'},
    solid:{bg:h?'var(--interactive-hover)':'var(--interactive)',fg:'var(--mp-white)',bd:'transparent'}}[variant];
  return <button aria-label={label} title={label} disabled={disabled} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{width:size,height:size,flex:'none',display:'inline-flex',alignItems:'center',justifyContent:'center',borderRadius:'var(--radius-pill)',border:'var(--stroke) solid '+V.bd,background:V.bg,color:disabled?'var(--disabled-fg)':V.fg,cursor:disabled?'not-allowed':'pointer',transition:'background var(--dur-fast) var(--ease-out)',padding:0,...style}}>
    <Icon name={icon} size={Math.round(size*0.46)}/></button>;
}