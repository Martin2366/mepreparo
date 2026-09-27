import React from 'react';
import { Icon } from './Icon.jsx';
const SIZES={sm:{h:36,px:16,fs:15,ic:16},md:{h:44,px:22,fs:16,ic:18},lg:{h:56,px:32,fs:18,ic:20}};
export function Button({variant='primary',size='md',iconLeft,iconRight,fullWidth=false,disabled=false,children,onClick,type='button',style}){
  const [h,setH]=React.useState(false);const [p,setP]=React.useState(false);
  const s=SIZES[size]||SIZES.md;
  const V={
    primary:{bg:h?'var(--interactive-hover)':'var(--interactive)',fg:'var(--text-on-interactive)',bd:'transparent'},
    secondary:{bg:h?'var(--surface-hover)':'var(--surface-card)',fg:'var(--text-body)',bd:'var(--border-ink)'},
    ghost:{bg:h?'var(--surface-hover)':'transparent',fg:'var(--text-body)',bd:'transparent'},
    dark:{bg:h?'var(--mp-ink-700)':'var(--mp-ink)',fg:'var(--mp-white)',bd:'transparent'},
  }[variant]||{};
  const dis=disabled?{bg:'var(--disabled-bg)',fg:'var(--disabled-fg)',bd:'transparent'}:null;const c=dis||V;
  return <button type={type} disabled={disabled} onClick={onClick}
    onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setH(false);setP(false)}} onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)}
    style={{display:fullWidth?'flex':'inline-flex',width:fullWidth?'100%':undefined,alignItems:'center',justifyContent:'center',gap:10,height:s.h,padding:'0 '+s.px+'px',
    borderRadius:'var(--radius-pill)',border:'var(--stroke) solid '+c.bd,background:c.bg,color:c.fg,font:'var(--fw-semibold) '+s.fs+'px/1 var(--font-sans)',
    cursor:disabled?'not-allowed':'pointer',transform:p&&!disabled?'scale(.97)':'none',transition:'background var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out)',whiteSpace:'nowrap',...style}}>
    {iconLeft&&<Icon name={iconLeft} size={s.ic}/>}{children}{iconRight&&<Icon name={iconRight} size={s.ic}/>}
  </button>;
}