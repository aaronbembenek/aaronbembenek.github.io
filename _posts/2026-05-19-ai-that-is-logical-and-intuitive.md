---
layout: post
title: AI that is logical and intuitive 
date: 2026-05-19
description: introducing my McKenzie project 
tags: neurosymbolic-ai automated-reasoning
categories: mckenzie 
---

In July, I will begin a three-year McKenzie Postdoctoral Fellowship, which will allow me to pursue an independent research project at the University of Melbourne.
I figured I'd write a series of blog posts documenting my progress on this project.

The goal of my project is to develop the foundations for advanced AI systems that are both *logical* and *intuitive*.
The ability to reason in a logically correct way is a fundamental requirement for trustworthy AI---after all, we would expect AI systems in high-stakes domains to draw correct conclusions from assumptions, satisfy situational constraints, and generally be logically consistent.
At the same time, AI systems that are purely logical are inefficient (since they cannot use intuition to reach solutions quickly) and hard to use (since they cannot explain themselves in an intuitive way).
No current AI systems combine logic and intuition in a way that takes full advantage of these complementary modalities---a gap my project aims to address.

#### Automated reasoning and symbolic AI

While AI can be used for many tasks, my project focuses on *automated reasoning*---using computers to solve logical problems.
These problems are unambiguous, in that a candidate solution for a problem can be verified in a mechanical way (what is "correct" is not up to someone's interpretation).
Unsurprisingly, traditional automated reasoning tasks have an explicit mathematical flavor; good examples are software verification and automated theorem proving.
However, many tasks that are not outwardly mathematical also have facets that are amenable to automated reasoning.
Consider the task of writing an argumentative essay: while some aspects of the task are outside the scope of automated reasoning (e.g., the tone of the exposition, which is hard to specify in logic), automated reasoning can ensure that the essay's argument is logically consistent.

Solving an automated reasoning problem typically involves *search*---exploring multiple paths that might lead to a solution.
At certain points in the reasoning process, the only way for the AI system to make progress is to make some working assumptions, which might have to be retracted later if those assumptions result in a dead end.
The ability of an automated reasoning tool to find a solution efficiently (or at all) often depends on the quality of the working assumptions it makes during search.

Traditionally, automated reasoning tools have been built using *symbolic AI*, where computation consists of systematically applying rules.
To make this more concrete, we can imagine that we have the following three rules:

1. Every person is mortal.
2. Every horse is mortal.
3. Socrates is a person.

Given the task of proving "Socrates is mortal", a symbolic AI system would search for a proof of this proposition, using these rules to establish evidence.
Say the AI system starts its search by applying the first rule; its next proof obligation is to prove the proposition "Socrates is a person".
This fact is established directly in the third rule.
So, the first and third rules taken together constitute a proof that "Socrates is mortal".
As we can see here, symbolic AI has the advantage that it is trustworthy: we know that the reasoning process is logically correct, up to the correctness of the rules.

However, symbolic AI has two shortcomings that has limited its impact in practice.[^1]

First, it often fails to scale to automated reasoning problems with large search spaces, as it cannot use intuition to more efficiently guide its search for a solution.
In our example, a symbolic AI system might try to prove that Socrates is mortal by using the second rule, which would then require it to establish that "Socrates is a horse"; needless to say, this would lead to a dead end, and the AI system would have to start again.
A human familiar with Greek philosophy would not fall into this trap: they have prior knowledge that the historical Socrates was a person, not a horse, and so would be suspicious that the second rule would be useful for proving Socrates' mortality.
But, it is totally conceivable that a symbolic AI system would explore the wrong path---after all, in the purely logical world of symbolic AI, terms like "person", "mortal", "horse", and "Socrates" are just lifeless symbols with no connection to real-world phenomena.

Second, symbolic AI is difficult to use, as pure logic is hard to understand (at least for most people, myself included), and symbolic AI tools are incapable of explaining their reasoning in an intuitive way.
Our Socrates example is small and simple enough that this problem does not manifest, but one could imagine that it becomes tricky for humans to follow the logic---and map it back to the real world---as systems grow to thousands of rules and proofs become commensurately more complex.

#### Neurosymbolic AI for automated reasoning

To address these limitations, researchers have become interested in building automated reasoning systems based on *neurosymbolic AI*---a hybrid paradigm where symbolic AI is combined with neural networks, such as large language models (LLMs).
Whereas symbolic AI makes logical inferences based on rules, neural networks make statistical inferences based on learned patterns; these learned patterns can simulate intuition.
Indeed, it often appears that an LLM is acting with some form of intuition when we ask it to solve a task; on the other hand, LLMs are not guaranteed to act logically (not even in the "reasoning" modes), and thus LLMs are untrustworthy.

The goal here is to build automated reasoning systems that use "intuition" while staying logically correct---that is, to combine the advantages of neural networks and symbolic AI.
However, it is an open question about how to actually combine symbolic AI and neural networks to achieve the full potential of this combination.
Indeed, I believe that our current approach to structuring neurosymbolic AI systems is limiting the impact this exciting paradigm can have on automated reasoning.

Currently, neurosymbolic automated reasoning systems are conceptualized as consisting of multiple components chained together *in sequence*, where some components are symbolic, and some are neural networks (typically an LLM).[^2]
A classic example is the guess-and-check loop, where the LLM plays the role of the "guesser", and the symbolic component plays the role of the "checker".
The LLM guesses a candidate solution to a problem; the symbolic component checks if it is actually a solution; if not, the symbolic component passes a counterexample to the LLM (demonstrating why the candidate is a non-solution), and the LLM guesses again.
The idea is that, as the counterexamples accumulate, the guesser will fall upon a correct solution.

There are two limitations that are fundamental to an architecture like this, where computation flows through neural networks and symbolic components sequentially.

First, the guesser, being purely neural, does not have any of the advantages of symbolic AI.
An advantage of symbolic AI is that it is trustworthy: we can have definite guarantees about its behavior.
Here, we have no guarantees about the behavior of the guesser: we cannot be sure that it will produce candidate solutions that respect the counterexamples it has been given, and thus that it will actually make progress in searching the solution space.
These types of guarantees are standard for symbolic algorithms, but very hard to establish even for small neural networks, let alone frontier language models.
In principle, the LLM might guess the same wrong answers repeatedly, meaning that the guess-and-check loop never makes progress.

Second, the checker, being purely symbolic, does not have any of the advantages of neural networks, which would allow it to operate over "intuition". 
For one, it cannot ingest intuition for the candidate solution it receives.
This is a loss: if the checker had access to the intuition behind a guess, the checker could produce a counterexample that more effectively addresses why that intuition is incorrect. 
Moreover, the checker cannot give any intuition when it produces a counterexample; such intuition might help the guesser better understand how the counterexample works, leading to a better subsequent guess.

These limitations are inherent in our current Frankenstein-esque approach of bolting together symbolic components and neural networks in sequence.
My project asks how we can combine symbolic components and neural networks in a deeper, more principled way that will enable us to build more powerful neurosymbolic automated reasoning systems.

#### My insight: intuition and logic should evolve in parallel



#### Coda: will this matter as LLMs and agents get more powerful? 

<hr>

[^1]: There is a third shortcoming worth mentioning: where do the rules come from? I am going to ignore this for now, as there are plenty of automated reasoning tasks for which we already have rules (e.g., manually designed algorithms); however, perhaps I will address this point in a future blog post on program synthesis.
[^2]: I'll note too that this sequential linking of neural networks and symbolic components is essentially what happens in agentic frameworks, where an AI agent (the neural network) calls out to external tools (symbolic code).
