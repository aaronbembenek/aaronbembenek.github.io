---
layout: post
title: why neurosymbolic reasoning will still matter as models improve 
date: 2050-01-01
description: XXX 
tags: neurosymbolic-ai automated-reasoning
categories: research 
---

(Probably can make this more nuanced: unclear, in a way, whether logical reasoning is necessary for AI systems that are useful to society, or just an approximation of logical reasoning is good enough. Maybe depends on what the threshold for trustworthiness is)

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
While this is a reasonable approach to handling an algorithm like addition, it is *not currently* a satisfactory approach when it comes to automated reasoning.
The reason is that, unlike addition, the typical automated reasoning task involves a search that would genuinely benefit from the intuition of neural networks (as I argued earlier in this post).
But, if an agent just invokes an external automated reasoning tool built on symbolic AI, there is no way for the agent's intuition to flow through that computation.
Thus, the agentic system is faced with the same pain points that users of symbolic AI have always encountered: search cannot scale to larger problems, and there is no intuitive view into the reasoning process.
Luckily, the parallel neurosymbolic architecture I propose offers a solution: if the external automated reasoning tool were built following my architecture, the agent's intuition could flow into the reasoning process, and updated intuition would flow back into the agent with the solution.
This would more deeply integrate the agent with the external tools it invokes.

<hr>

[^1]: There is a third shortcoming worth mentioning: where do the rules come from? I am going to ignore this for now, as there are plenty of automated reasoning tasks for which we already have rules (e.g., manually designed algorithms); however, perhaps I will address this point in a future blog post on program synthesis.
[^2]: I'll note too that this sequential linking of neural networks and symbolic components is essentially what happens in agentic frameworks, where an AI agent (the neural network) calls out to external tools (symbolic code).
