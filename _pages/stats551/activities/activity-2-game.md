---
layout: single
title: "Activity 2 — Interactive Beta–Bernoulli Bandit for Banner Ads Game"
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
    <button class="btn-arm btn-arm-1" type="button" onclick="playAd(0)">Play Ad 1</button>
    <button class="btn-arm btn-arm-2" type="button" onclick="playAd(1)">Play Ad 2</button>
    <button class="btn-arm btn-arm-3" type="button" onclick="playAd(2)">Play Ad 3</button>
    <button class="btn-secondary" type="button" onclick="thompson()">Sample (TS)</button>
    <button class="btn-secondary" type="button" onclick="newGame()">New Game</button>
  </div>

  <div class="bandit-status" id="status">
    Round 0/30 • Total reward: 0 • Choose an ad to start!
  </div>

  <div id="plots" class="bandit-plot"></div>

  <div class="bandit-reveal" id="reveal" hidden></div>
</div>

<!-- ======= Styling ======= -->
<style>
.bandit-card{
  background:#fff; border:1px solid #e6e6e6; border-radius:14px; padding:18px 18px 8px;
  box-shadow:0 6px 18px rgba(0,0,0,.06); max-width:820px; margin:18px 0;
}
.bandit-title{ margin:0 0 8px; font-weight:700; letter-spacing:.2px; }
.bandit-controls{ display:flex; flex-wrap:wrap; gap:.6rem; margin:12px 0 10px; }
.btn-arm, .btn-secondary{
  border-radius:999px; padding:.55rem 1rem; font-weight:600; cursor:pointer;
  border:1px solid transparent; background:#f7f7f7; color:#222;
  box-shadow:0 1px 2px rgba(0,0,0,.05); transition:all .15s ease;
}
.btn-arm:hover, .btn-secondary:hover{ transform:translateY(-1px); box-shadow:0 4px 10px rgba(0,0,0,.08); }
.btn-arm:active, .btn-secondary:active{ transform:translateY(0); }
.btn-arm-1{ border-color:#1f77b4; color:#0f3d63; background:linear-gradient(0deg,#eef6fd,#f7fbff); }
.btn-arm-2{ border-color:#ff7f0e; color:#7a3d00; background:linear-gradient(0deg,#fff2e6,#fff8f0); }
.btn-arm-3{ border-color:#2ca02c; color:#0d4f0d; background:linear-gradient(0deg,#eefdef,#f6fff6); }
.btn-arm-1:hover{ background:#e8f2fc; }
.btn-arm-2:hover{ background:#ffecd9; }
.btn-arm-3:hover{ background:#e9fbe9; }
.btn-secondary{ border-color:#d9d9d9; background:#f2f2f2; color:#333; }
.btn-secondary:hover{ background:#ececec; border-color:#d0d0d0; }
.bandit-status{
  background:#f7f7f9; border:1px solid #ececf0; border-radius:10px;
  padding:.6rem .8rem; font-family:ui-monospace, Menlo, Consolas, monospace;
  font-size:14px; color:#333;
}
.bandit-plot{ margin-top:12px; min-height:420px; }
.bandit-reveal{
  margin:10px 0 4px; font-weight:600; color:#333; padding:.5rem .7rem;
  background:#f9fafb; border:1px dashed #d9d9d9; border-radius:10px;
}
#plots .xtick text, #plots .ytick text { font-size:14px !important; }
</style>

<!-- ======= Libraries ======= -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jstat/1.9.6/jstat.min.js"></script>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

<!-- ======= Logic ======= -->
<script>
(function(){
  const K = 3;
  const MAX_T = 30;
  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c'];
  const lineWidth = 4.5;
  const markerSize = 15;

  let thetas, alpha, beta, t, totalReward, sampleDots;

  function toSub(n){
    const map = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
    return String(n).split('').map(d=>map[d]||d).join('');
  }

  function randomThetas(){
    const arr = [];
    for(let i=0;i<K;i++){ arr.push(jStat.beta.sample(2,2)); }
    return arr;
  }

  function resetState(){
    thetas = randomThetas();
    alpha = Array(K).fill(1);
    beta  = Array(K).fill(1);
    t = 0;
    totalReward = 0;
    sampleDots = [];
    setStatus(`Round ${t}/${MAX_T} • Total reward: ${totalReward} • Choose an ad to start!`);
    const rev = document.getElementById('reveal');
    rev.hidden = true;
    rev.textContent = '';
    updatePlot();
  }

  function setStatus(msg){ document.getElementById('status').textContent = msg; }

  function playAd(k){
    if(t >= MAX_T){ return; }
    const r = (Math.random() < thetas[k]) ? 1 : 0;
    alpha[k] += r;
    beta[k]  += (1 - r);
    totalReward += r;
    t += 1;
    const face = r ? '😀' : '😞';
    sampleDots = []; // clear TS dots after play
    setStatus(`Round ${t}/${MAX_T} • Played Ad ${k+1} • Instantaneous reward: ${r} ${face} • Total reward: ${totalReward}`);
    updatePlot();
    if(t === MAX_T){ revealThetas(); }
  }

  function thompson(){
    if(t >= MAX_T){ return; }
    const samples = alpha.map((a,i)=> jStat.beta.sample(a, beta[i]));
    for(let k=0;k<K;k++){ sampleDots.push({k, x: samples[k]}); }
    const msg = `TS samples: ${samples.map((x,i)=>`θ${toSub(i+1)}≈${x.toFixed(2)}`).join(', ')} • would choose Ad ${samples.indexOf(Math.max(...samples))+1}`;
    setStatus(`Round ${t}/${MAX_T} • ${msg} • Total reward: ${totalReward}`);
    updatePlot();
  }

  function revealThetas(){
    const rev = document.getElementById('reveal');
    const vals = thetas.map((x,i)=>`θ${toSub(i+1)} = ${x.toFixed(3)}`).join('   ');
    rev.textContent = `Game over. True CTRs →  ${vals}`;
    rev.hidden = false;
  }

  function updatePlot(){
    const traces = [];
    let yMax = 0;

    // density curves
    for(let k=0;k<K;k++){
        const xs = [], ys = [];
        const a = alpha[k], b = beta[k];
        const steps = 400;
        for(let i=0;i<=steps;i++){
        const x = i/steps;
        xs.push(x);
        let y = 0;
        try { y = jStat.beta.pdf(x, a, b); } catch(e) { y = 0; }
        if (!isFinite(y)) y = 0;
        ys.push(y);
        if(y > yMax) yMax = y;
        }
        traces.push({
        x: xs, y: ys, mode: 'lines', name: `Ad ${k+1} (α=${a}, β=${b})`,
        line: { width: lineWidth, color: colors[k] }, hoverinfo:'name+x+y'
        });
    }

    // TS sample dots ~on the x-axis
    for (const {k,x} of sampleDots){
        traces.push({
        x: [x], y: [1e-6], mode: 'markers', name: null, showlegend: false,
        marker: { color: colors[k], size: markerSize, symbol: 'circle' },
        hoverinfo: 'x',
        hovertemplate: `TS sample θ${toSub(k+1)}=%{x:.3f}<extra></extra>`,
        cliponaxis: false   // extra safety: don't clip markers at the axis
        });
    }

    // give space below 0 so dots aren't cut off
    const yPadBelow = Math.max(0.12 * yMax, 0.15); // at least 0.15 below zero
    const yMin = -yPadBelow;
    const yTop = yMax * 1.2 + 1e-6;

    const layout = {
        title: { text: 'Posterior distributions (updated each round)', font: { size: 20 } },
        xaxis: { title: 'θ', range: [0,1], titlefont:{size:16}, tickfont:{size:14} },
        yaxis: {
        title: 'Density',
        range: [yMin, yTop],
        titlefont:{size:16}, tickfont:{size:14},
        zeroline: false   // keep axis line off so it doesn't cover the dots
        // (set to true with zerolinecolor:'#ddd', zerolinewidth:1 if you want a faint line)
        },
        legend: { font:{ size:14 } },
        margin: { l: 60, r: 20, t: 48, b: 50 },
        hovermode: 'closest',
        height: 420
    };

    Plotly.newPlot('plots', traces, layout, {displayModeBar:false, responsive:true});
    }


  window.playAd = playAd;
  window.thompson = thompson;
  window.newGame = resetState;
  resetState();
})();
</script>
{% endraw %}
