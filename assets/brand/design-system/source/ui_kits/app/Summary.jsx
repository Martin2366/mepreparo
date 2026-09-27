const {Dialog:SDialog,Button:SButton,Mascot:SMascot}=window.MePreparoDesignSystem_20851d;
function SummaryScreen({onHome,onAgain}){
  return <div style={{padding:24,display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100%'}}>
    <SDialog inline title="¡Terminaste la sesión!" illustration={<SMascot pose="celebrando" size={150} assetBase="../../assets/"/>}
      actions={<><SButton size="lg" fullWidth onClick={onAgain}>Seguir practicando</SButton><SButton size="lg" fullWidth variant="ghost" onClick={onHome}>Volver al inicio</SButton></>}>
      Resolviste 8 de 10. Lo que te costó queda guardado para repasar mañana.
      <div style={{font:'400 22px/1.1 var(--font-hand)',color:'var(--mp-ink)',marginTop:16,transform:'rotate(-3deg)'}}>Tú puedes. Vamos paso a paso.</div>
    </SDialog></div>;}
function ProgressScreen(){const {Card:PC,Tabs:PT,ProgressBar:PB,Badge:PBd,Mascot:PM}=window.MePreparoDesignSystem_20851d;
  return <div style={{padding:'16px 20px 24px',display:'flex',flexDirection:'column',gap:18}}>
    <div style={{font:'var(--type-h2)'}}>Tu progreso</div><PT tabs={['Semana','Mes','Todo']}/>
    <PC padding={20} style={{display:'flex',alignItems:'center',gap:16}}><div style={{flex:1}}><div style={{font:'700 36px/1 var(--font-sans)'}}>46</div><div style={{font:'var(--type-small)',color:'var(--text-muted)'}}>ejercicios esta semana</div></div><PM pose="estudiando" size={90} assetBase="../../assets/"/></PC>
    <PC padding={20} style={{display:'flex',flexDirection:'column',gap:14}}>{[['Álgebra',72],['Funciones',48],['Geometría',21],['Probabilidad',9]].map(([t,v])=><PB key={t} label={t} value={v} showValue tone={v>60?'green':'sky'}/>)}</PC>
  </div>;}
window.SummaryScreen=SummaryScreen;window.ProgressScreen=ProgressScreen;