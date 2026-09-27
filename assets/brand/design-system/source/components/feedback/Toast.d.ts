/** Ink toast for transient confirmations. */
export interface ToastProps{ tone?:'neutral'|'success'|'aja'; /** Lucide name override */ icon?:string; children?:React.ReactNode; action?:React.ReactNode; style?:React.CSSProperties; }
export declare function Toast(props:ToastProps):JSX.Element;