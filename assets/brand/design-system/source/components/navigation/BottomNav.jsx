import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function BottomNav({items=[],value,onChange,style}){
  return <nav style={{display:'flex',justifyContent:'space-around',padding:'8px 8px 12px',background:'var(--surface-card)',borderTop:'1px solid var(--border-default)',...style}}>
   {items.map(it=>{const on=it.value===value;return <button key={it.value} onClick={()=>onChange&&onChange(it.value)} style={{flex:1,minHeight:52,display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:'none',border:'none',cursor:'pointer',color:on?'var(--interactive-press)':'var(--text-muted)',font:(on?'var(--fw-semibold)':'var(--fw-medium)')+' 12px/1 var(--font-sans)'}}>
     <span style={{width:48,height:30,borderRadius:999,display:'flex',alignItems:'center',justifyContent:'center',background:on?'var(--surface-selected)':'transparent'}}><Icon name={it.icon} size={22}/></span>{it.label}</button>})}</nav>;}