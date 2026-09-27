import React from 'react';
export function Radio({checked,defaultChecked,onChange,label,disabled=false,style}){
  const [c,setC]=React.useState(!!defaultChecked);const on=checked??c;
  return <label style={{display:'inline-flex',alignItems:'center',gap:12,minHeight:44,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.5:1,font:'var(--fw-regular) 16px/1.3 var(--font-sans)',color:'var(--text-body)',...style}}>
    <input type="radio" checked={on} disabled={disabled} onChange={e=>{setC(e.target.checked);onChange&&onChange(e)}} style={{position:'absolute',opacity:0,width:0,height:0}}/>
    <span style={{width:22,height:22,flex:'none',borderRadius:'50%',border:'var(--stroke) solid '+(on?'var(--interactive)':'var(--mp-ink)'),background:on?'var(--surface-card)':'var(--surface-card)',display:'inline-flex',alignItems:'center',justifyContent:'center',transition:'all var(--dur-fast) var(--ease-out)'}}>
      {on&&<span style={{width:10,height:10,borderRadius:'50%',background:'var(--interactive)'}}/>}
    </span>{label}</label>;}