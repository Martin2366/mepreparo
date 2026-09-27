/**
 * Pill button. Primary = Celeste cielo. One primary per view.
 * @startingPoint section="Core" subtitle="Pill buttons — primary, secondary, ghost" viewport="700x260"
 */
export interface ButtonProps{ variant?:'primary'|'secondary'|'ghost'|'dark'; size?:'sm'|'md'|'lg'; /** Lucide icon name */ iconLeft?:string; iconRight?:string; fullWidth?:boolean; disabled?:boolean; children?:React.ReactNode; onClick?:(e:any)=>void; type?:'button'|'submit'; style?:React.CSSProperties; }
export declare function Button(props:ButtonProps):JSX.Element;