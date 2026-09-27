/** Native select styled like Input. */
export interface SelectProps{ label?:string; options:(string|{value:string,label:string})[]; value?:string; defaultValue?:string; onChange?:(e:any)=>void; style?:React.CSSProperties; }
export declare function Select(props:SelectProps):JSX.Element;