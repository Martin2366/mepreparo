/** MePreparo logo image. assetBase = path from the page to this DS's assets/ folder. */
export interface LogoProps{ variant?:'lockup'|'icon'|'wordmark'; height?:number; assetBase?:string; style?:React.CSSProperties; }
export declare function Logo(props:LogoProps):JSX.Element;