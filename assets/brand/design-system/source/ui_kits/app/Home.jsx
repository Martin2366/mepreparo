const {Card:HCard,Badge:HBadge,Button:HButton,ProgressBar:HProgress,Mascot:HMascot,Logo:HLogo,IconButton:HIconBtn,Icon:HIcon}=window.MePreparoDesignSystem_20851d;
const A='../../assets/';
function HomeScreen({onStart}){
  const topics=[['balanza','Ecuaciones','Álgebra · M1',64],['funcion','Funciones','Funciones · M1',38],['triangulo','Triángulos','Geometría · M1',12]];
  return <div style={{padding:'16px 20px 24px',display:'flex',flexDirection:'column',gap:20}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><HLogo variant="icon" height={36} assetBase={A}/><div style={{display:'flex',alignItems:'center',gap:6,font:'600 14px/1 var(--font-sans)'}}><HIcon name="flame" size={18} color="var(--mp-coral)"/>4 días</div></div>
    <div style={{display:'flex',alignItems:'center',gap:12}}>
      <div style={{flex:1}}><div style={{font:'var(--type-h2)',letterSpacing:'var(--ls-heading)'}}>Hola, Cata.</div><div style={{font:'var(--type-small)',color:'var(--text-muted)',marginTop:4}}>Hoy toca funciones. Diez ejercicios, a tu ritmo.</div></div>
      <HMascot pose="saludo" size={96} assetBase={A}/></div>
    <HCard padding={20} style={{display:'flex',flexDirection:'column',gap:14}}>
      <div style={{display:'flex',gap:8}}><HBadge>M1</HBadge><HBadge tone="neutral">Sesión de hoy</HBadge></div>
      <div style={{font:'var(--type-h3)'}}>Funciones cuadráticas</div>
      <HProgress value={3} max={10} label="3 de 10 ejercicios"/>
      <HButton size="lg" fullWidth iconRight="arrow-right" onClick={onStart}>Continuar</HButton>
    </HCard>
    <div className="mp-overline">Tus temas</div>
    <div style={{display:'flex',flexDirection:'column',gap:10}}>{topics.map(([ic,t,s,v])=>
      <HCard key={t} padding={14} onClick={onStart} style={{display:'flex',alignItems:'center',gap:14}}>
        <img src={A+'icons/'+ic+'-tile.png'} style={{width:52,height:44,objectFit:'cover',borderRadius:12}}/>
        <div style={{flex:1}}><div style={{font:'600 16px/1.2 var(--font-sans)'}}>{t}</div><div style={{font:'400 13px/1.3 var(--font-sans)',color:'var(--text-muted)',marginBottom:8}}>{s}</div><HProgress value={v} height={6} tone={v>60?'green':'sky'}/></div>
        <HIcon name="chevron-right" size={20} color="var(--text-muted)"/></HCard>)}</div>
  </div>;}
window.HomeScreen=HomeScreen;