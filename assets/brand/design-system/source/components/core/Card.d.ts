/** Rounded white surface (20px radius, hairline warm border, soft ink shadow). */
export interface CardProps{ padding?:number|string; elevated?:boolean; tone?:'white'|'paper'|'sky'; children?:React.ReactNode; style?:React.CSSProperties; onClick?:(e:any)=>void; }
export declare function Card(props:CardProps):JSX.Element;