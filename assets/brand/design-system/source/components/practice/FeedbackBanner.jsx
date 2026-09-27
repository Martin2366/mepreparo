import React from 'react';
import { Icon } from '../core/Icon.jsx';
const T={correct:['var(--success-soft)','var(--success)','check','var(--success-text)'],retry:['var(--retry-soft)','var(--mp-graphite)','rotate-ccw','var(--mp-ink)'],aja:['var(--accent-soft)','var(--mp-coral)','sparkles','var(--mp-ink)']};
export function FeedbackBanner({tone='correct',title,children,sparkle,style}){const [bg,c,ic,tc]=T[tone];const sp=sparkle??(tone!=='retry');
  return <div role="status" style={{display:'flex',alignItems:'center',gap:14,padding:'14px 18px',borderRadius:'var(--radius-md)',background:bg,animation:'mp-fade-up var(--dur-slow) var(--ease-out)',...style}}>
    <span style={{width:34,height:34,flex:'none',borderRadius:'50%',background:c,display:'flex',alignItems:'center',justifyContent:'center',animation:'mp-pop var(--dur-slow) var(--ease-pop)'}}><Icon name={ic} size={18} color="var(--mp-white)"/></span>
    <div style={{flex:1}}><div style={{font:'var(--fw-semibold) 17px/1.3 var(--font-sans)',color:tc}}>{title}</div>{children&&<div style={{font:'var(--fw-regular) 15px/1.45 var(--font-sans)',color:'var(--text-muted)',marginTop:2}}>{children}</div>}</div>
    {sp&&<Icon name="sparkle" size={22} color={tone==='correct'?'var(--success)':'var(--mp-coral)'}/>}</div>;}