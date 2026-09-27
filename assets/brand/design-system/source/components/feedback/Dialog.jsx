import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
export function Dialog({open=true,title,children,actions,illustration,onClose,inline=false,style}){ if(!open) return null;
  const panel=<div role="dialog" aria-modal="true" style={{position:'relative',width:'100%',maxWidth:420,background:'var(--surface-card)',borderRadius:'var(--radius-xl)',boxShadow:'var(--shadow-raised)',padding:'32px 28px 24px',textAlign:'center',animation:'mp-fade-up var(--dur-slow) var(--ease-out)',...style}}>
    {onClose&&<IconButton icon="x" label="Cerrar" size={40} onClick={onClose} style={{position:'absolute',top:12,right:12}}/>}
    {illustration&&<div style={{display:'flex',justifyContent:'center',marginBottom:12}}>{illustration}</div>}
    {title&&<h3 style={{margin:'0 0 8px',font:'var(--type-h3)',color:'var(--text-body)',textWrap:'balance'}}>{title}</h3>}
    <div style={{font:'var(--type-body)',color:'var(--text-muted)',textWrap:'pretty'}}>{children}</div>
    {actions&&<div style={{display:'flex',flexDirection:'column',gap:8,marginTop:24}}>{actions}</div>}</div>;
  if(inline) return panel;
  return <div style={{position:'fixed',inset:0,background:'var(--overlay-scrim)',display:'flex',alignItems:'center',justifyContent:'center',padding:24,zIndex:100}} onClick={e=>{if(e.target===e.currentTarget&&onClose)onClose()}}>{panel}</div>;}