import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function HintBox({title='Pista',children,style}){
  return <div style={{display:'flex',gap:12,paddingTop:16,borderTop:'1px solid var(--border-default)',...style}}>
    <Icon name="lightbulb" size={22} color="var(--mp-ink)" style={{marginTop:1}}/>
    <div><div style={{font:'var(--fw-semibold) 15px/1.3 var(--font-sans)',color:'var(--text-body)'}}>{title}</div>
    <div style={{font:'var(--fw-regular) 15px/1.5 var(--font-sans)',color:'var(--text-muted)',marginTop:2,textWrap:'pretty'}}>{children}</div></div></div>;}