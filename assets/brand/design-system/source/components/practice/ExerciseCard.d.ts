/**
 * PAES exercise card: axis badge, bookmark, question, answer options, optional hint/feedback footer.
 * @startingPoint section="Practice" subtitle="Multiple-choice exercise card with hint + feedback" viewport="700x620"
 */
export interface ExerciseCardProps{ axis?:string; topic?:string; question:React.ReactNode; children?:React.ReactNode; footer?:React.ReactNode; saved?:boolean; onToggleSave?:()=>void; style?:React.CSSProperties; }
export declare function ExerciseCard(props:ExerciseCardProps):JSX.Element;