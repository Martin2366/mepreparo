/** Multiple-choice row (letter circle + math-serif answer). States follow the PAES practice flow. */
export interface AnswerOptionProps{ letter:string; children?:React.ReactNode; state?:'idle'|'selected'|'correct'|'incorrect'|'dimmed'; onClick?:(e:any)=>void; disabled?:boolean; style?:React.CSSProperties; }
export declare function AnswerOption(props:AnswerOptionProps):JSX.Element;