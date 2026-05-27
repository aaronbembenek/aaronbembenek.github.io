---
layout: post
title: AI That Is Simultaneously Logical and Intuitive 
date: 2026-05-27
description: Introducing the parallel neurosymbolic architecture 
tags: neurosymbolic-ai automated-reasoning
categories: research
---

In July, I will begin a three-year McKenzie Postdoctoral Fellowship, which will allow me to pursue an independent research project at The University of Melbourne.
This is the first in a series of blog posts documenting my progress on this project.

The goal of my project is to develop the foundations for advanced AI systems that are both *logical* and *intuitive*.
The ability to reason in a logically correct way strikes me as a key desideratum for future AI systems, both from the perspective of AI safety---we want to be able to trust the "thought process" of AI systems---and from a capability perspective, since certain tasks require logical reasoning.
After all, it seems reasonable to expect a superintelligent machine to draw correct conclusions from assumptions, satisfy situational constraints, and generally be logically consistent.
At the same time, AI systems that are purely logical are inefficient (since they cannot use intuition to reach solutions quickly) and hard to interact with (since they cannot explain themselves to users in an intuitive way).
No current AI systems combine logic and intuition in a way that takes full advantage of these complementary modalities---a gap my project aims to address.

In this post, I will lay out the context and motivation of my project, as well as its key insight.
In later posts, I will explain how this insight can be leveraged to build logical and intuitive AI systems.

#### Automated Reasoning and Symbolic AI

While AI can be used for many tasks, my project focuses on *automated reasoning*---using computers to solve logical problems.
These problems are unambiguous, in that a candidate solution for a problem can be verified in a mechanical way (what is "correct" is not up to someone's interpretation).
Unsurprisingly, traditional automated reasoning tasks have an explicit mathematical flavor; good examples are software verification and automated theorem proving.
However, many tasks that are not outwardly mathematical also have facets that are amenable to automated reasoning.
Consider the task of writing an argumentative essay: while some aspects of the task are outside the scope of automated reasoning (e.g., the tone of the exposition, which is hard to specify in logic), automated reasoning can ensure that the essay's argument is logically consistent.

Solving an automated reasoning problem typically involves *search*---exploring multiple paths that might lead to a solution.
At certain points in the reasoning process, the only way for the AI system to make progress is to make some working assumptions, which might have to be retracted later if those assumptions result in a dead end.
The ability of an automated reasoning tool to find a solution efficiently (or at all) often depends on the quality of the working assumptions it makes during search.

Traditionally, automated reasoning tools have been built using *symbolic AI*, where computation consists of systematically applying rules.
To make this more concrete, we can imagine that we have the following twelve rules:

1. Every mammal is mortal.
1. Every reptile is mortal.
1. Every bird is mortal.
1. Every horse is a mammal.
1. Every dog is a mammal.
1. Every person is a mammal.
1. Every snake is a reptile.
1. Every lizard is a reptile.
1. Every songbird is a bird.
1. Every raptor is a bird.
1. Every penguin is a bird.
1. Socrates is a person.

Given the task of proving "Socrates is mortal", a symbolic AI system would search for a proof of this proposition, using these rules to establish evidence.
The trace of the AI system might look something like this:

- I need to prove that Socrates is mortal.
- To do so, I need to select a rule that defines "mortal".
- I chose Rule #1: Every mammal is mortal. Now, I need to prove Socrates is a mammal.
- To do so, I need to select a rule that defines "mammal".
- I chose Rule #6: Every person is a mammal. Now, I need to prove that Socrates is a person.
- To do so, I need to select a rule that defines "person".
- I chose Rule #12: Socrates is a person. This establishes the fact we need.
- Search complete.

So, the system is able to prove that Socrates is mortal by combining Rules #1, #6, and #12.
As we can see here, symbolic AI has the advantage that it is trustworthy: we know that the reasoning process is logically correct, up to the correctness of the rules.

However, symbolic AI has two shortcomings that have limited its impact in practice.[^1]

First, it often fails to scale to automated reasoning problems with large search spaces, as it cannot use intuition to more efficiently guide its search for a solution.
In our example, a symbolic AI system might try to prove that Socrates is mortal by showing that he is a bird, leading to a dead end, and forcing the system to backtrack:

- I need to prove that Socrates is mortal.
- To do so, I need to select a rule that defines "mortal".
- I chose Rule #3: Every bird is mortal. Now, I need to prove Socrates is a bird.
- To do so, I need to select a rule that defines "bird".
- I chose Rule #11: Every penguin is a bird. Now, I need to prove that Socrates is a penguin.
- To do so, I need to select a rule that defines "penguin".
- Dead end: no rule defines penguin. Backtracking...
- I need to select another rule that defines "bird".
- I chose Rule #10: Every raptor is a bird. Now, I need to prove that Socrates is a raptor.
- ...

A human familiar with the history of Western philosophy would not fall into this trap: they would have prior knowledge that the historical Socrates was a person, not a bird (of any type), and so would be suspicious that Rule #3 would be useful for proving Socrates' mortality.
Unfortunately, in contrast, a symbolic AI system does not have the same intuition---after all, in the purely logical world of symbolic AI, terms like "person", "mortal", "penguin", and "Socrates" are just formal symbols with no connection to real-world phenomena.
That is, a symbolic AI system has no access to the external meanings of these terms, and thus the terms do not provide any information that can be used to guide search.

Second, symbolic AI is difficult to use, as pure logic is hard to understand (at least for most people, myself included), and symbolic AI tools are incapable of explaining their reasoning in an intuitive way.
Our Socrates example is small and simple enough that this problem does not manifest, but one could imagine that it becomes tricky for humans to follow the logic---and map it back to the real world---as systems grow to thousands of rules and proofs become commensurately more complex.

#### Neurosymbolic AI for Automated Reasoning

To address these limitations, researchers have become interested in building automated reasoning systems based on *neurosymbolic AI*---a hybrid paradigm where symbolic AI is combined with neural networks, such as large language models (LLMs).
Whereas symbolic AI makes logical inferences based on rules, neural networks make statistical inferences based on learned patterns; these learned patterns can simulate intuition.
Indeed, it often appears that an LLM is acting with some form of intuition when we ask it to solve a task.
On the other hand, neural networks like LLMs are not guaranteed to act logically (not even in "reasoning" modes), and thus neural networks and LLMs are untrustworthy.

The hope is that neurosymbolic AI will enable automated reasoning systems that use "intuition" while staying logically correct---that is, to combine the advantages of neural networks and symbolic AI.
How to actually combine symbolic AI and neural networks to achieve the full potential of this combination remains an open question.
Indeed, I believe that our current approach to structuring neurosymbolic AI systems limits the impact this exciting paradigm can have on automated reasoning---and, in turn, the potential benefits that automated reasoning can offer society.
Now is the time for foundational work in this area!

Currently, neurosymbolic automated reasoning systems are conceptualized as consisting of multiple components chained together *in sequence*, where some components are symbolic, and some are neural networks (typically an LLM).
This sequential linking of neural networks and symbolic components is essentially what happens in agentic frameworks, where an AI agent (the neural network) passes control to external tools (symbolic code) that run and then return control back to the agent.
A classic example is the guess-and-check loop, where the LLM plays the role of the "guesser", and the symbolic component plays the role of the "checker".
The LLM guesses a candidate solution to a problem; the symbolic component checks if it is actually a solution; if not, the symbolic component passes a counterexample to the LLM (demonstrating why the candidate is not a solution), and the LLM guesses again.
The idea is that, as the counterexamples accumulate, the guesser will be led to a solution.

{% include figure.liquid
   path="assets/img/sequential_loop.svg"
   caption="A guess-and-check loop in the sequential neurosymbolic architecture, where an implicit neural-symbolic boundary separates the world of intuition (left, blue) from the world of logic (right, orange)"
   alt="A clockwise loop with two component boxes: on the left, a blue 'Guesser (LLM)' box; on the right, an orange 'Symbolic checker' box. A vertical dashed line between them marks the neural-symbolic boundary. Along the top, the guess flows left to right, appearing first as a blue 'Neural guess' box and then, after crossing the boundary, as an orange 'Symbolic guess' box. Along the bottom, the counterexample flows right to left, appearing first as an orange 'Symbolic counterexample' box and then, after crossing the boundary, as a blue 'Neural counterexample' box."
   width="50%"
   class="mx-auto d-block" %}

There are two limitations that are fundamental to an architecture like this, where computation flows through neural networks and symbolic components *in sequence.*

First, the guesser, being purely neural, comes with no guarantees about its behavior.
In particular, there is no guarantee that it will produce candidate solutions that respect the counterexamples it has been given---meaning that, in principle, the LLM might guess the same wrong answers repeatedly, and the loop never makes progress.
Such guarantees are standard for symbolic algorithms, but very hard to establish even for small neural networks, let alone frontier language models.

Second, the checker, being purely symbolic, does not have any of the advantages of neural networks, which would allow it to operate with "intuition".
For one, it cannot ingest intuition for the candidate solution it receives.
This is a loss: if the checker had access to the intuition behind a guess, the checker could produce a counterexample that more effectively addresses why that intuition is incorrect.
Moreover, the checker cannot give any intuition when it produces a counterexample; such intuition might help the guesser better understand how the counterexample works, leading to a better subsequent guess.

These limitations are inherent in our current (slightly Frankenstein-esque) approach of bolting together symbolic components and neural networks in sequence.
My project asks how we can integrate symbolic components and neural networks in a deeper, principled way that will enable us to build more powerful neurosymbolic automated reasoning systems.

#### My Insight: Intuition and Logic Should Evolve in Parallel

In current conceptualizations, logical computation (through symbolic components) and computation over "intuition" (through neural networks) happen in sequence.
My insight is that, instead, these two types of computation should happen *in parallel.*
In this framing, every piece of data simultaneously has a logical facet and an intuitive facet: an automated reasoning problem, for instance, is both a formal logical object and something that represents a real-world situation.

During a parallel neurosymbolic computation, the logical and intuitive facets of the computation's state evolve in lockstep.
The logical part evolves through symbolic rules, guaranteeing the overall computation is trustworthy.
Each logical step is mirrored by a corresponding update to the intuition state, forming a running summary of the reasoning so far.
When search reaches a decision point, this accumulated intuition can be used to guide logical reasoning toward the most likely path.
The output is then a solution, determined by the symbolic rules, together with the intuition built up over the course of the computation.

{% include figure.liquid
   path="assets/img/parallel_nesy.svg"
   caption="The high-level structure of the parallel neurosymbolic architecture I propose; all data and computation simultaneously have both logical (orange) and intuitive (blue) facets, and computation happens over logic and intuition in parallel"
   alt="Three boxes in a left-to-right row connected by arrows, each split into an orange upper half (logical) and a blue lower half (intuitive). Left box: 'Logical problem' (orange) over 'Intuition for problem' (blue). Center box: 'Logical computation' (orange) over 'Computation over intuition' (blue). Right box: 'Logical solution' (orange) over 'Intuition for solution' (blue)."
   width="50%"
   class="mx-auto d-block" %}

Consider the guess-and-check architecture again.
In my framing, the guesser is no longer purely neural---it is now backed by symbolic computation.
This means that we can get guarantees about its behavior, such as that it always produces guesses that are consistent with the counterexamples it has received (and thus search makes progress).
Analogously, the checker is no longer purely symbolic---it is now enriched with a computation over intuition.
This means that the checker can now ingest intuition, use it to find more effective counterexamples, and attach intuition to those counterexamples.
This reframing leads to neurosymbolic systems that have better computational properties (since we can make stronger claims about their behavior), and that, I reckon, should be more powerful in practice, as intuition flows throughout the entire computation.

{% include figure.liquid
   path="assets/img/parallel_loop.svg"
   caption="A guess-and-check loop in the parallel neurosymbolic architecture; unlike the sequential architecture, every component is neurosymbolic (NeSy), and computation does not flow across a neural-symbolic boundary"
   alt="A clockwise loop with two component boxes, each split into an orange upper half (symbolic) and a blue lower half (neural): a 'NeSy guesser' on the left and a 'NeSy checker' on the right, with no boundary line between them. Along the top, the guess flows from guesser to checker as a single two-part box: 'Symbolic guess' on the orange upper half and 'Intuition for guess' on the blue lower half. Along the bottom, the counterexample flows back as a similarly split box: 'Symbolic counterexample' (orange, top) and 'Intuition for counterexample' (blue, bottom)."
   width="50%"
   class="mx-auto d-block" %}

Building on this core insight, my fellowship project has three aims:

1. To develop a theoretical model that captures the type of parallel neurosymbolic computations I have sketched here;
2. To implement a neurosymbolic programming language that reifies this theoretical model; and
3. To use the programming language to build cutting-edge, neurosymbolic automated reasoning systems.

In my [next post]({% post_url 2026-05-27-building-simple-nesy-reasoner %}), I will walk through how to build a simple reasoning system that performs parallel neurosymbolic computation, and foreshadow a general recipe for taking a symbolic algorithm and making it neurosymbolic.

#### Most Importantly: I'm Looking for Collaborators!

I'm particularly interested in collaborating with folks who believe that they have an automated reasoning problem that might be a good use case for parallel neurosymbolic reasoning, as well as experts in neural networks who would be interested in exploring whether parallel neurosymbolic components could be embedded within neural architectures.

**If this sounds interesting to you, please get in touch!**

<hr>

[^1]: There is a third shortcoming worth mentioning: where do the rules come from? I am going to ignore this for now, as there are plenty of automated reasoning tasks for which we already have rules (e.g., manually designed algorithms); however, perhaps I will address how to discover new rules in a future blog post on program synthesis.