/** Mobile app tab bar. */
export interface BottomNavItem{ value:string; label:string; /** Lucide name */ icon:string; }
export interface BottomNavProps{ items:BottomNavItem[]; value?:string; onChange?:(v:string)=>void; style?:React.CSSProperties; }
export declare function BottomNav(props:BottomNavProps):JSX.Element;