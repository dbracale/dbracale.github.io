---
layout: single
title: "Activity 2: Beta–Bernoulli Bandit for Banner Ads"
permalink: /stats551/activities/activity-2/
author_profile: false
toc: true
toc_label: "Contents"
toc_sticky: true
classes: wide
mathjax: true
last_modified_at: 2025-09-15
---
<style>
/* Remove the big background box */
.page, .page__content {
  background: none !important;
  box-shadow: none !important;
  border: none !important;
}
</style>




{% include base_path %}

<!-- Back button -->
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

/* Launch game button */
.btn-primary-lg{
  display:inline-flex;align-items:center;gap:.6rem;
  padding:.7rem 1.1rem;border-radius:12px;border:1px solid #d0d5dd;
  background:#f7f7f9;color:#111;text-decoration:none;font-weight:700;
  box-shadow:0 1px 2px rgba(0,0,0,.04), inset 0 -1px 0 rgba(255,255,255,.5);
  transition:transform .06s ease, box-shadow .15s ease, background .15s ease;
}
.btn-primary-lg:hover{ background:#f0f2f5; box-shadow:0 3px 10px rgba(0,0,0,.08); transform:translateY(-1px); }
.btn-primary-lg:active{ transform:translateY(0); }
.btn-primary-lg .emoji{ font-size:1.15rem; }
</style>

<p>
  <a href="{{ '/stats551/' | relative_url }}" class="btn-back" aria-label="Back to course home">
    <span>&#x2190;</span><span>Back to course home</span>
  </a>
</p>

---

- We model a website that, for each arriving user, shows one of \\(K\\) banner ads.  
- If ad \\(k\in\{1,\dots,K\}\\) is displayed, the outcome is a *click* (\\(r=1\\)) with probability \\(\theta_k\in[0,1]\\) and *no click* (\\(r=0\\)) with probability \\(1-\theta_k\\).  
- The vector \\(\theta=(\theta_1,\dots,\theta_K)\\) is unknown and fixed. The quantity \\(\theta_k\\) is the *click-through rate (CTR)* of ad \\(k\\).

### Interaction protocol
Over rounds \\(t=1,2,\ldots,T\\):
- choose an ad \\(x_t\in\{1,\dots,K\}\\) to show;
- observe a binary reward \\(r_t\in\\{0,1\\}\\) indicating whether the user clicked.

Formally,
\\[
\mathbb{P}(r_t=1\mid x_t=k,\theta)=\theta_k,
\qquad 
\mathbb{P}(r_t=0\mid x_t=k,\theta)=1-\theta_k.
\\]

---

## Goal: maximize clicks via low regret

We want a policy (sequence \\(x_1,\dots,x_T\\)) that maximizes the expected number of clicks. It is standard to evaluate policies via *regret*. Let
\\[
\theta^\star \triangleq \max_{k} \theta_k,
\qquad 
\Delta_k \triangleq \theta^\star-\theta_k \ge 0.
\\]
If \\(N_k(T)\\) is the number of times ad \\(k\\) is shown by time \\(T\\), the cumulative (realized) regret is
\begin{equation}\label{eq:regret-def}
R_T \;\triangleq\; T\,\theta^\star - \sum_{t=1}^T r_t,
\end{equation}
and its expectation satisfies
\\[
\mathbb{E}[R_T] \;=\; \sum_{k\neq k^\star} \Delta_k \,\mathbb{E}[N_k(T)],
\qquad 
k^\star\in\arg\max_k \theta_k.
\\]
Thus, small regret means suboptimal ads are selected only *sublinearly* often.

---

## Bayesian modeling for the Beta–Bernoulli bandit

**Goal.** For each ad \\(k\\), we want to learn its (unknown) click-through rate (CTR) \\(\\theta_k\\in(0,1)\\) from binary outcomes \\(r_t\\in\\{0,1\\}\\) observed when that ad is shown.

---

### Step 0 — Data model (what we observe)
If ad \\(k\\) is shown at round \\(t\\), we assume
\\[
r_t \\mid (x_t=k,\\theta_k)\\sim \\mathrm{Bernoulli}(\\theta_k).
\\]
**Why:** A click/no-click is a single success/failure trial; Bernoulli is the standard model for that.

---

### Step 1 — Prior (what we believe before data)
For each ad \\(k\\), place an **independent** Beta prior
\\[
\\theta_k \\sim \\mathrm{Beta}(\\alpha_k,\\beta_k)\\quad\\text{with density}
\\]
\\[
\\label{eq:beta-pdf}
p(\\theta_k)=\\frac{\\Gamma(\\alpha_k+\\beta_k)}{\\Gamma(\\alpha_k)\\Gamma(\\beta_k)}\\,
\\theta_k^{\\alpha_k-1}(1-\\theta_k)^{\\beta_k-1}, \\quad k=1,\\dots,K.
\\]
If you have no prior information, set \\((\\alpha_k,\\beta_k)=(1,1)\\) (uniform on \\([0,1]\\)).
**Why:** The Beta family is supported on \\((0,1)\\) and is **conjugate** to the Bernoulli likelihood, making updates simple and fast.

> **Interpretation:** \\(\\alpha_k-1\\) and \\(\\beta_k-1\\) act as *pseudocounts* of prior “clicks” and “no-clicks,” respectively.

---

### Step 2 — Likelihood (how data inform \\(\theta_k\\))
Suppose ad \\(k\\) has been shown \\(n_k\\) times so far, producing \\(s_k\\) clicks and \\(f_k=n_k-s_k\\) no-clicks. The likelihood is
\\[
p(\\text{data}_k\\mid \\theta_k)\\propto \\theta_k^{\\,s_k}(1-\\theta_k)^{\\,f_k}.
\\]
**Why:** Bernoulli trials are independent given \\(\theta_k\\); multiplying their probabilities collects exponents \\(s_k\\) and \\(f_k\\).

---

### Step 3 — Posterior (Bayes’ rule = prior × likelihood)
Multiplying prior and likelihood yields another Beta:
\\[
\\theta_k \\mid \\text{data}_k \\;\\sim\\; \\mathrm{Beta}\\big(\alpha_k+s_k,\;\beta_k+f_k\big).
\\]
Equivalently, you can **update online** after each new outcome \\(r_t\\) when ad \\(k\\) is shown:
\\[
\\label{eq:beta-update}
(\\alpha_k,\\beta_k)\\leftarrow (\\alpha_k+r_t,\\;\\beta_k+(1-r_t)),
\\]
leaving \\((\\alpha_j,\\beta_j)\\) unchanged for \\(j\\neq k\\).
**Why (conjugacy):** The Beta prior and Bernoulli likelihood have the same functional form in \\(\\theta_k\\), so the posterior stays in the Beta family with parameters that just add counts.

---

### Step 4 — Point estimates (what number to report)
A convenient summary is the posterior mean
\\[
\\label{eq:posterior-mean}
\\hat{\\theta}_k \\;\\triangleq\\; \\mathbb{E}[\\theta_k\\mid \\text{data}_k] \\;=\\; 
\\frac{\\alpha_k}{\\alpha_k+\\beta_k}.
\\]
**Why:** For \\(\\mathrm{Beta}(\\alpha,\\beta)\\), the mean is \\(\\alpha/(\\alpha+\\beta)\\); with pseudocounts it becomes a smoothed empirical CTR.

> **Confidence grows with data:** The posterior variance for \\(\\mathrm{Beta}(\\alpha,\\beta)\\) is
> \\[
> \\mathrm{Var}[\\theta_k\\mid \\text{data}_k]=
> \\frac{\\alpha_k\\,\\beta_k}{(\\alpha_k+\\beta_k)^2\\,(\alpha_k+\\beta_k+1)},
> \\]
> which **shrinks** as \\(\\alpha_k+\\beta_k\\) increases. This justifies saying the posterior “concentrates” as we collect more outcomes.

---

### Step 5 — Repeat (sequential learning)
Each time you show ad \\(k\\), observe \\(r_t\\), apply the update in \\eqref{eq:beta-update}, and recompute summaries like \\(\\hat{\\theta}_k\\) in \\eqref{eq:posterior-mean}. Policies (e.g., Greedy or Thompson Sampling) then use these posteriors to choose which ad to show next.

---

## Baseline: Greedy (posterior-mean) policy

At each round \\(t\\):
1. For each \\(k\\), compute \\(\hat{\theta}_k\\) via \eqref{eq:posterior-mean}.
2. Play \\(x_t\in\arg\max_k \hat{\theta}_k\\).
3. Observe \\(r_t\\) and update \eqref{eq:beta-update}.

Greedy always exploits the current best estimate and can under-explore if early noise misleads it.

---

## Thompson Sampling (TS) for Beta--Bernoulli

At each round \\(t\\):
1. For each \\(k\\), draw a *plausible CTR* from its posterior:
   \\[
   \tilde{\theta}_k \sim \mathrm{Beta}(\alpha_k,\beta_k).
   \\]
2. Play \\(x_t\in\arg\max_k \tilde{\theta}_k\\).
3. Observe \\(r_t\\) and update \eqref{eq:beta-update}.

This randomized choice naturally balances exploration (trying uncertain ads) and exploitation (favoring ads likely to have high CTR). 

**Remark (regret behavior).** In the Bernoulli bandit, the Greedy policy has linear regret \\(\mathbb{E}[R_T]=O(T)\\), while TS achieves logarithmic expected regret (order-optimal): \\(\mathbb{E}[R_T]=O\left(\sum_{k\neq k^\star}\frac{\log T}{\Delta_k}\right)\\) under standard conditions.

---

# LET'S SIMULATE AND PLAY THIS GAME!

---

**Game description & rules**

- You control a 3-arm bandit with hidden click-through rates \\(\\theta_1,\\theta_2,\\theta_3\\).  
- Each round, up to \\(T=30\\), choose one ad. You’ll see the **instantaneous reward** (😀 for 1, 😞 for 0).  
- Each arm’s posterior is \\(\\mathrm{Beta}(\\alpha_k,\\beta_k)\\) and updates as
\\[
(\\alpha_k,\\beta_k)\\leftarrow(\\alpha_k+r_t,\\;\\beta_k+(1-r_t)).
\\]

**Controls buttoms**
- **Play Ad 1/2/3**: pulls that arm and updates its posterior.  
- **Sample (TS)**: you have the possibility to play a Thompson Sampling strategy. If you want to play this strategy, push this buttom to draws \\(\\tilde\\theta_k\\sim\\mathrm{Beta}(\\alpha_k,\\beta_k)\\) for each arm and make your decision.
- **New Game**: resets with fresh random CTRs \\(\\theta_k\\sim\\mathrm{Beta}(2,2)\\) and uniform priors \\((1,1)\\).  
- After round 30, the true CTRs \\(\\theta_k\\) are revealed.

---

<p>
  <a class="btn-primary-lg" href="{{ '/stats551/activities/activity-2/game/' | relative_url }}">
    <span class="emoji">🎮</span> <span>Launch the interactive game</span>
  </a>
</p>
