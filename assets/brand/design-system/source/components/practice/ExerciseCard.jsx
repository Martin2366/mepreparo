import React from 'react';
import { Card } from '../core/Card.jsx';
import { Badge } from '../core/Badge.jsx';
import { IconButton } from '../core/IconButton.jsx';
export function ExerciseCard({axis='M1',topic,question,children,footer,saved=false,onToggleSave,style}){
  return <Card padding={28} style={{display:'flex',flexDirection:'column',gap:20,...style}}>
    <div style={{display:'flex',alignItems:'center',gap:8}}><Badge>{axis}</Badge>{topic&&<span style={{font:'var(--fw-medium) 13px/1 var(--font-sans)',color:'var(--text-muted)'}}>{topic}</span>}<span style={{flex:1}}/>
      <IconButton icon={saved?'bookmark-check':'bookmark'} label={saved?'Guardado':'Guardar'} active={saved} onClick={onToggleSave} size={40}/></div>
    <div style={{font:'var(--fw-medium) 21px/1.45 var(--font-sans)',color:'var(--text-body)',textWrap:'pretty'}}>{question}</div>
    <div style={{display:'flex',flexDirection:'column',gap:6}}>{children}</div>{footer}</Card>;}