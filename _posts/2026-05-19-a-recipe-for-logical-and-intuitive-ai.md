---
layout: post
title: a recipe for logical and intuitive AI 
date: 2026-05-20
description: XXX 
tags: neurosymbolic-ai automated-reasoning
categories: mckenzie 
---

In my previous post, I introduced and motivated my McKenzie Postdoctoral Fellowship, which is all about designing AI systems where logic and intuition evolve in parallel.
In this post, I will sketch out a general recipe for how to do this, starting with a simple example.
I will attempt to keep things from getting too technical, but I assume that the reader is familiar with Python.

#### the problem: fitting 3D data points 

Let's consider a relatively simple task.
We have two components: a guesser that guesses an arithmetic operator $\oplus$, and a checker that sees whether the equation $x \oplus y = z$ holds for all 3D data points in a dataset that is known to the checker, but not the guesser.

For simplicity, we'll assume that the guesser is guessing from the operators for addition, subtraction, multiplication, and division, and that the checker is fitting the guessed operator against this set of three 3D data points:

| x | y | z |
|-----|-----|-----|
| 2 | 2 | 4 |
| 3 | 1 | 3 |
| 2 | 4 | 8 |

The correct operator that fits this dataset is the operator for multiplication.

In this section, we will see how to create an AI system that uses parallel neurosymbolic reasoning to solve this problem.
While the example here is very simple, it is indicative of more complex problems.

#### the symbolic solver

To begin, let's define a purely symbolic solver for this problem.
To start, we can define the guesser, which guesses the operator:

```python
from typing import Literal, get_args

Operator = Literal["+", "-", "*", "/"] 

class Guesser:
    def __init__(self):
        self.options : set[Operator] = set(get_args(Operator))
    
    def guess(self):
        if not self.options:
            return None
        choice = oracle.choose_one(self.options) # to be defined
        self.options.remove(choice)
        return choice
```

While the guesser can be queried multiple times, it never guesses the same operator twice (the function `choose_and_remove` destructively updates the set it receives).
Given that the set of possible operators is finite, the guesser will (after four guesses) no longer provide any guess at all.

We can also define our checker, which checks an operator against the example data points:

```python
EXAMPLES = {(2, 2, 4), (3, 1, 3), (2, 4, 8)}

class Checker:
    def check(self, op: Operator):
        examples = set(EXAMPLES) 
        while examples:
            (x, y, z) = oracle.choose_one(examples) # to be defined
            examples.remove((x, y, z))
            if not eval(f"{x} {op} {y} == {z}"):
                return False
        return True
```

The checker has a few properties worth noting.
First, it never checks any example more than once, and thus it always terminates.
If it returns true, then the operator fits all examples; if it returns false, then the operator has failed on an example.

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

Right now, we will be vague about the definition of `choose_one`, which non-deterministically chooses an element of the set if receives.
If you want to concretely run this code, you could instantiate it as `random.choice(list(xs))`.

Given what we know about the guesser and the checker, we have some strong guarantees about our guess-and-check loop:

- it always terminates
- if it returns an operator, then that operator genuinely fits all examples
- if it returns the string "FAIL", then none of the available operators fits all examples

On the other hand, there are some obvious limitations here, the main one being that the guesser receives only very coarse-grained feedback from the checker: whether the current guess is correct or not.
No information is passed to it about, say, which example has actually failed.

#### the parallel neurosymbolic solver

We will now lift the symbolic solver into a parallel neurosymbolic solver.
The basic idea is that we'll imagine that there is some "intuition" state that is updated as symbolic computation proceeds.
For every action taken by the symbolic system, we'll define an update to the intuition state.
To keep things simple and make this concrete, we'll treat the intuition state as a being a list of strings, which we'll append to with updates.

```python
class Intuition:
    def __init__(self, initial: str):
        self.log: list[str] = [initial]

    def __call__(self, intuition: str):
        self.log.append(intuition)


INTUITION = Intuition(
    "The task: find an operator ⊕ so that all (x, y, z) points in the dataset fit x ⊕ y == z."
)
```

Let's update the guesser:

```python
class Guesser:
    def __init__(self):
        self.options : set[Operator] = set(get_args(Operator))
    
    def guess(self):
        if not self.options:
            INTUITION("No operators left to guess.")
            return None
        query = f"Choose an operator from {self.options}."
        choice, reason = oracle.choose_one(
            self.options, query=query, context=INTUITION
        )
        INTUITION("Chose {x} because {reason}.")
        self.options.remove(choice)
        return choice
```

Let's update the checker:

```python
class Checker:
    def check(self, op: Operator):
        examples = set(EXAMPLES) 
        while examples:
            query = f"Choose an (x, y, z) point from {examples} to test {op} on."
            (x, y, z), reason = oracle.choose_one(
                examples, query=query, context=INTUITION
            )
            INTUITON(f"Chose ({x}, {y}, {z}) because {reason}.")
            examples.remove((x, y, z))
            if not eval(f"{x} {op} {y} == {z}"):
                INTUITION("Example failed: {x} {op} {y} != {z}.")
                return False
            INTUITION("Example passed: {x} {op} {y} == {z}.")
        INTUITION("All examples passed.")
        return True
```

- Explain new `choose_one` interface
- Give an example trace
- Make argument that now guessing gets context (especially powerful for getting actual example failures)
- But symbolic structure is still there: have guarantees about behavior

#### A General Recipe

(Argument: this is a recipe for turning much more complex symbolic algorithms into neurosymbolic)

In a future blog post, I will make this more precise