import React from 'react';
export function Input({label,hint,error,value,defaultValue,placeholder,onChange,type='text',disabled=false,math=false,style}){
  const [f,setF]=React.useState(false);const id=React.useId();
  return <label htmlFor={id} style={{display:'flex',flexDirection:'column',gap:6,...style}}>
    {label&&<span style={{font:'var(--fw-medium) 15px/1.3 var(--font-sans)',color:'var(--text-body)'}}>{label}</span>}
    <input id={id} type={type} value={value} defaultValue={defaultValue} placeholder={placeholder} onChange={onChange} disabled={disabled} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
      style={{height:48,padding:'0 16px',borderRadius:'var(--radius-md)',border:'var(--stroke) solid '+(error?'var(--mp-coral)':f?'var(--border-focus)':'var(--border-strong)'),boxShadow:f?'var(--focus-ring)':'none',outline:'none',
      background:disabled?'var(--disabled-bg)':'var(--surface-card)',color:'var(--text-body)',font:math?'italic 20px/1 var(--font-math)':'var(--fw-regular) 17px/1 var(--font-sans)',transition:'border-color var(--dur-fast),box-shadow var(--dur-fast)'}}/>
    {(error||hint)&&<span style={{font:'var(--fw-regular) 13px/1.4 var(--font-sans)',color:error?'var(--mp-coral-600)':'var(--text-muted)'}}>{error||hint}</span>}
  </label>;}