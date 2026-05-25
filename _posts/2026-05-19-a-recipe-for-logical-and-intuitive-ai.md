---
layout: post
title: A Recipe for Logical and Intuitive AI 
date: 2026-05-20
description: Introducing the Neurosymbolic Transition System (NSTS) framework
tags: neurosymbolic-ai automated-reasoning
categories: mckenzie 
---

In my previous post, I introduced and motivated my McKenzie Postdoctoral Fellowship, which is all about designing AI systems where logic and intuition evolve in parallel.
In this post, I will sketch out a general recipe for how to do this, starting with a simple example.
I will attempt to keep things from getting too technical, but I assume that the reader is familiar with Python.

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
We first define the guesser, which guesses the operator:

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
        choice = oracle.choose_one(self.options) # to be defined
        self.options.remove(choice)
        return choice
```

This code assumes an `oracle` module with a function `guess_one` that chooses one member of a set.
We will discuss this function further in the neurosymbolic solver, but for now, you can imagine that this is implemented as random choice.

While the guesser can be queried multiple times, it never guesses the same operator twice.
Given that the set of possible operators is finite, the guesser will no longer provide any guess at all after it has tried each operator once.


We can also define our checker, which checks an operator against the required data points:

```python
POINTS = {(2, 2, 4), (3, 1, 3), (2, 4, 8)}


class Checker:
    def check(self, op: Operator) -> bool:
        xyzs = set(POINTS) 
        while xyzs:
            (x, y, z) = oracle.choose_one(xyzs) # to be defined
            xyzs.remove((x, y, z))
            if not eval(f"{x} {op} {y} == {z}"):
                return False
        return True
```

The checker has a few properties worth noting.
It never checks any example more than once (per invocation), and thus always terminates.
If it returns true, then the operator fits all points; if it returns false, then the operator has failed on a point.
Moreover, the checker tries the data points in a non-deterministic order (thanks to the call to `oracle.choose_one`).

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
For every action taken by the symbolic system, we'll define an update to the intuition state.
To keep things simple and make this concrete, in this example we'll define the intuition state as a list of strings, which we'll update by appending.
However, intuition could also be a more complex structure that is updated in more sophisticated ways.

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

Let's update the guesser to produce and use intuition:

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
        choice, reason = oracle.choose_one(
            self.options, query=query, context=INTUITION
        )
        INTUITION("Oracle chose '{choice}' because {reason}.")
        self.options.remove(choice)
        return choice
```

XXX

Let's update the checker:

```python
class Checker:
    def check(self, op: Operator) -> bool:
        INTUITION("Now in checking mode.")
        xyzs = set(POINTS) 
        while xyzs:
            query = f"Choose an (x, y, z) point from {xyzs} to test {op} on."
            (x, y, z), reason = oracle.choose_one(
                xyzs, query=query, context=INTUITION
            )
            INTUITON(f"Oracle chose ({x}, {y}, {z}) because {reason}.")
            xyzs.remove((x, y, z))
            if not eval(f"{x} {op} {y} == {z}"):
                INTUITION(f"Point failed: {x} {op} {y} != {z}.")
                return False
            INTUITION(f"Point passed: {x} {op} {y} == {z}.")
        INTUITION("All points passed.")
        return True
```

We might get a trace like this:

```
The task: find an operator ⊕ so that all (x, y, z) points in the dataset fit x ⊕ y == z.
Now in guessing mode.
Oracle chose '+' because it is a common operator.
Now in checking mode.
Oracle chose (2, 4, 8) because it is the most discriminatory example.
Point failed: 2 + 4 != 8.
Now in guessing mode.
Oracle chose '*' because 2 * 4 == 8.
Now in checking mode.
Oracle chose (2, 4, 8) because it failed last time.
Point passed: 2 * 4 == 8.
Oracle chose (3, 1, 3) because of no particular reason.
Point passed: 3 * 1 == 3.
Oracle chose (2, 2, 4) because it is the last example.
Point passed: 2 * 2 == 4.
All points passed.
```

- Explain new `choose_one` interface
- Give an example trace; where intuition helps (both choosing a discriminatory example, and passing counterexample information)
- Make argument that now guessing gets context (especially powerful for getting actual example failures)
- But symbolic structure is still there: have guarantees about behavior
- Diagram of NeSy guess-and-check loop

#### A General Recipe

(Argument: this is a recipe for turning much more complex symbolic algorithms into neurosymbolic)

- Give NSTS definition
- Say why it is a good basis for programming languages
- Vision: you write normal program, lifted to neurosymbolic program
- Point to arXiv paper