const {ExerciseCard:EXCard,AnswerOption:EXOpt,HintBox:EXHint,FeedbackBanner:EXFb,Button:EXBtn,IconButton:EXIcon,ProgressBar:EXProg,Mascot:EXMascot}=window.MePreparoDesignSystem_20851d;
const Q=[{q:<>La función <span className="mp-math">f(x) = x² − 4x + 3</span>, ¿cuál es su vértice?</>,o:['(1, 2)','(2, −1)','(2, 3)','(4, −1)'],a:1,h:<>El vértice se encuentra en <span className="mp-math">x = −b / 2a</span>.</>,t:'Funciones cuadráticas'},
{q:<>Si <span className="mp-math">3x − 5 = 10</span>, ¿cuánto vale <span className="mp-math">x</span>?</>,o:['3','5','15','−5'],a:1,h:<>Suma 5 a ambos lados y luego divide por 3.</>,t:'Ecuaciones lineales'}];
function ExerciseScreen({onExit,onFinish}){
  const [i,setI]=React.useState(0);const [sel,setSel]=React.useState(null);const [checked,setChecked]=React.useState(false);const [hint,setHint]=React.useState(false);const [saved,setSaved]=React.useState(false);
  const q=Q[i];const ok=sel===q.a;
  const st=k=>!checked?(sel===k?'selected':'idle'):k===q.a&&ok?'correct':k===sel?'incorrect':'dimmed';
  const next=()=>{if(i+1<Q.length){setI(i+1);setSel(null);setChecked(false);setHint(false);setSaved(false)}else onFinish()};
  const retry=()=>{setChecked(false);setSel(null)};
  return <div style={{padding:'12px 16px 24px',display:'flex',flexDirection:'column',gap:16,minHeight:'100%'}}>
    <div style={{display:'flex',alignItems:'center',gap:12}}><EXIcon icon="x" label="Salir" onClick={onExit}/><EXProg value={3+i} max={10} style={{flex:1}}/><span style={{font:'600 13px/1 var(--font-sans)',color:'var(--text-muted)'}}>{3+i}/10</span></div>
    <EXCard axis="M1" topic={q.t} question={q.q} saved={saved} onToggleSave={()=>setSaved(!saved)}
      footer={<>{hint&&<EXHint>{q.h}</EXHint>}{checked&&(ok?<EXFb tone="correct" title="¡Correcto!">Encontraste el vértice sin atajos.</EXFb>:<EXFb tone="retry" title="Casi. Revisa el signo.">Vuelve a intentarlo, vas bien.</EXFb>)}</>}>
      {q.o.map((t,k)=><EXOpt key={k} letter={'ABCD'[k]} state={st(k)} disabled={checked} onClick={()=>setSel(k)}>{t}</EXOpt>)}
    </EXCard>
    {!checked&&!hint&&<div style={{display:'flex',alignItems:'center',gap:10}}><EXMascot pose="pensando" size={64} assetBase="../../assets/"/><div style={{font:'400 20px/1.15 var(--font-hand)',transform:'rotate(-3deg)'}}>¿Te doy una pista?</div></div>}
    <div style={{flex:1}}/>
    <div style={{display:'flex',gap:10}}>
      {!checked&&<EXBtn variant="secondary" size="lg" iconLeft="lightbulb" onClick={()=>setHint(true)} disabled={hint}>Pista</EXBtn>}
      {!checked&&<EXBtn size="lg" fullWidth disabled={sel===null} onClick={()=>setChecked(true)}>Revisar</EXBtn>}
      {checked&&!ok&&<EXBtn size="lg" fullWidth variant="secondary" onClick={retry}>Intentar de nuevo</EXBtn>}
      {checked&&ok&&<EXBtn size="lg" fullWidth iconRight="arrow-right" onClick={next}>Siguiente</EXBtn>}
    </div></div>;}
window.ExerciseScreen=ExerciseScreen;