import React from 'react';
export function Logo({variant='lockup',height=40,assetBase='assets/',style}){
  const src={lockup:'logo/mepreparo-lockup.png',icon:'logo/mepreparo-icon.png',wordmark:'logo/mepreparo-wordmark.png'}[variant];
  return <img src={assetBase+src} alt="MePreparo" style={{height,width:'auto',display:'block',...style}}/>;}