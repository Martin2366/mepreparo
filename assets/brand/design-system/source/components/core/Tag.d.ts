/** Selectable filter chip (topics, units). */
export interface TagProps{ selected?:boolean; onClick?:(e:any)=>void; children?:React.ReactNode; style?:React.CSSProperties; }
export declare function Tag(props:TagProps):JSX.Element;