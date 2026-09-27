import React from 'react';
export function ProgressBar({value=0,max=100,tone='sky',label,showValue=false,height=8,style}){const pct=Math.max(0,Math.min(100,value/max*100));
  const c=tone==='green'?'var(--mp-green)':'var(--interactive)';
  return <div style={{display:'flex',flexDirection:'column',gap:6,...style}}>
   {(label||showValue)&&<div style={{display:'flex',justifyContent:'space-between',font:'var(--fw-medium) 13px/1 var(--font-sans)',color:'var(--text-muted)'}}><span>{label}</span>{showValue&&<span>{Math.round(pct)}%</span>}</div>}
   <div role="progressbar" aria-valuenow={value} aria-valuemax={max} style={{height,borderRadius:999,background:'var(--mp-graphite-100)',overflow:'hidden'}}><div style={{width:pct+'%',height:'100%',borderRadius:999,background:c,transition:'width var(--dur-slow) var(--ease-out)'}}/></div></div>;}