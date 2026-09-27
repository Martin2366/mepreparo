import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Checkbox({checked,defaultChecked,onChange,label,disabled=false,style}){
  const [c,setC]=React.useState(!!defaultChecked);const on=checked??c;
  return <label style={{display:'inline-flex',alignItems:'center',gap:12,minHeight:44,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.5:1,font:'var(--fw-regular) 16px/1.3 var(--font-sans)',color:'var(--text-body)',...style}}>
    <input type="checkbox" checked={on} disabled={disabled} onChange={e=>{setC(e.target.checked);onChange&&onChange(e)}} style={{position:'absolute',opacity:0,width:0,height:0}}/>
    <span style={{width:22,height:22,flex:'none',borderRadius:'var(--radius-xs)',border:'var(--stroke) solid '+(on?'var(--interactive)':'var(--mp-ink)'),background:on?'var(--interactive)':'var(--surface-card)',display:'inline-flex',alignItems:'center',justifyContent:'center',transition:'all var(--dur-fast) var(--ease-out)'}}>
      {on&&<Icon name="check" size={16} color="var(--mp-white)"/>}
    </span>{label}</label>;}