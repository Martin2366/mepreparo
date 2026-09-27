/** Hover/focus hint bubble. tone="soft" = Celeste speech-bubble look from the brand sheet. */
export interface TooltipProps{ content:React.ReactNode; children:React.ReactNode; placement?:'top'|'bottom'; tone?:'ink'|'soft'; forceOpen?:boolean; }
export declare function Tooltip(props:TooltipProps):JSX.Element;