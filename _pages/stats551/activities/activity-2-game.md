---
layout: single
title: "Activity 2 — Interactive Beta–Bernoulli Bandit (Game)"
permalink: /stats551/activities/activity-2/game/
author_profile: false
toc: false
classes: wide
mathjax: false
last_modified_at: 2025-09-15
---

{% include base_path %}

<!-- Back to activity page -->
<style>
.btn-back{
  display:inline-flex;align-items:center;gap:.5rem;
  padding:.48rem .9rem;border-radius:999px;
  background:#f2f2f2;border:1px solid #d9d9d9;color:#333;
  text-decoration:none;box-shadow:0 1px 2px rgba(0,0,0,.04);
  font-weight:500;transition:background .15s ease,border-color .15s ease,box-shadow .15s ease,transform .05s ease;
}
.btn-back:hover{ background:#ececec;border-color:#d0d0d0;box-shadow:0 2px 6px rgba(0,0,0,.06); }
.btn-back:active{ transform:translateY(1px); }
.btn-back > span:first-child{ font-size:1.1rem;line-height:1; }
</style>

<p>
  <a href="{{ '/stats551/activities/activity-2/' | relative_url }}" class="btn-back" aria-label="Back to Activity 2">
    <span>&#x2190;</span><span>Back to Activity 2</span>
  </a>
</p>

{% raw %}
<!-- ======= Bandit Game ======= -->
<div class="bandit-card" id="bandit-game">
  <div class="bandit-controls">
    <button class="btn-arm btn-arm-1" type="button" data-arm="0">Play Arm 1</button>
    <button class="btn-arm btn-arm-2" type="button" data-arm="1">Play Arm 2</button>
    <button class="btn-arm btn-arm-3" type="button" data-arm="2">Play Arm 3</button>
    <button class="btn-secondary" type="button" id="btn-ts">Sample (TS)</button>
    <button class="btn-secondary" type="button" id="btn-new">New Game</button>
  </div>

  <div class="bandit-status" id="status">
    Round 0/30 • Total reward: 0 • Choose an arm to start!
  </div>

  <div id="plots" class="bandit-plot"></div>
  <div class="bandit-reveal" id="reveal" hidden></div>
</div>

<!-- ======= Styling ======= -->
<style>
.bandit-card{ background:#fff; border:1px solid #e6e6e6; border-radius:14px; padding:18px 18px 8px;
  box-shadow:0 6px 18px rgba(0,0,0,.06); max-width:820px; margin:18px 0; }
.bandit-controls{ display:flex; flex-wrap:wrap; gap:.6rem; margin:12px 0 10px; }
.btn-arm, .btn-secondary{ border-radius:999px; padding:.55rem 1rem; font-weight:600; cursor:pointer;
  border:1px solid transparent; background:#f7f7f7; color:#222; box-shadow:0 1px 2px rgba(0,0,0,.05); transition:all .15s ease; }
.btn-arm:hover, .btn-secondary:hover{ transform:translateY(-1px); box-shadow:0 4px 10px rgba(0,0,0,.08); }
.btn-arm:active, .btn-secondary:active{ transform:translateY(0); }
.btn-arm-1{ border-color:#1f77b4; color:#0f3d63; background:linear-gradient(0deg,#eef6fd,#f7fbff); }
.btn-arm-2{ border-color:#ff7f0e; color:#7a3d00; background:linear-gradient(0deg,#fff2e6,#fff8f0); }
.btn-arm-3{ border-color:#2ca02c; color:#0d4f0d; background:linear-gradient(0deg,#eefdef,#f6fff6); }
.btn-secondary{ border-color:#d9d9d9; background:#f2f2f2; color:#333; }
.btn-secondary:hover{ background:#ececec; border-color:#d0d0d0; }
.bandit-status{ background:#f7f7f9; border:1px solid #ececf0; border-radius:10px; padding:.6rem .8rem;
  font-family:ui-monospace, Menlo, Consolas, monospace; font-size:14px; color:#333; }
.bandit-plot{ margin-top:12px; min-height:420px; }
.bandit-reveal{ margin:10px 0 4px; font-weight:600; color:#333; padding:.5rem .7rem;
  background:#f9fafb; border:1px dashed #d9d9d9; border-radius:10px; }
#plots .xtick text, #plots .ytick text { font-size:14px !important; }
</style>

<!-- ======= Logic with CDN fallback + local Beta math ======= -->
<script>
(function(){
  // ---------- Helpers: status  ----------
  function setStatus(msg){ const el=document.getElementById('status'); if(el) el.textContent = msg; }

  // ---------- Safe loader with fallback ----------
  function loadScript(src){
    return new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src=src; s.async=true; s.onerror=()=>reject(new Error('load failed '+src));
      s.onload=()=>resolve();
      document.head.appendChild(s);
    });
  }
  async function ensureLibs(){
    // Try jStat (optional)
    try{ await loadScript('https://cdn.jsdelivr.net/npm/jstat@1.9.6/dist/jstat.min.js'); }catch(e){}
    // Try Plotly (required for plots)
    try{
      await loadScript('https://cdn.jsdelivr.net/npm/plotly.js-dist-min@2.35.2/plotly.min.js');
    }catch(e){
      await loadScript('https://cdn.plot.ly/plotly-2.35.2.min.js'); // fallback
    }
  }

  // ---------- Local Beta math (fallback if jStat assente) ----------
  // logGamma via Lanczos
  function logGamma(z){
    const p=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,
             -176.61502916214059,12.507343278686905,-0.13857109526572012,
             9.9843695780195716e-6,1.5056327351493116e-7];
    const g=7;
    if(z<0.5){ return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*z))-logGamma(1-z); }
    z-=1; let x=p[0];
    for(let i=1;i<p.length;i++){ x += p[i]/(z+i); }
    const t=z+g+0.5;
    return 0.5*Math.log(2*Math.PI)+(z+0.5)*Math.log(t)-t+Math.log(x);
  }
  function betaPdfLocal(x,a,b){
    if(x<=0 || x>=1) return 0;
    return Math.exp((a-1)*Math.log(x)+(b-1)*Math.log(1-x) - (logGamma(a)+logGamma(b)-logGamma(a+b)));
  }
  // Normal(0,1) Box-Muller con cache
  let spare, hasSpare=false;
  function randn(){
    if(hasSpare){ hasSpare=false; return spare; }
    let u=0, v=0, s=0;
    do{ u=Math.random()*2-1; v=Math.random()*2-1; s=u*u+v*v; }while(s===0 || s>=1);
    const mul=Math.sqrt(-2*Math.log(s)/s);
    spare = v*mul; hasSpare=true; return u*mul;
  }
  // Marsaglia-Tsang Gamma(k,1)
  function randGamma(k){
    if(k<1){
      const u=Math.random();
      return randGamma(1+k)*Math.pow(u,1/k);
    }
    const d=k-1/3, c=1/Math.sqrt(9*d);
    for(;;){
      let x=randn(), v=1+c*x;
      if(v<=0) continue;
      v=v*v*v;
      const u=Math.random();
      if(u<1-0.0331*(x*x)*(x*x)) return d*v;
      if(Math.log(u) < 0.5*x*x + d*(1 - v + Math.log(v))) return d*v;
    }
  }
  function betaSampleLocal(a,b){
    const x=randGamma(a), y=randGamma(b);
    return x/(x+y);
  }
  const Beta = {
    pdf:(x,a,b)=> (window.jStat && jStat.beta && jStat.beta.pdf) ? jStat.beta.pdf(x,a,b) : betaPdfLocal(x,a,b),
    sample:(a,b)=> (window.jStat && jStat.beta && jStat.beta.sample) ? jStat.beta.sample(a,b) : betaSampleLocal(a,b)
  };

  // ---------- Game ----------
  const K=3, MAX_T=30;
  const colors=['#1f77b4','#ff7f0e','#2ca02c'];
  const lineWidth=4.5, markerSize=15;
  let thetas, alpha, beta, t, totalReward, sampleDots;

  function toSub(n){ const map={'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'}; return String(n).split('').map(d=>map[d]||d).join(''); }
  function randomThetas(){ const arr=[]; for(let i=0;i<K;i++){ arr.push(Beta.sample(2,2)); } return arr; }

  function resetState(){
    thetas = randomThetas();
    alpha = Array(K).fill(1);
    beta  = Array(K).fill(1);
    t = 0; totalReward = 0; sampleDots = [];
    setStatus(`Round ${t}/${MAX_T} • Total reward: ${totalReward} • Choose an arm to start!`);
    const rev=document.getElementById('reveal'); if(rev){ rev.hidden=true; rev.textContent=''; }
    updatePlot();
  }
  function pullArm(k){
    if(t>=MAX_T) return;
    const r=(Math.random()<thetas[k])?1:0;
    alpha[k]+=r; beta[k]+=1-r; totalReward+=r; t+=1;
    const face=r?'😀':'😞'; sampleDots=[];
    setStatus(`Round ${t}/${MAX_T} • Played Arm ${k+1} • Instantaneous reward: ${r} ${face} • Total reward: ${totalReward}`);
    updatePlot();
    if(t===MAX_T) revealThetas();
  }
  function sampleTS(){
    if(t>=MAX_T) return;
    const samples=alpha.map((a,i)=> Beta.sample(a, beta[i]));
    for(let k=0;k<K;k++){ sampleDots.push({k, x:samples[k]}); }
    const msg=`TS samples: ${samples.map((x,i)=>`θ${toSub(i+1)}≈${x.toFixed(2)}`).join(', ')} • would choose Arm ${samples.indexOf(Math.max(...samples))+1}`;
    setStatus(`Round ${t}/${MAX_T} • ${msg} • Total reward: ${totalReward}`);
    updatePlot();
  }
  function revealThetas(){
    const rev=document.getElementById('reveal');
    if(!rev) return;
    const vals=thetas.map((x,i)=>`θ${toSub(i+1)} = ${x.toFixed(3)}`).join('   ');
    rev.textContent=`Game over. True CTRs →  ${vals}`; rev.hidden=false;
  }

  function updatePlot(){
    const target=document.getElementById('plots'); if(!target) return;
    if(!window.Plotly){ setStatus('Plotly non caricato. Disabilita l’ad-block o vedi le note sotto.'); return; }

    const traces=[]; let yMax=0;
    // densità
    for(let k=0;k<K;k++){
      const xs=[], ys=[], a=alpha[k], b=beta[k], steps=400;
      for(let i=0;i<=steps;i++){
        const x=i/steps;
        xs.push(x);
        let y=Beta.pdf(x,a,b);
        if(!isFinite(y)) y=0;
        ys.push(y); if(y>yMax) yMax=y;
      }
      traces.push({ x:xs, y:ys, mode:'lines', name:`Arm ${k+1} (α=${a}, β=${b})`,
                    line:{ width:lineWidth, color:colors[k] }, hoverinfo:'name+x+y' });
    }
    // puntini TS con lo stesso colore
    for(const {k,x} of sampleDots){
      traces.push({ x:[x], y:[1e-6], mode:'markers', showlegend:false,
                    marker:{ color:colors[k], size:markerSize, symbol:'circle' },
                    hoverinfo:'x', hovertemplate:`TS sample θ${toSub(k+1)}=%{x:.3f}<extra></extra>`,
                    cliponaxis:false });
    }
    const yPadBelow=Math.max(0.12*yMax,0.15), yMin=-yPadBelow, yTop=yMax*1.2+1e-6;
    const layout={ title:{text:'Posterior distributions (updated each round)', font:{size:20}},
      xaxis:{ title:'θ', range:[0,1], titlefont:{size:16}, tickfont:{size:14} },
      yaxis:{ title:'Density', range:[yMin,yTop], titlefont:{size:16}, tickfont:{size:14}, zeroline:false },
      legend:{ font:{size:14} }, margin:{ l:60, r:20, t:48, b:50 }, hovermode:'closest', height:420
    };
    Plotly.newPlot(target, traces, layout, {displayModeBar:false, responsive:true});
  }

  function wireUI(){
    document.querySelectorAll('.btn-arm').forEach(btn=>{
      btn.addEventListener('click', ()=>pullArm(Number(btn.dataset.arm)));
    });
    const ts=document.getElementById('btn-ts'), nw=document.getElementById('btn-new');
    if(ts) ts.addEventListener('click', sampleTS);
    if(nw) nw.addEventListener('click', resetState);
  }

  // Boot: carica librerie (con fallback) e avvia
  (async function(){
    wireUI();
    try{ await ensureLibs(); }catch(e){}
    resetState();
  })();
})();
</script>
{% endraw %}

<!-- Librerie locali (defer mantiene l'ordine e carica prima di DOMContentLoaded) -->
<script src="{{ '/assets/js/jstat-1.9.6.min.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/plotly-2.35.2.min.js' | relative_url }}" defer></script>

<!-- Logica del gioco separata -->
<script src="{{ '/assets/js/bandit-game.js' | relative_url }}" defer></script>
