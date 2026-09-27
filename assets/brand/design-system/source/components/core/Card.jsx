import React from 'react';
export function Card({padding=24,elevated=true,tone='white',children,style,onClick}){
  const bg={white:'var(--surface-card)',paper:'var(--surface-page)',sky:'var(--mp-sky-50)'}[tone];
  return <div onClick={onClick} style={{background:bg,borderRadius:'var(--radius-lg)',border:'1px solid var(--border-default)',boxShadow:elevated?'var(--shadow-card)':'none',padding,cursor:onClick?'pointer':undefined,...style}}>{children}</div>;}