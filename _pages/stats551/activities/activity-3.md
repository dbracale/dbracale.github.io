---

layout: single
title: "Activity 3 — Temperature prediction"
permalink: /stats551/activities/activity-3/
author_profile: false
toc: true
toc_label: "Contents"
toc_sticky: true
classes: wide
mathjax: true
last_modified_at: 2025-10-29
---

<style>
/* Remove the big background box */
.page, .page__content { background: none !important; box-shadow: none !important; border: none !important; }

/* Buttons */
.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.6rem 1rem;border-radius:12px;border:1px solid #d0d5dd;background:#f7f7f9;color:#111;text-decoration:none;font-weight:700;box-shadow:0 1px 2px rgba(0,0,0,.04), inset 0 -1px 0 rgba(255,255,255,.5);transition:transform .06s ease, box-shadow .15s ease, background .15s ease}
.btn:hover{ background:#f0f2f5; box-shadow:0 3px 10px rgba(0,0,0,.08); transform:translateY(-1px) }
.btn:active{ transform:translateY(0) }
.btn .emoji{ font-size:1.1rem }
.btn {
  color: #000 !important;
}


/* Form */
form.activity3{max-width:720px;background:#fff;border:1px solid #e6e6eb;border-radius:16px;padding:1rem 1.25rem;margin:1rem 0;box-shadow:0 1px 2px rgba(0,0,0,.03)}
form.activity3 fieldset{border:none;margin:0;padding:0}
form.activity3 .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
form.activity3 .row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
form.activity3 label{font-weight:600;margin-top:.6rem;display:block}
form.activity3 input, form.activity3 select{width:100%;padding:.55rem .6rem;border:1px solid #d0d5dd;border-radius:10px}
form.activity3 small{color:#666}
form.activity3 .help{font-size:.9rem;color:#555;margin-top:.25rem}
.alert{padding:.65rem .8rem;border-radius:10px;margin:.6rem 0;font-weight:600}
.alert.success{background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0}
.alert.error{background:#fef2f2;color:#7f1d1d;border:1px solid #fecaca}
.codeblock{background:#0f172a;color:#e5e7eb;border-radius:12px;padding:1rem;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;white-space:pre;overflow:auto}
</style>

<p>
  <a href="{{ '/stats551/' | relative_url }}" class="btn" aria-label="Back to course home">
    <span>←</span><span>Back to course home</span>
  </a>
</p>

---

## What you will do

Each student will predict the **daily average temperature (°F)** in **New York City** for the following 5 dates:

**December 3, 4, 5, 6, 7 (2025)**.

You will:

1. **Collect data** you consider relevant (e.g., historical weather for NYC, NOAA, ECMWF forecasts, etc.).
2. **Choose a model** and **specify a prior** (Bayesian is required or score will be zero). Any reasonable model is allowed (ARIMA with Bayesian priors, Bayesian linear regression with weather covariates, Bayesian calibration of forecast ensembles, etc.).
3. **Produce for each date** $d\in\\{3,4,5,6,7\\}$:

   * a **point prediction** (mean) $\hat{y}_d$ in **°F**,
   * a **two–sided** **$(1-\alpha)$** **credible/confidence interval** $[L_d, U_d]$ in **°F** (you choose the level, e.g. 80%, 90%, 95%).

4. **Submit two things on Canvas**: Submit a **PDF** with the following constraints: 
   * The first part of the pdf is **max 2 pages** in which you explain: data sources, what data you used, model summary, priors, and how you computed $\hat{y}_d$, $[L_d,U_d]$.
   * The rest of the PDF is your **code** with the following instructions: no page limit, the final output of the code has to be a table $3 \times 5$. Row 1 is the mean temeperature, row 2 is the lower CI bound and row 3 is the upper CI bound, for a total of 15 predictions. the table has to be a direct output of the code (copy and paste is not allowed).

5. **Submit your data into the Excel file provided in Canvas** using the following formatting: All temperatures must be in **Fahrenheit**, numeric with **exactly two decimals** (e.g., 35.67). For each date, submit 3 numbers divided by comma. 
\\[
\text{ e.g. } \quad 44.13, 40.10, 46.15
\\]
The first number is the daily average predicted temperature, the second is the lower CI bound, the last is the upper CI bound. An example can be found at the bottom of the Excel file provided in Canvas.

> **Deadline**: Ultimate deadline is Decmeber 1 st, 11:59 PM for both PDF submission and Excel submission. Only Excel submission  or PDF will get zero score.

---

## Scoring

The maximim points for this activity is 2.5; divided as follows: 1 point is given to the clearness of the pdf submission. The additional 1.5 is calculated as follows. After each of the five dates passes, we take the **true observed NYC average temperature** for that day (from a fixed source I disclose in class). For each day (d):

* If the truth $y^{\text{true}}_d\notin[L_d,U_d]$, your **day score** is $S_d=0$.
* If $y^{\text{true}}_d\in[L_d,U_d]$, your score **decreases** with the absolute error and with the interval length. We propose the smooth, bounded function:

\\[
S_d
= \exp\big(-\alpha|y^{\text{true}}_d - \hat{y}_d|\big)\times\exp\big(-\beta(U_d-L_d)\big)\times\mathbf{1}\\{y^{\text{true}}_d\in[L_d,U_d]\\},
\\]

with **default parameters** $\alpha=0.10$ (per °F) and $\beta=0.05$ (per °F). Thus $0\le S_d\le 1$.

**Final activity score**: up to 1 point for the pdf plus
\\[
\text{Points} = 1.5\times \frac{1}{5}\sum_{d\in{3,4,5,6,7}} S_d.
\\]


<!-- <div id="a3-messages" aria-live="polite"></div>

<form class="activity3" id="activity3-form" novalidate>
  <fieldset>
    <label for="umid">UMich ID (8-digit UMID)</label>
    <input id="umid" name="umid" type="text" inputmode="numeric" autocomplete="off"
           placeholder="e.g., 12345678" required pattern="^[0-9]{8}$" aria-describedby="umid-help">
    <div class="help" id="umid-help">Enter your 8-digit UMID (numbers only).</div>
  </fieldset>

  <div class="row">
    <fieldset>
      <label for="day">Day</label>
      <select id="day" name="day" required>
        <option value="" disabled selected>Select day</option>
        <option value="3">Dec 3</option>
        <option value="4">Dec 4</option>
        <option value="5">Dec 5</option>
        <option value="6">Dec 6</option>
        <option value="7">Dec 7</option>
      </select>
    </fieldset>
  </div>

  <div class="row-3">
    <fieldset>
      <label for="mean">Mean prediction (°F)</label>
      <input id="mean" name="mean" type="number" step="0.01" placeholder="e.g., 35.67" required>
      <small>Two decimals, Fahrenheit</small>
    </fieldset>
    <fieldset>
      <label for="cil">Lower CI (°F)</label>
      <input id="cil" name="cil" type="number" step="0.01" placeholder="e.g., 31.20" required>
    </fieldset>
    <fieldset>
      <label for="ciu">Upper CI (°F)</label>
      <input id="ciu" name="ciu" type="number" step="0.01" placeholder="e.g., 39.90" required>
    </fieldset>
  </div>

  <div style="display:flex;gap:.6rem;align-items:center;margin-top:.6rem">
    <button type="submit" class="btn" id="submit-btn"><span class="emoji">📤</span>Submit data</button>
    <button type="button" class="btn" id="reset-btn">Reset</button>
  </div>

  <div class="help">Logged-in @umich.edu only. You may re-submit a day; the latest submission before the deadline is used.</div>
</form> -->

<!-- 
{% raw %}
<script>
(() => {
  console.log("✅ JavaScript loaded!");

  const form = document.getElementById('activity3-form');
  const messages = document.getElementById('a3-messages');
  const submitBtn = document.getElementById('submit-btn');
  const resetBtn = document.getElementById('reset-btn');

  // Use the /exec URL (NOT /dev, NOT /a/macros)
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbwmeB7spjAnHD7_E-hmmrWJDu394W8Y4n_ofc3kAM8ol7uCts72tNbUrzFdWnUeBpK1/exec';

  function showMsg(text, type = 'success'){
    messages.innerHTML = `<div class="alert ${type === 'success' ? 'success' : 'error'}">${text}</div>`;
  }
  function twoDecimals(x){ return Number.parseFloat(x).toFixed(2); }
  function plausibleFahrenheit(x){ return x > -60 && x < 120; }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messages.innerHTML = '';

    const umid = (form.umid.value||'').trim();
    const day = form.day.value;
    const mean = Number(form.mean.value);
    const cil = Number(form.cil.value);
    const ciu = Number(form.ciu.value);

    if(!/^[0-9]{8}$/.test(umid)) return showMsg('UMID must be exactly 8 digits.', 'error');
    if(!['3','4','5','6','7'].includes(day)) return showMsg('Please select a valid day (Dec 3–7).', 'error');
    if([mean, cil, ciu].some(v => !Number.isFinite(v))) return showMsg('Mean/CI must be valid numbers.', 'error');
    if(!(cil <= mean && mean <= ciu)) return showMsg('Require: Lower ≤ Mean ≤ Upper.', 'error');
    if(![mean, cil, ciu].every(plausibleFahrenheit)) return showMsg('Values look implausible (−60 to 120 °F allowed).', 'error');

    // ✅ IMPORTANT: send as form-encoded to avoid CORS preflight
    const payload = new URLSearchParams({
      umid,
      day: String(Number(day)),
      mean: twoDecimals(mean),
      cil: twoDecimals(cil),
      ciu: twoDecimals(ciu),
      userAgent: navigator.userAgent,
      tsClient: new Date().toISOString()
    });

    submitBtn.disabled = true; submitBtn.textContent = 'Submitting…';
    try{
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        // DO NOT set headers; browser will use application/x-www-form-urlencoded
        body: payload
      });

      // Read JSON directly (no CORS preflight => response is readable)
      const data = await res.json();
      if(!data.ok) throw new Error(data.message || 'Submission failed');

      showMsg(`Saved ✔ — UMID ${umid}, Dec ${day}: mean ${Number(mean).toFixed(2)}°F, CI [${Number(cil).toFixed(2)}, ${Number(ciu).toFixed(2)}].`);
      form.reset();
    }catch(err){
      console.error(err);
      showMsg(`Error: ${err.message || err}`, 'error');
    }finally{
      submitBtn.disabled = false; submitBtn.textContent = 'Submit data';
    }
  });

  resetBtn.addEventListener('click', () => { form.reset(); messages.innerHTML=''; });
})();
</script>

{% endraw %} -->

<!-- ---

## Grading helper (Python & R snippets)

### Python

```python
import pandas as pd
import numpy as np

alpha, beta = 0.10, 0.05  # per °F

df = pd.read_csv('Submissions.csv')  # or export from Google Sheets
truth = {3: 39.4, 4: 37.8, 5: 35.6, 6: 33.1, 7: 31.3}  # replace with actuals

# keep latest submission per (uniqname, day)
df = df.sort_values('timestamp').groupby(['uniqname','day'], as_index=False).tail(1)

def day_score(row):
    y = truth[int(row['day'])]
    L, U, m = row['cil'], row['ciu'], row['mean']
    if not (L <= y <= U):
        return 0.0
    return float(np.exp(-alpha*abs(y-m)) * np.exp(-beta*(U-L)))

scores = df.copy()
scores['S'] = scores.apply(day_score, axis=1)
final = scores.groupby('uniqname')['S'].mean().reset_index(name='avg_S')
final['points'] = 2.5 * final['avg_S']
print(final.sort_values('points', ascending=False))
```

### R

```r
library(dplyr)
alpha <- 0.10; beta <- 0.05
truth <- c(`3`=39.4, `4`=37.8, `5`=35.6, `6`=33.1, `7`=31.3) # replace

subm <- read.csv('Submissions.csv')
latest <- subm |> arrange(timestamp) |> group_by(uniqname, day) |> slice_tail(n=1)

score_fun <- function(day, mean, cil, ciu){
  y <- truth[as.character(day)]
  if(!(cil <= y && y <= ciu)) return(0)
  exp(-alpha*abs(y-mean)) * exp(-beta*(ciu-cil))
}

res <- latest |> rowwise() |
  mutate(S = score_fun(day, mean, cil, ciu)) |> ungroup() |
  group_by(uniqname) |> summarise(avg_S = mean(S), points = 2.5*avg_S) |
  arrange(desc(points))
print(res)
```

--- -->

<!-- ## FAQ / Notes for students

* **Units**: Always Fahrenheit with **two decimals**.
* **One day per submission**: You can submit Dec 3 today and Dec 4 tomorrow, etc.
* **Updates**: Only the **latest** valid entry before the deadline is graded.
* **Intervals**: You choose the level (e.g., 90%). Wider intervals are safer but lower your score; too narrow risks 0 if truth falls outside.
* **Modeling guidance**: Mention your priors and how you computed the interval (central credible interval, HPD, bootstrap percentile, etc.). Attach references if you used external forecasts. -->