/** On/off toggle, 46×28. */
export interface SwitchProps{ checked?:boolean; defaultChecked?:boolean; onChange?:(on:boolean)=>void; label?:React.ReactNode; style?:React.CSSProperties; }
export declare function Switch(props:SwitchProps):JSX.Element;