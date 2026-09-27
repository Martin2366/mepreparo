/** 22px rounded checkbox; checked = Celeste fill + white check. */
export interface CheckboxProps{ checked?:boolean; defaultChecked?:boolean; onChange?:(e:any)=>void; label?:React.ReactNode; disabled?:boolean; style?:React.CSSProperties; }
export declare function Checkbox(props:CheckboxProps):JSX.Element;