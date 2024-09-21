---
layout: archive
title: "Optimal Transport and Isotonic Regression"
permalink: /notes/ot/
author_profile: true
---

{% include base_path %}

<script type="text/javascript">
  function checkPassword() {
    var passwordInput = document.getElementById("password").value;
    var correctPassword = "Artur.1994"; // Replace with your desired password

    if (passwordInput === correctPassword) {
      document.getElementById("protected-content").style.display = "block";
      document.getElementById("password-form").style.display = "none";
    } else {
      alert("Incorrect password! Please try again.");
    }
  }
</script>

<div id="password-form">
  <h2>This page is password protected</h2>
  <label for="password">Enter password:</label>
  <input type="password" id="password" name="password">
  <button onclick="checkPassword()">Submit</button>
</div>

<div id="protected-content" style="display: none;">
<!-- Your protected content goes here -->

## Table of Contents
- [Introduction](#introduction)
- [Wasserstein and $L^2$ distance](#wasserstein)
- [References](#references)

## <a id="introduction"></a> Introduction

We denote by $\mathcal{L}^d$ the Lebesgue measure in $\mathbf{R}^d$. We write $\mathcal{P}_2(\mathbf{R}^d)$ for the set of Borel probability measures with finite second-order moment. For two probability measures $\mu, \nu \in \mathcal{P}_2(\mathbf{R}^d)$, we write $\Pi(\mu, \nu)$ for the set of couplings

$$
\begin{aligned}
\Pi(\mu, \nu)=\left\{\pi \in \mathcal{P}(\mathbf{R}^d \times \mathbf{R}^d) \text { with marginals } \mu \text{ and } \nu \right\}
\end{aligned}
$$

and define their 2-Wasserstein distance as the solution of the Kantorovich problem:

$$
\begin{aligned}
W_2(\mu, \nu):=\left(\inf _{\pi \in \Pi(\mu, \nu)} \int\|x-y\|_2^2 d \pi(x, y)\right)^{1 / 2}
\end{aligned}
$$

For Borel sets $\mathcal{X}, \mathcal{Y} \subset \mathbf{R}^d$, map $T: \mathcal{X} \rightarrow \mathcal{Y}$ and $\mu \in \mathcal{P}(\mathcal{X})$, we denote by $T_{\sharp} \mu \in \mathcal{P}(\mathcal{Y})$ the pushforward of $\mu$ under $T$, i.e. the measure such that for any $A \subset \mathcal{Y}, T_{\sharp} \mu(A)=\mu\left(T^{-1}(A)\right)$. The Monge formulation of $\mathrm{OT}$ consists in considering maps such that $T_{\sharp} \mu=\nu$, instead of couplings. Both formulations are equal when feasible maps exist, namely

$$
\begin{aligned}
W_2(\mu, \nu) \equiv \left(\inf _{T: T_{\sharp} \mu=\nu} \int\|x-T(x)\|^2 d \mu(x)\right)^{1 / 2}
\end{aligned}
$$

## <a id="wasserstein"></a> Wasserstain  and $L^2$ distance in one dimension

Let $\mu \in \mathcal{P}_2(\mathbf{R}^d)$ and $\varphi: \mathbf{R}^d \rightarrow \mathbf{R}$ convex and differentiable $\mu$-a.e.

<div class="definition">
  <strong>Definition:</strong>

Let $\gamma \in \Pi(\mu, \nu)$ be an optimal plan from $\mu \in \mathcal{P}_2(x\in \mathbf{R}^d)$ to $\nu \in \mathcal{P}_2(y\in \mathbf{R}^d)$. The barycentric projection of $\gamma$ with respect to its first marginal $\mu=\pi_{\#}^1 \boldsymbol{\gamma}$
is a map $\bar{\gamma}: \mathbf{R}^d \rightarrow \mathbf{R}^d$ defined as

$$
\begin{aligned}
\bar{\gamma}\left(x\right):=\int y d \gamma\left(x,y\right) = \mathbf{E}_{(X,Y)\sim \gamma}[Y \mid X = x]\quad \text { for } \mu \text {-a.e. } x \in \mathbf{R}^d.
\end{aligned}
$$

</div>

If $d=1$ it is known that if $\gamma \in \Pi(\mu, \nu)$ is the optimal plan from $\mu$ to $\nu$ and $T$ is the (monotone) optimal transport plan, then $\bar{\gamma} = T$. In this case, we will have the following:

$$
\begin{aligned}
0= W_2^2\left( T_{\sharp} \mu, \nu\right) = \left\|T-\bar{\gamma}\right\|_{L^2(\mu)}^2.
\end{aligned}
$$

Clearly, for $\psi \neq T$, $\psi$ increasing, we won't necessarily have $0 = W_2^2( \psi_{\sharp} \mu, \nu )$ nor $0 = \left\lVert \psi - \bar{\gamma} \right\rVert_{L^2(\mu)}^2$, however, we will have $W_2^2( \psi_{\sharp} \mu, \nu ) = \left\lVert \psi - \bar{\gamma} \right\rVert_{L^2(\mu)}^2$ under certain conditions.


<div class="theorem" id="theorem1">
  <strong>Theorem 1:</strong>

Let $\mu, \nu \in \mathcal{P}_2(\mathbf{R})$. Suppose $\mu \ll \mathcal{L}^1$, or is purely atomic. Then, for any convex function $\varphi: \mathbf{R} \rightarrow \mathbf{R}$ such that $\varphi' \in L^2(\mu)$ we have 

$$
W_2^2\left( \varphi'_{\sharp} \mu, \nu\right) = \left\|\varphi^{\prime}-\bar{\gamma}\right\|_{L^2(\mu)}^2
$$
where $\gamma$ is the unique optimal coupling between $\mu$ and $\nu$. Where

\begin{equation}\label{eq:discrete_formulation}
\left\|\varphi^{\prime}-\bar{\gamma}\right\|_{L^2(\mu)}^2 = 
\begin{cases}
    \int \left[\varphi^{\prime}(x)-Q_\nu \circ F_\mu(x)\right]^2 d \mu(x), \quad & \text{ if } \mu \ll \mathcal{L}^1\\
    \sum_{i=1}^n a_i\left[\varphi^{\prime}\left(x_i\right)-\frac{1}{a_i}\left(\int_{\alpha_{i-1}}^{\alpha_i} Q_\nu(t) d t\right)\right]^2, \quad & \text{ if } \mu = \sum_{i=1}^n a_i \delta_{x_i}\\\end{cases}
\end{equation}

where for a measure $\rho$, we defined $F_\rho$ and $Q_\rho$ the cumulative distribution function and the quantile function associated with $\rho$ (i.e. the generalized inverse of the cumulative distribution function), and $\alpha_i=\sum_{k=1}^i a_k$ with $\alpha_0=0$, after we order $x_1 \leq \ldots \leq x_n$.

</div>


Theorem <a href="#theorem1">1</a> appears in the proof of Proposition 1 in <a href="#ref1" style="color:red;">[1]</a>.

## <a id="references"></a> References

1. <a id="ref1"></a> Paty, François-Pierre, Alexandre d’Aspremont, and Marco Cuturi. "Regularity as regularization: Smooth and strongly convex brenier potentials in optimal transport." In *International Conference on Artificial Intelligence and Statistics*, pp. 1222-1232. PMLR, 2020.

</div>