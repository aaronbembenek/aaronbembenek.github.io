---
layout: post
title: A Recipe for Building Logical and Intuitive AI 
date: 2026-05-27
description: Introducing the Neurosymbolic Transition System framework 
tags: neurosymbolic-ai automated-reasoning
categories: research 
---

In my two previous posts, I argued for the [parallel neurosymbolic architecture]({% post_url 2026-05-27-ai-that-is-logical-and-intuitive %})---a conceptual model in which logic and intuition evolve in parallel---and I walked through an example of [building a simple neurosymbolic reasoner]({% post_url 2026-05-27-building-simple-nesy-reasoner %}) in this architecture.

In this post, I'll give a general recipe for taking a logical system and turning it into a parallel neurosymbolic system.
The recipe is captured in a formalism I've designed called the Neurosymbolic Transition System (NSTS).
I'll introduce this formalism, describe why I am excited about it, and show how the simple neurosymbolic reasoner from my prior post can be encoded as an NSTS.

#### Neurosymbolic Transition Systems

At its heart, the NSTS framework is a methodology for taking a logical transition system, and imbuing it with intuition that develops through logical reasoning, and which can be used to make choices at decision points.
Thus, the starting point for the NSTS framework is the logical transition system.
A transition system is a classic way to represent computation, with some notable examples from the world of programming languages being small-step operational semantics and abstract machines.

Formally, a transition system consists of:

- states $S : \mathrm{Set}$;
- allowable actions for each state $A : S \to \mathrm{Set}$; and
- a function $step : (s: S) \times A(s) \to \mathcal{P}(S)$ that returns the set of states reachable by taking an allowable action from some state $s$.
If the notation in the type signature is unfamiliar, the $(s: S)$ part is saying that the first argument is a state named $s$, and the $A(s)$ part is restricting the second argument to be an action allowed for state $s$.

We can define a small-step semantics for the transition system, where configurations are just symbolic states:

$$
\inferrule{a \in A(s) \qquad s' \in step(s, a)}{\langle s \rangle \longrightarrow \langle s' \rangle}
$$

The system can transition from the state $s$ to the state $s'$ if there is an allowable action to do so.

To lift this logical transition system into a neurosymbolic transition system, we need the following things:

- domains of intuition $I, J, \Delta$ (we have three types of intuition as they are used three different ways);
- an operator for updating intuition, $update: I \times \Delta \to I$;
- an operator that, given a state and running intuition, returns an allowable action and rationale for that action, $infer : (S: s) \times I \to A(s) \times J$;
- a labeling function $\lambda : T \times J \to \Delta$ where $T = \\{ (s, a, s') \mid s \in S, a \in A(s), s' \in step(s, a) \\}$; this function takes a transition, and a rationale for that transition being taken, and returns intuition for the transition.

We can then define a semantics for the NSTS:

$$
\inferrule{
    infer(s, i) = \langle a, j \rangle \\
    s' \in step(s, a) \\
    \lambda(s, a, s', j) = \delta \\
    i' = update(i, \delta)
}{
    \langle s, i \rangle \Longrightarrow \langle s', i' \rangle}
$$