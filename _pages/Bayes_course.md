---
layout: archive
title: "Bayesian Modeling (STATS/DATASCI 551, Fall 2025)"
permalink: /teaching/stats551-fa2025/
author_profile: true
---

{% include base_path %}

# STATS/DATASCI 551 Fall 2025
# Bayesian Modeling

**Navigation:** [Overview](#overview) · [Course Calendar](#calendar) · [Lecture Schedule](#lectures) · [Final Project](#project) · [Acknowledgements](#acknowledgements)

---

## <a id="overview"></a> Overview

This course provides basic concepts and several modern techniques of Bayesian modeling and computation. They include basic models, conjugate priors, and posterior computation, as well as techniques associated with complex models, such as hierarchical models, spatiotemporal models, and dynamical models. A substantial part of the course is devoted to computational algorithms based on Markov Chain Monte Carlo sampling for complex models. If time permits, we will also introduce advanced topics such as nonparametric Bayes, variational inference, and Hamiltonian Monte Carlo techniques. Foundational topics will be discussed when appropriate, although they are not our primary focus in this course; such topics may include decision theoretic characterization of Bayesian inference and its relation to frequentist methods, de Finetti-type theorems and the existence of priors, objective prior distributions, and Bayesian model selection.

### Syllabus
For course policies, course requirements, and grading policies, please see the syllabus [[link]](bayesian_syllabus_2025.pdf).

### Piazza
Students should sign up on Piazza [[link]](https://piazza.com/umich/fall2025/stats551001fa2025) to join course discussions.

**All communications with the teaching team (the instructor and the GSIs) should be conducted over Piazza; please do not email.** If you'd like to reach the instructor or the GSIs for private questions, please post a private note on Piazza that is only visible to the instructor and the GSIs. See [these instructions](https://support.piazza.com/support/solutions/articles/48000616669-post-a-private-note) for details. The GSIs and the instructor will be monitoring Piazza, endorsing correct student answers, and answering questions that remain after a discussion.

**Piazza participation bonus:** Up to 3 percentage points will be added to your final course grade based on Piazza participation. You will get `(3x/100)` bonus percentage points if the number of your total Piazza contributions is `(x * 100)%` of the maximum number of contributions among all students. The number of Piazza contributions will be determined by Piazza class statistics.

### Teaching Team and Office Hours
- **Instructor:** Yixin Wang  
  - **Office Hour:** Weekly [Office Hours](https://calendar.google.com/calendar/u/1?cid=Y19vcGlqcWhrZjloM2MzZHBhb2dkcGh1aHU3OEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t)
- **GSI:** Daniele Bracale  
  - **Office Hour:** TBD

Please refer to the course calendar for details.

---

## <a id="calendar"></a> Course Calendar

- **Lecture:** Mon/Wed 2:30pm–3:50pm  
- **Location:** 1202 SEB  
- **Google Calendar:** The Google Calendar below ideally contains all events and deadlines for students' convenience. You can add this calendar to your Google Calendar by clicking the **+** button on the bottom-right corner of the embed. Any ad‑hoc changes to the schedule will appear here first.

<iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=America%2FNew_York&showTitle=1&showNav=1&showTabs=1&mode=AGENDA&src=Y2M2MjI2aHRxODhhNzNpZnE3dWtnam84MGtAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%234285F4" style="border-width:0" width="800" height="400" frameborder="0" scrolling="no"></iframe>

---

## <a id="lectures"></a> Lecture Schedule

The schedule is subject to change.

By each date, please read about the topic at hand; please choose **one** reading from the list for the topic.

**Abbreviations**  
FBSM = *A First Course in Bayesian Statistical Methods* [[link]](https://link.springer.com/book/10.1007/978-0-387-92407-6)  
BDA = *Bayesian Data Analysis* by Gelman [[link]](http://www.stat.columbia.edu/~gelman/book/)  
PML = *Probabilistic Machine Learning: Advanced Topics* by Murphy [[link]](https://probml.github.io/pml-book/book2.html)  
PRML = *Pattern Recognition and Machine Learning* by Bishop [[link]](https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf)

| Session        | Date   | Topic                                                  | Readings |
|:---------------|:-------|:-------------------------------------------------------|:---------|
| Lecture 1      | 08/25  | Introduction I                                         | BDA ch. 1; FBSM ch. 1; “Bayesian data analysis for newcomers” [(Kruschke & Liddel, 2018)](https://link.springer.com/article/10.3758/s13423-017-1272-1); “Review of Probability” [(Blei, 2016)](http://www.cs.columbia.edu/~blei/fogm/2016F/doc/probability_review.pdf); “R Basics with Google Colab” [Notebook](https://colab.research.google.com/drive/1iz6ILnVGt8Qc6UR1l7oTPou4l6WSrw9S?usp=sharing) [Video](https://www.youtube.com/watch?v=qE_nQPojhhw) |
| Lecture 2      | 08/27  | Introduction II                                        | '' |
| Labor Day      | 09/01  | ————————————————————————————                           | ———————————————————————————— |
| Lecture 3      | 09/03  | Interpretation of probabilities and Bayes' formulas I  | FBSM ch. 2 |
| Lecture 4      | 09/08  | Interpretation of probabilities and Bayes' formulas II | '' |
| Lecture 5      | 09/10  | One-parameter models I                                 | BDA ch. 2; FBSM ch. 3 |
| Lecture 6      | 09/15  | One-parameter models II                                | '' |
| Lecture 7      | 09/17  | Monte Carlo approximation                              | FBSM ch. 4 |
| Lecture 8      | 09/22  | The normal model I                                     | FBSM ch. 5 |
| Lecture 9      | 09/24  | The normal model II                                    | '' |
| Lecture 10     | 09/29  | The normal model III                                   | '' |
| Lecture 11     | 10/01  | Bayesian Computation and Introduction to Stan I        | FBSM ch. 6; BDA ch. 10–12 |
| Lecture 12     | 10/06  | Bayesian Computation and Introduction to Stan II       | '' |
| Lecture 13     | 10/08  | Bayesian Computation and Introduction to Stan III      | '' |
| Fall break     | 10/13  | ————————————————————————————                           | ———————————————————————————— |
| Lecture 14     | 10/15  | Bayesian Computation and Introduction to Stan IV       | '' |
| Lecture 15     | 10/20  | Multi-parameter models I                               | FBSM ch. 7; BDA ch. 3 |
| Lecture 16     | 10/22  | **Midterm Exam**                                       |  |
| Lecture 17     | 10/27  | Multi-parameter models II                              | '' |
| Lecture 18     | 10/29  | Group comparisons and hierarchical modeling I          | FBSM ch. 8; BDA ch. 5 |
| Lecture 19     | 11/03  | Group comparisons and hierarchical modeling II         | '' |
| Lecture 20     | 11/05  | Regression Models I                                    | FBSM ch. 9; BDA ch. 14–16 |
| Lecture 21     | 11/10  | Regression Models II                                   | '' |
| Lecture 22     | 11/12  | Regression Models III                                  | '' |
| Lecture 23     | 11/17  | Regression Models IV                                   | '' |
| Lecture 24     | 11/19  | Model checking & comparison I                          | BDA ch. 8–9 |
| Lecture 25     | 11/24  | Model checking & comparison II                         | '' |
| Thanksgiving   | 11/26  | ————————————————————————————                           | ———————————————————————————— |
| Lecture 26     | 12/01  | Finite mixture models I                                | BDA ch. 22; “Bayesian Mixture Models and the Gibbs Sampler” [(Blei, 2016)](http://www.cs.columbia.edu/~blei/fogm/2016F/doc/gibbs.pdf) |
| Lecture 27     | 12/03  | Finite mixture models II                               | '' |
| Lecture 28     | 12/08  | Bayesian decision theory; Summary (and wiggle room)    | BDA ch. 9 |

---

## <a id="project"></a> Final Project

The final project is an individual project. For requirements of the final project, please see the [final project guidelines](bayesian_project_2025.pdf). The LaTeX template for the project report is available [here](template.zip).

---

## <a id="acknowledgements"></a> Acknowledgements

The course materials are adapted from the related courses offered by David Blei, Yang Chen, Andrew Gelman, Long Nguyen, and Scott Linderman.
