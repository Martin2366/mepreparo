/** Small status pill — e.g. PAES axis "M1"/"M2", difficulty, streak. */
export interface BadgeProps{ tone?:'sky'|'ink'|'coral'|'green'|'neutral'; children?:React.ReactNode; style?:React.CSSProperties; }
export declare function Badge(props:BadgeProps):JSX.Element;