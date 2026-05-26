---
layout: post
title: Building a Simple Parallel Neurosymbolic Reasoner 
date: 2026-05-20
description: A concrete example of the parallel neurosymbolic architecture 
tags: neurosymbolic-ai automated-reasoning
categories: research 
---

In my previous post, I introduced and motivated my McKenzie Postdoctoral Fellowship, which is all about designing AI systems where logic and intuition evolve in parallel.
I know that this is a little abstract, and so in this blog post I will make things more concrete by walking through an example of building a simple parallel neurosymoblic reasoner.

As a reminder of the parallel neurosymbolic architecture, we will essentially be trying to create a system that looks like this:

{% include figure.liquid
   path="assets/img/parallel_nesy.svg"
   caption="The high-level structure of the parallel neurosymbolic architecture I propose; all data and computation simultaneously have both logical (orange) and intuitive (blue) facets, and computation happens over logic and intuition in parallel"
   alt="Three boxes in a left-to-right row connected by arrows, each split into an orange upper half (logical) and a blue lower half (intuitive). Left box: 'Logical problem' (orange) over 'Intuition for problem' (blue). Center box: 'Logical computation' (orange) over 'Computation over intuition' (blue). Right box: 'Logical solution' (orange) over 'Intuition for solution' (blue)."
   width="50%"
   class="mx-auto d-block" %}

The approach we'll take is largely mechanical.
First, we'll define a symbolic solver for the particular problem we're targeting.
Then, we'll define a domain of "intuition" and the initial intuition for the problem, update the symbolic solver to produce intuition every time it takes a logical step, and use intuition when it has to make a decision.

At the end of this post, I'll foreshadow how the technique used in this example is a general recipe for building parallel neurosymbolic reasoning systems.

#### An Example Problem: Fitting 3D Data Points 

Let's consider a simple task involving two components: a guesser guesses an arithmetic operator $\oplus$, and a checker checks whether the equation $x \oplus y = z$ holds for all 3D data points in a dataset that is known to the checker, but not the guesser.

For simplicity, we'll assume that the guesser is guessing from these operators: $+,-,\times,/$ (addition, subtraction, multiplication, and division).
Assume the checker is fitting the guessed operator against this set of three 3D data points:

| x | y | z |
|-----|-----|-----|
| 2 | 2 | 4 |
| 3 | 1 | 3 |
| 2 | 4 | 8 |

<br>
The correct operator that fits this dataset is $\times$ (multiplication).

In this section, we will see how to create an AI system that uses parallel neurosymbolic reasoning to solve this problem.
While the example is very simple, it is indicative of more complex problems (such as guessing program invariants that fit execution traces).

#### The Symbolic Solver

To begin, let's define a purely symbolic solver for this problem.
Later, we'll enrich this symbolic solver to be a neurosymbolic one.

The symbolic solver is structured as a guess-and-check loop involving two main components---the guesser and the checker---that call out to an "oracle" for making decisions.

##### The Oracle

The code assumes an `oracle` module that has functions for choosing elements from sets.
For now, we will use a function that returns a random choice (we will use a more sophisticated function in the neurosymbolic solver):

```python
# oracle module
import random

def choose_one_randomly(xs: set) -> Any:
    return random.choice(list(xs))
```

##### The Guesser

We can now define the guesser, which guesses the operator:

```python
from typing import Literal, get_args
import oracle

Operator = Literal["+", "-", "*", "/"] 


class Guesser:
    def __init__(self):
        self.options : set[Operator] = set(get_args(Operator))
    
    def guess(self) -> Operator:
        if not self.options:
            return None
        choice = oracle.choose_one_randomly(self.options)
        self.options.remove(choice)
        return choice
```

While the guesser can be queried multiple times, it never guesses the same operator twice.
Given that the set of possible operators is finite, the guesser will no longer provide any guess at all after it has tried each operator once.

##### The Checker

We can also define our checker, which checks an operator against the required data points:

```python
POINTS = {(2, 2, 4), (3, 1, 3), (2, 4, 8)}


class Checker:
    def check(self, op: Operator) -> bool:
        xyzs = set(POINTS) 
        while xyzs:
            (x, y, z) = oracle.choose_one_randomly(xyzs)
            xyzs.remove((x, y, z))
            if not eval(f"{x} {op} {y} == {z}"):
                return False
        return True
```

The checker has a few properties worth noting.
It never checks any example more than once (per invocation), and thus always terminates.
If it returns true, then the operator fits all points; if it returns false, then the operator has failed on a point.
Moreover, the checker tries the data points in a non-deterministic order (thanks to the call to `oracle.choose_one`).

##### The Guess-and-Check Loop

Finally, we can define our guess-and-check loop:

```python
def guess_and_check_loop() -> Operator | Literal["FAIL"]:
    G = Guesser()
    C = Checker()
    while True:
        guess = G.guess()
        if guess is None:
            return "FAIL"
        if C.check(guess):
            return guess
```

Given what we know about the guesser and the checker, we have some strong guarantees about our guess-and-check loop:

- It always terminates;
- if it returns an operator, then that operator genuinely fits all points; and
- if it returns the string "FAIL", then none of the available operators fits all points.

On the other hand, there are some obvious limitations here, the main one being that the guesser receives only very coarse-grained feedback from the checker: whether the current guess is correct or not.
No information is passed to it about, say, which point has actually failed.

#### The Parallel Neurosymbolic Solver

We will now lift the symbolic solver into a parallel neurosymbolic solver.
The basic idea is that we'll imagine that there is some "intuition" state that is updated as symbolic computation proceeds.
For every action taken by the symbolic system, we'll define an update to the intuition state; when we reach a decision point, we'll query the intuition state for context.

##### Defining Intuition

First, we need to define "intuition".
To keep things simple, we'll define the intuition state as a list of strings, which we'll update by appending.
However, intuition could also be a more complex structure that is updated in more sophisticated ways.

```python
class Intuition:
    def __init__(self, initial: str):
        self.log: list[str] = [initial]

    def __call__(self, intuition: str):
        self.log.append(intuition)
    
    def __str__(self):
        return "\n".join(self.log)
```

For now, we'll assume that the initial intuition is just a description of the problem:

```python
INTUITION = Intuition(
"""The task: find an operator ⊕ so that all (x, y, z) points in the dataset fit x ⊕ y == z.
There are two components that interact in a guess-and-check loop:
- a guesser that guesses the operator (and does not know the points in the dataset)
- a checker that checks the operator against the points (in an order of its choosing).
Trace:"""
)
```

However, the initial intuition could also include richer information.
For example, if the goal were to find an invariant over variables `x`, `y`, and `z` for a particular loop from a program, the initial intuition might look more like this:

```python
INTUITION = Intuition(
"""The task: find an operator ⊕ so that all (x, y, z) points in the dataset fit x ⊕ y == z.

The points are extracted from execution traces of a program.
In particular, they are the values for the variables x, y, z on entry to this loop:

    int x, y, z;
    ...
    while (...) {
        ...
    }

..."""
)
```

##### Making the Solver Neurosymbolic

Now that we've defined intuition and the initial intuition state, we can update the solver components to produce and use intuition.
We'll start with the guesser:

```python
class Guesser:
    def __init__(self):
        self.options : set[Operator] = set(get_args(Operator))
    
    def guess(self) -> Operator:
        INTUITION("Now in guessing mode.")
        if not self.options:
            INTUITION("No operators left to guess.")
            return None
        query = f"Choose an operator from {self.options}."
        choice, reason = oracle.choose_one_using_context(
            self.options, query=query, context=str(INTUITION)
        )
        INTUITION("Guesser chose '{choice}' because {reason}.")
        self.options.remove(choice)
        return choice
```

A few things to note.
First, intuition is updated to reflect that the overall system is in guessing mode, and then that either 1) all operators have already been guessed or 2) the guesser has chosen an operator for some particular reason.
Second, the oracle now makes a decision with respect to a particular query and context.
This could be implemented many ways, but for the sake of concreteness, we can imagine that the oracle makes its choice using an LLM:

```python
# oracle module

def choose_one_using_context(xs: set, query: str, context: str) -> Any * str:
    prompt = f"Context:\n{context}\n\nQuery:\n{query}\n\n"
    prompt += "Respond with your answer in <solution> tags and your reason in <reason> tags."
    response = query_llm(prompt)
    # Assume this falls back to guessing randomly if parsing fails
    guess, reason = parse_response(response, xs)
    return guess, reason
```

We can similarly update the checker to produce intuition for every step it takes, as well as to provide the oracle with context:

```python
class Checker:
    def check(self, op: Operator) -> bool:
        INTUITION("Now in checking mode.")
        xyzs = set(POINTS) 
        while xyzs:
            query = f"Choose an (x, y, z) point from {xyzs} to test {op} on."
            (x, y, z), reason = oracle.choose_one_using_context(
                xyzs, query=query, context=str(INTUITION)
            )
            INTUITON(f"Checker chose ({x}, {y}, {z}) because {reason}.")
            xyzs.remove((x, y, z))
            if not eval(f"{x} {op} {y} == {z}"):
                INTUITION(f"Point failed: {x} {op} {y} != {z}.")
                return False
            INTUITION(f"Point passed: {x} {op} {y} == {z}.")
        INTUITION("All points passed.")
        return True
```

##### Running the Solver

When we run the solver, we now produce intuition with every logical step taken by the guesser and checker.
By the end of running our guess-and-check loop, we will have accumulated intuition like this:

```
The task: find an operator ⊕ so that all (x, y, z) points in the dataset fit x ⊕ y == z.
There are two components that interact in a guess-and-check loop:
- a guesser that guesses the operator (and does not know the points in the dataset)
- a checker that checks the operator against the points (in an order of its choosing).
Trace:
Now in guessing mode.
Guesser chose '+' because it is a common operator.
Now in checking mode.
Checker chose (2, 4, 8) because it is the most informative point.
Point failed: 2 + 4 != 8.
Now in guessing mode.
Guesser chose '*' because 2 * 4 == 8.
Now in checking mode.
Checker chose (2, 4, 8) because it failed last time.
Point passed: 2 * 4 == 8.
Checker chose (3, 1, 3) because of no particular reason.
Point passed: 3 * 1 == 3.
Checker chose (2, 2, 4) because it is the final point.
Point passed: 2 * 2 == 4.
All points passed.
```

Moreover, when the oracle has to make a decision, it has access to the intuition accumulated to that point.
For example, the second time the oracle guesses an operator, the LLM will receive a prompt like this:

```
Context:
The task: find an operator ⊕ so that all (x, y, z) points in the dataset fit x ⊕ y == z.
There are two components that interact in a guess-and-check loop:
- a guesser that guesses the operator (and does not know the points in the dataset)
- a checker that checks the operator against the points (in an order of its choosing).
Trace:
Now in guessing mode.
Guesser chose '+' because it is a common operator.
Now in checking mode.
Checker chose (2, 4, 8) because it is the most informative point.
Point failed: 2 + 4 != 8.
Now in guessing mode.

Query:
Choose an operator from {-, *, /}.

Respond with your answer in <solution> tags and your reason in <reason> tags.
```

Given the counterexample point (2, 4, 8), the LLM will (hopefully) guess the operator $\times$, as multiplication is the one operator that fits the equation $2 \oplus 4 = 8$.
Note that the counterexample point exists only in the intuition state; symbolically speaking, the checker still returns only a boolean result.
Indeed, the underlying symbolic structure of the guess-and-check loop has not changed at all.
This is key, as it means that we still retain the guarantees of the symbolic solver (such as termination).

In short, the guesser and checker are now both neurosymbolic: we have the same symbolic skeleton as the original symbolic solver, but each symbolic step now produces intuition for that step---which is incorporated into the running intuition state---and the oracle now uses that running intuition to make decisions.
We have successfully created a guess-and-check loop where logical state and intuition evolve in parallel!

#### A General Recipe for Parallel Neurosymbolic Reasoning

I hope that you have come away with the impression that there is nothing particularly exotic about parallel neurosymbolic reasoning.
Indeed, going from the symbolic solver to the neurosymbolic solver was a largely mechanical process:

- We define a domain of intuition and initial intuition for our problem;
- we instrument every step the symbolic solver takes to also produce intuition that is added to a running intuition state; and
- when we make decisions (e.g., via the oracle), we use that running intuition.

The cool thing is that these three steps are in fact the basis of a general recipe for building parallel neurosymbolic systems out of purely symbolic systems.
That is, if you give me a symbolic algorithm, we can perform these steps to turn it into a neurosymbolic algorithm where logic and intuition evolve in parallel.
This neurosymbolic algorithm retains the formal guarantees of the symbolic system, while producing intuition and using intuition to make decisions.
Neat, right?

I've begun to formalize this recipe through the abstraction of *Neurosymbolic Transition Systems*, which I proposed in a [paper](https://arxiv.org/abs/2507.05886) that I presented at the 2025 International Workshop on Language Models and Programming Languages.
I'll dig deeper into Neurosymbolic Transition Systems in a future post.
I'm quite excited about this formalism, as I believe that it can be the foundation not only of individual automated reasoning tools, but also of *entire neurosymbolic programming languages.*