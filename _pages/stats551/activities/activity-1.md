---
layout: single
title: "for Air France 447"
permalink: /stats551/activities/activity-1/
author_profile: false
toc: true
toc_label: "Contents"
toc_sticky: true
classes: wide
mathjax: true
last_modified_at: 2025-09-15
---

{% include base_path %}

<style>
/* Remove the big background box */
.page, .page__content {
  background: none !important;
  box-shadow: none !important;
  border: none !important;
}
</style>


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
</style>

<p>
  <a href="{{ '/stats551/' | relative_url }}" class="btn-back" aria-label="Back to course home">
    <span>&#x2190;</span><span>Back to course home</span>
  </a>
</p>


## Background

On **June 1, 2009**, *Air France Flight 447* tragically crashed into the Atlantic Ocean, resulting in the loss of all passengers and crew. Despite three intensive searches, the wreckage remained undiscovered for nearly a year. The breakthrough came when French authorities enlisted the help of **Metron**, a company specializing in Bayesian search analysis. By employing Bayesian methods, investigators were able to dramatically narrow down the search area, eventually leading to the successful recovery of the wreckage.

---

## The Role of Bayesian Search Analysis

Bayesian search analysis involves creating multiple hypotheses about what may have happened and constructing probability distributions for the location of the wreckage under each scenario. As search efforts are conducted and evidence is gathered, the **prior probabilities** are updated to form **posterior distributions**, which reflect the most likely areas given all the information available. This iterative updating process enables a rational, data-driven approach to search and recovery missions.

In the case of Air France 447, Bayesian analysis allowed authorities to integrate different sources of information—ranging from flight data to ocean currents and previous failed search results—into a coherent probabilistic framework. This proved far more effective than conventional search methods alone.

---

## Why This Matters

This case highlights the real-world power of **Bayesian statistics**, not only as an abstract mathematical framework but as a tool with **life-saving implications**. It demonstrates how statistical thinking can be applied in high-stakes, uncertain environments to guide critical decisions.

---

## Reading and Reflection

Please read the short *Statistical Science* paper linked below, which details the methodology and the case study of the Air France search. As you read, reflect on the following:

1. **How does Bayesian updating differ from classical approaches** in this context?  
2. **What are the strengths and limitations** of using Bayesian methods in real-world search problems?  
3. **Where else might this analysis be useful?** Think of applications beyond aviation (e.g., search-and-rescue, cybersecurity, clinical monitoring).

<p>
  <a class="btn btn--info" href="https://projecteuclid.org/journals/statistical-science/volume-27/issue-2/Bayesian-Search-for-Air-France-Flight-447/10.1214/12-STS370.full" target="_blank" rel="noopener">
    Read the paper: <strong>Statistical Science — Bayesian Search for Air France 447</strong>
  </a>
</p>
