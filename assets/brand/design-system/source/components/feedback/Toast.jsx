import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Toast({tone='neutral',icon,children,action,style}){
  const ic=icon||{neutral:'info',success:'check',aja:'sparkles'}[tone];const c={neutral:'var(--mp-sky)',success:'var(--mp-green)',aja:'var(--mp-coral)'}[tone];
  return <div role="status" style={{display:'inline-flex',alignItems:'center',gap:12,minHeight:48,padding:'10px 12px 10px 14px',borderRadius:'var(--radius-md)',background:'var(--mp-ink)',color:'var(--mp-white)',boxShadow:'var(--shadow-raised)',font:'var(--fw-medium) 15px/1.35 var(--font-sans)',animation:'mp-fade-up var(--dur-slow) var(--ease-out)',...style}}>
    <Icon name={ic} size={20} color={c}/><span style={{flex:1}}>{children}</span>{action}</div>;}