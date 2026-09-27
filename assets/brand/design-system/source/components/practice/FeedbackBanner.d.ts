/** Result feedback after checking an answer. */
export interface FeedbackBannerProps{ tone?:'correct'|'retry'|'aja'; title:React.ReactNode; children?:React.ReactNode; sparkle?:boolean; style?:React.CSSProperties; }
export declare function FeedbackBanner(props:FeedbackBannerProps):JSX.Element;