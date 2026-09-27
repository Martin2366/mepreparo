import React from 'react';
const CDN='https://unpkg.com/lucide-static@0.460.0/icons/';
const cache={};
function load(name){if(!cache[name])cache[name]=fetch(CDN+name+'.svg').then(r=>r.ok?r.text():'').then(t=>t.replace(/<!--[\s\S]*?-->/g,'').replace(/width="24"/,'width="100%"').replace(/height="24"/,'height="100%"')).catch(()=>'');return cache[name];}
export function Icon({name,size=20,color='currentColor',label,style}){
  const [svg,setSvg]=React.useState(()=>typeof cache[name]==='string'?cache[name]:'');
  React.useEffect(()=>{let on=true;load(name).then(t=>{if(on)setSvg(t)});return()=>{on=false}},[name]);
  return <span role={label?'img':undefined} aria-label={label} aria-hidden={label?undefined:true} dangerouslySetInnerHTML={{__html:svg}} style={{display:'inline-flex',flex:'none',width:size,height:size,color,lineHeight:0,...style}}/>;
}
