/** Segmented pill tabs on a sunken paper track. */
export interface TabsProps{ tabs:(string|{value:string,label:string})[]; value?:string; defaultValue?:string; onChange?:(v:string)=>void; style?:React.CSSProperties; }
export declare function Tabs(props:TabsProps):JSX.Element;