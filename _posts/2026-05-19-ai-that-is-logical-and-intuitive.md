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
Unfortunately, in contrast, a symbolic AI system is just as likely to explore the wrong path as the right one---after all, in the purely logical world of symbolic AI, terms like "person", "mortal", "horse", and "Socrates" are just formal symbols with no connection to real-world phenomena.
That is, a symbolic AI system has no access to the external meanings of these terms, and thus the terms do not provide any information that can be used to guide search.

Second, symbolic AI is difficult to use, as pure logic is hard to understand (at least for most people, myself included), and symbolic AI tools are incapable of explaining their reasoning in an intuitive way.
Our Socrates example is small and simple enough that this problem does not manifest, but one could imagine that it becomes tricky for humans to follow the logic---and map it back to the real world---as systems grow to thousands of rules and proofs become commensurately more complex.

#### Neurosymbolic AI for automated reasoning

To address these limitations, researchers have become interested in building automated reasoning systems based on *neurosymbolic AI*---a hybrid paradigm where symbolic AI is combined with neural networks, such as large language models (LLMs).
Whereas symbolic AI makes logical inferences based on rules, neural networks make statistical inferences based on learned patterns; these learned patterns can simulate intuition.
Indeed, it often appears that an LLM is acting with some form of intuition when we ask it to solve a task.
On the other hand, neural networks like LLMs are not guaranteed to act logically (not even in "reasoning" modes), and thus neural networks and LLMs are untrustworthy.

The hope is that neurosymbolic AI will enable automated reasoning systems that use "intuition" while staying logically correct---that is, that combine the advantages of neural networks and symbolic AI.
It is an open question about how to actually combine symbolic AI and neural networks to achieve the full potential of this combination.
Indeed, I believe that our current approach to structuring neurosymbolic AI systems is limiting the impact this exciting paradigm can have on automated reasoning.

Currently, neurosymbolic automated reasoning systems are conceptualized as consisting of multiple components chained together *in sequence*, where some components are symbolic, and some are neural networks (typically an LLM).[^2]
A classic example is the guess-and-check loop, where the LLM plays the role of the "guesser", and the symbolic component plays the role of the "checker".
The LLM guesses a candidate solution to a problem; the symbolic component checks if it is actually a solution; if not, the symbolic component passes a counterexample to the LLM (demonstrating why the candidate is not a solution), and the LLM guesses again.
The idea is that, as the counterexamples accumulate, the guesser will be led to a solution.

{% include figure.liquid
   path="assets/img/sequential_loop.svg"
   caption="A guess-and-check loop in the sequential neurosymbolic architecture, where an implicit neural-symbolic boundary separates the world of intuition (left, blue) from the world of logic (right, orange)"
   alt="A clockwise loop with two component boxes: on the left, a blue 'Guesser (LLM)' box; on the right, an orange 'Symbolic checker' box. A vertical dashed line between them marks the neural-symbolic boundary. Along the top, the guess flows left to right, appearing first as a blue 'Neural guess' box and then, after crossing the boundary, as an orange 'Symbolic guess' box. Along the bottom, the counterexample flows right to left, appearing first as an orange 'Symbolic counterexample' box and then, after crossing the boundary, as a blue 'Neural counterexample' box."
   width="50%"
   class="mx-auto d-block" %}

There are two limitations that are fundamental to an architecture like this, where computation flows through neural networks and symbolic components in sequence.

First, the guesser, being purely neural, does not have any of the advantages of symbolic AI.
An advantage of symbolic AI is that it is trustworthy: we can have definite guarantees about its behavior.
Here, we have no guarantees about the behavior of the guesser: we cannot be sure that it will produce candidate solutions that respect the counterexamples it has been given, and thus that it will actually make progress in searching the solution space.
These types of guarantees are standard for symbolic algorithms, but very hard to establish even for small neural networks, let alone frontier language models.
In principle, the LLM might guess the same wrong answers repeatedly, meaning that the guess-and-check loop never makes progress.

Second, the checker, being purely symbolic, does not have any of the advantages of neural networks, which would allow it to operate with "intuition". 
For one, it cannot ingest intuition for the candidate solution it receives.
This is a loss: if the checker had access to the intuition behind a guess, the checker could produce a counterexample that more effectively addresses why that intuition is incorrect. 
Moreover, the checker cannot give any intuition when it produces a counterexample; such intuition might help the guesser better understand how the counterexample works, leading to a better subsequent guess.

These limitations are inherent in our current (slightly Frankenstein-esque) approach of bolting together symbolic components and neural networks in sequence.
My project asks how we can integrate symbolic components and neural networks in a deeper, principled way that will enable us to build more powerful neurosymbolic automated reasoning systems.

#### My insight: intuition and logic should evolve in parallel

In current conceptualizations, logical computation (through symbolic components) and computation over "intuition" (through neural networks) happen in sequence.
My insight is that, instead, logical computation and computation over intuition should happen *in parallel*.
In this framing, the input to a neurosymbolic computation is logical data (the problem to be solved) equipped with intuition about that data (e.g., what that problem represents in the real world).
During the neurosymbolic computation, the logical and intuitive facets of the computation's state evolve in parallel: the logical part evolves through symbolic rules (guaranteeing the overall computation is trustworthy), while each logical step is mirrored by a corresponding transformation over intuition.
When search reaches a decision point, the accumulated intuition can be used to guide logical reasoning toward the most likely path.
The output of the neurosymbolic computation is then logical data (the solution to the problem, as determined by the symbolic rules) equipped with intuition about that data (the intuition accumulated during computation).

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

In my next post, I will describe an example system built on parallel neurosymbolic computation.
In later posts, I will show how this example is one instance of a general technique for taking a symbolic algorithm and making it neurosymbolic.

**I am looking for collaborators, so if this work interests you, please get in touch!**

<hr>

#### Coda: will this matter as LLMs and agents get more powerful? 

A reasonable concern is whether all of this will actually matter as LLMs and agents get more powerful.
I strongly believe it will (unsurprisingly, as otherwise I wouldn't be working on it ☺️).

At a foundational level, my project is about how to make rule-based algorithms "better" by enriching them with intuition.
Accordingly, my argument starts with the point that rule-based algorithms will remain important even as learned models become larger and more sophisticated.
The reason is not so much that algorithms are the traditional way of structuring computation; rather, my reason is that algorithms are the necessary basis for genuine mastery of certain tasks.
If you asked me if I can do addition, I would answer in the affirmative: give me any two numbers, and I can add them up for you (provided my lifetime is enough to do so).
The reason I can say this is not because I've done some additions in the past, and so I reckon I'll be pretty good at doing addition in the future---rather, I can be confident in my ability because I know the algorithm for performing addition (i.e., grade-school column addition), and this algorithm generalizes to any two numbers.
In the same way, when we say that an AI system can perform addition, what we really mean (or should mean) is that it can perform an algorithm for addition.
To me, it would be a pretty shoddy definition of superintelligence if the definition did not include the ability to reliably perform algorithms.

I would go further, and suggest that we should expect AI to reliably perform algorithms *while using intuition*.
After all, this is what humans do: if you gave me a complex mathematical expression and asked me to simplify it, I would not only work algorithmically---by systematically applying simplification rules (such as mathematical identities)---but do so while using intuition to choose where in the expression to apply a simplification, and which simplification rule to use.
Moreover, my intuition for the problem would evolve through the course of solving it; for example, if I discover that some sequence of simplifications is successful in one part of the problem, I might try those simplifications again when I run across a similar subproblem.
This is exactly the type of logical-intuitive reasoning supported by the parallel neurosymbolic architecture I propose.
Indeed, I'll go out on a limb and say that parallel neurosymbolic computation should be the foundation for how future frontier models reason.

The need for parallel neurosymbolic computation is just as present in agentic systems.
Instead of performing an algorithm directly (through neural network inference), an agent can discharge algorithmic processing to an external tool; for example, an agent might use a Python interpreter to add two numbers together. 
While this is a reasonable approach to handling an algorithm like addition, it is *not* currently a satisfactory approach when it comes to automated reasoning.
The reason is that, unlike addition, the typical automated reasoning task involves a search that would genuinely benefit from the intuition of neural networks (as I argued earlier in this post).
But, if an agent just invokes an external automated reasoning tool built on symbolic AI, there is no way for the agent's intuition to flow through that computation.
Thus, the agentic system is faced with the same pain points that users of symbolic AI have always encountered: search cannot scale to larger problems, and there is no intuitive view into the reasoning process.
Luckily, the parallel neurosymbolic architecture I propose offers a solution: if the external automated reasoning tool were built following my architecture, the agent's intuition could flow into the reasoning process, and updated intuition would flow back into the agent with the solution.
This would more deeply integrate the agent with the external tools it invokes.

<hr>

[^1]: There is a third shortcoming worth mentioning: where do the rules come from? I am going to ignore this for now, as there are plenty of automated reasoning tasks for which we already have rules (e.g., manually designed algorithms); however, perhaps I will address this point in a future blog post on program synthesis.
[^2]: I'll note too that this sequential linking of neural networks and symbolic components is essentially what happens in agentic frameworks, where an AI agent (the neural network) calls out to external tools (symbolic code).
