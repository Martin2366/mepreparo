/** Circular icon-only button (min 44px tap target). */
export interface IconButtonProps{ /** Lucide icon name */ icon:string; /** Required accessible label */ label:string; variant?:'ghost'|'outline'|'solid'; size?:number; active?:boolean; disabled?:boolean; onClick?:(e:any)=>void; style?:React.CSSProperties; }
export declare function IconButton(props:IconButtonProps):JSX.Element;