(function(){
    // ---------- Config ----------
    const K = 3;
    const MAX_T = 30;
    const colors = ['#1f77b4', '#ff7f0e', '#2ca02c'];
    const lineWidth = 4.5;
    const markerSize = 15;
  
    let thetas, alpha, beta, t, totalReward, sampleDots;
  
    // ---------- Utils ----------
    function setStatus(msg){ const el = document.getElementById('status'); if (el) el.textContent = msg; }
    function toSub(n){
      const map = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
      return String(n).split('').map(d=>map[d]||d).join('');
    }
  
    // ---------- Beta math (usa jStat se c'è, altrimenti fallback locale) ----------
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
    let spare, hasSpare=false;
    function randn(){
      if(hasSpare){ hasSpare=false; return spare; }
      let u=0, v=0, s=0;
      do{ u=Math.random()*2-1; v=Math.random()*2-1; s=u*u+v*v; }while(s===0 || s>=1);
      const mul=Math.sqrt(-2*Math.log(s)/s);
      spare = v*mul; hasSpare=true; return u*mul;
    }
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
  
    // ---------- Game state ----------
    function randomThetas(){ const arr=[]; for(let i=0;i<K;i++){ arr.push(Beta.sample(2,2)); } return arr; }
  
    function resetState(){
      thetas = randomThetas();
      alpha = Array(K).fill(1);
      beta  = Array(K).fill(1);
      t = 0; totalReward = 0; sampleDots = [];
      setStatus(`Round ${t}/${MAX_T} • Total reward: ${totalReward} • Choose an arm to start!`);
      const rev = document.getElementById('reveal'); if(rev){ rev.hidden=true; rev.textContent=''; }
      updatePlot();
    }
  
    function pullArm(k){
      if(t >= MAX_T){ return; }
      const r = (Math.random() < thetas[k]) ? 1 : 0;
      alpha[k] += r;
      beta[k]  += (1 - r);
      totalReward += r;
      t += 1;
      const face = r ? '😀' : '😞';
      sampleDots = []; // azzera i puntini TS dopo un play
      setStatus(`Round ${t}/${MAX_T} • Played Arm ${k+1} • Instantaneous reward: ${r} ${face} • Total reward: ${totalReward}`);
      updatePlot();
      if(t === MAX_T){ revealThetas(); }
    }
  
    function sampleTS(){
      if(t >= MAX_T){ return; }
      const samples = alpha.map((a,i)=> Beta.sample(a, beta[i]));
      for(let k=0;k<K;k++){ sampleDots.push({k, x: samples[k]}); }
      const msg = `TS samples: ${samples.map((x,i)=>`θ${toSub(i+1)}≈${x.toFixed(2)}`).join(', ')} • would choose Arm ${samples.indexOf(Math.max(...samples))+1}`;
      setStatus(`Round ${t}/${MAX_T} • ${msg} • Total reward: ${totalReward}`);
      updatePlot();
    }
  
    function revealThetas(){
      const rev = document.getElementById('reveal');
      if(!rev) return;
      const vals = thetas.map((x,i)=>`θ${toSub(i+1)} = ${x.toFixed(3)}`).join('   ');
      rev.textContent = `Game over. True CTRs →  ${vals}`;
      rev.hidden = false;
    }
  
    // ---------- Plot ----------
    function updatePlot(){
      const target = document.getElementById('plots'); if(!target) return;
      if(!window.Plotly){ setStatus('Plotly non caricato. Controlla gli script in fondo alla pagina.'); return; }
  
      const traces = []; let yMax = 0;
  
      // curve di densità
      for(let k=0;k<K;k++){
        const xs=[], ys=[], a=alpha[k], b=beta[k], steps=400;
        for(let i=0;i<=steps;i++){
          const x=i/steps;
          xs.push(x);
          let y=Beta.pdf(x,a,b);
          if(!isFinite(y)) y=0;
          ys.push(y);
          if(y>yMax) yMax=y;
        }
        traces.push({
          x: xs, y: ys, mode: 'lines', name: `Arm ${k+1} (α=${a}, β=${b})`,
          line: { width: lineWidth, color: colors[k] }, hoverinfo:'name+x+y'
        });
      }
  
      // puntini TS con lo stesso colore della curva corrispondente
      for (const {k,x} of sampleDots){
        traces.push({
          x: [x], y: [1e-6], mode: 'markers', showlegend: false,
          marker: { color: colors[k], size: markerSize, symbol: 'circle' },
          hoverinfo: 'x',
          hovertemplate: `TS sample θ${toSub(k+1)}=%{x:.3f}<extra></extra>`,
          cliponaxis: false
        });
      }
  
      const yPadBelow = Math.max(0.12 * yMax, 0.15);
      const yMin = -yPadBelow;
      const yTop = yMax * 1.2 + 1e-6;
  
      const layout = {
        title: { text: 'Posterior distributions (updated each round)', font: { size: 20 } },
        xaxis: { title: 'θ', range: [0,1], titlefont:{size:16}, tickfont:{size:14} },
        yaxis: { title: 'Density', range: [yMin, yTop], titlefont:{size:16}, tickfont:{size:14}, zeroline: false },
        legend: { font:{ size:14 } },
        margin: { l: 60, r: 20, t: 48, b: 50 },
        hovermode: 'closest',
        height: 420
      };
  
      Plotly.newPlot(target, traces, layout, {displayModeBar:false, responsive:true});
    }
  
    // ---------- UI ----------
    function wireUI(){
      document.querySelectorAll('.btn-arm').forEach(btn => {
        btn.addEventListener('click', () => pullArm(Number(btn.dataset.arm)));
      });
      const ts = document.getElementById('btn-ts');
      const nw = document.getElementById('btn-new');
      if (ts) ts.addEventListener('click', sampleTS);
      if (nw) nw.addEventListener('click', resetState);
    }
  
    // ---------- Boot ----------
    document.addEventListener('DOMContentLoaded', function(){
      wireUI();
      resetState();
    });
  })();
  