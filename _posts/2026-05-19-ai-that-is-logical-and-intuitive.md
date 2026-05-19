---
layout: post
title: AI that is logical and intuitive 
date: 2026-05-19
description: march & april, looking forward to summer
tags: neurosymbolic-ai automated-reasoning
categories: mckenzie 
---

In July, I will begin a three-year McKenzie Postdoctoral Fellowship, which will allow me to pursue an independent research project at the University of Melbourne.
I figured I'd write a series of blog posts documenting my progress on this project.

The goal of my project is to develop the foundations for advanced AI systems that are both *logical* and *intuitive*.
The ability to reason in a logically correct way is a fundamental requirement for trustworthy AI---after all, we would expect AI systems in high-stakes domains to draw correct conclusions from assumptions, satisfy situational constraints, and generally be logically consistent.
At the same time, AI systems that are purely logical are inefficient (since they cannot use intuition to reach solutions quickly) and hard to use (since they cannot explain themselves in an intuitive way).
No current AI systems combine logic and intuition in a way that takes full advantage of these complementary modalities---a gap my project aims to address.

#### Context: automated reasoning

While AI can be used for many tasks, my project focuses on *automated reasoning*---using computers to solve logical problems.
These problems are unambiguous, in that a candidate solution for a problem can be verified in a mechanical way (it is not up to someone's interpretation).
Unsurprisingly, traditional automated reasoning tasks have an explicit mathematical flavor; good examples are software verification and automated theorem proving.
However, many tasks that are not outwardly mathematical also have facets that are amenable to automated reasoning.
Consider the task of writing an argumentative essay: while some aspects of the task are outside the scope of automated reasoning (e.g., the style and tone of the essay), automated reasoning can ensure that the essay's argument is logically consistent.

Typically, solving an automated reasoning problem involves *search*---at certain points in the reasoning process, the only way for the AI system to make progress is to make working assumptions, which might have to be retracted later if they result in a dead end.
The ability of an automated reasoning tool to find a solution efficiently (or at all) often depends on the quality of the working assumptions it makes during search.

#### Neurosymbolic AI for automated reasoning

Traditionally, automated reasoning tools have been built using symbolic AI, where computation consists of systematically applying rules.
For example, we might have a rule saying that if proposition `A` is true, then we can derive that proposition `B` is true.
Symbolic AI has the advantage that it is trustworthy: we know that the reasoning process is logically correct, up to the correctness of the rules.
However, symbolic AI has two shortcomings that has limited its impact in practice.[^1]
First, it often fails to scale to automated reasoning problems with large search spaces, as it cannot use intuition to more efficiently guide its search for a solution.
Second, symbolic AI is difficult to use, as pure logic is hard to understand (at least for most people, myself included), and symbolic AI tools are incapable of explaining their reasoning in an intuitive way.

- NeSy AI
- Sequential NeSy
- Guess-and-check
- Agents
- Limitations 

#### My insight: intuition and logic should evolve in parallel



#### Coda: will this matter as LLMs and agents get more powerful? 

<hr>

[^1]: There is a third shortcoming worth mentioning: where do the rules come from? I am going to ignore this for now, as there are plenty of automated reasoning tasks for which we already have rules (e.g., manually designed algorithms); however, perhaps I will address this point in a future blog post on program synthesis.
