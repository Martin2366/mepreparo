import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function AnswerOption({letter,children,state='idle',onClick,disabled=false,style}){const [h,setH]=React.useState(false);
  const S={idle:{bg:h?'var(--surface-hover)':'transparent',cb:'var(--surface-card)',cf:'var(--mp-ink)',cbd:'var(--border-strong)'},
    selected:{bg:'var(--surface-selected)',cb:'var(--interactive)',cf:'var(--mp-white)',cbd:'var(--interactive)'},
    correct:{bg:'var(--success-soft)',cb:'var(--success)',cf:'var(--mp-white)',cbd:'var(--success)'},
    incorrect:{bg:'var(--retry-soft)',cb:'var(--mp-graphite)',cf:'var(--mp-white)',cbd:'var(--mp-graphite)'},
    dimmed:{bg:'transparent',cb:'var(--surface-card)',cf:'var(--text-subtle)',cbd:'var(--border-default)'}}[state];
  return <button onClick={onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} aria-pressed={state==='selected'}
    style={{display:'flex',alignItems:'center',gap:16,width:'100%',minHeight:56,padding:'8px 14px',borderRadius:'var(--radius-md)',border:'none',background:S.bg,cursor:disabled?'default':'pointer',textAlign:'left',transition:'background var(--dur-fast) var(--ease-out)',...style}}>
    <span style={{width:36,height:36,flex:'none',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:S.cb,color:S.cf,border:'1.5px solid '+S.cbd,font:'var(--fw-semibold) 16px/1 var(--font-sans)'}}>
      {state==='correct'?<Icon name="check" size={18}/>:letter}</span>
    <span style={{flex:1,font:'400 21px/1.3 var(--font-math)',color:state==='dimmed'?'var(--text-subtle)':'var(--text-body)'}}>{children}</span></button>;}