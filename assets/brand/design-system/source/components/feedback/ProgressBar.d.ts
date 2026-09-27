/** Rounded progress track. */
export interface ProgressBarProps{ value:number; max?:number; tone?:'sky'|'green'; label?:string; showValue?:boolean; height?:number; style?:React.CSSProperties; }
export declare function ProgressBar(props:ProgressBarProps):JSX.Element;