/** 22px radio; selected = Celeste ring + dot. For exam answers use AnswerOption instead. */
export interface RadioProps{ checked?:boolean; defaultChecked?:boolean; onChange?:(e:any)=>void; label?:React.ReactNode; disabled?:boolean; style?:React.CSSProperties; }
export declare function Radio(props:RadioProps):JSX.Element;