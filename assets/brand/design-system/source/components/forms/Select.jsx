import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Select({label,options=[],value,defaultValue,onChange,style}){const id=React.useId();
  return <label htmlFor={id} style={{display:'flex',flexDirection:'column',gap:6,...style}}>
    {label&&<span style={{font:'var(--fw-medium) 15px/1.3 var(--font-sans)',color:'var(--text-body)'}}>{label}</span>}
    <span style={{position:'relative',display:'flex'}}>
      <select id={id} value={value} defaultValue={defaultValue} onChange={onChange} style={{appearance:'none',WebkitAppearance:'none',width:'100%',height:48,padding:'0 44px 0 16px',borderRadius:'var(--radius-md)',border:'var(--stroke) solid var(--border-strong)',background:'var(--surface-card)',color:'var(--text-body)',font:'var(--fw-regular) 17px/1 var(--font-sans)',cursor:'pointer'}}>
        {options.map(o=>typeof o==='string'?<option key={o}>{o}</option>:<option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <Icon name="chevron-down" size={20} color="var(--text-muted)" style={{position:'absolute',right:14,top:14,pointerEvents:'none'}}/>
    </span></label>;}