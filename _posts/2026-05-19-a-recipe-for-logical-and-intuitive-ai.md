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
Say we have a set of three 3D data points:

| x | y | z |
|-----|-----|-----|
| 2 | 2 | 4 |
| 3 | 1 | 3 |
| 2 | 4 | 8 |

Our goal is to choose an operator $\oplus$ such that $x \oplus y = z$ for all data points, where the operator $\oplus$ can be addition, subtraction, multiplication, or division.

In this section, we will see how to create an AI system that uses parallel neurosymbolic reasoning to solve this problem.
While the example here is very simple, it is indicative of more complex problems.

#### the sequential neurosymbolic solver 

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
        choice = choose_and_remove(self.options)
        return choice
```

While the guesser can be queried multiple times, it never guesses the same operator twice (the function `choose_and_remove` destructively updates the set it receives).
Given that the set of possible operators is finite, the guesser will (after four guesses) no longer provide any guess at all.

We can also define our checker, which checks an operator against the example data points:

```python
EXAMPLES = {(2, 2, 4), (3, 1, 3), (2, 4, 8)}

class Checker:
    def check(self, op: Operator):
        examples_left = set(EXAMPLES) 
        while examples_left:
            x, y, z = choose_and_remove(examples_left)
            if not eval(f"{x} {op} {y} == {z}"):
                return False
        return True
```

The checker has a few properties worth noting.
First, it never checks any example more than once, and thus it always terminates.
If it returns true, then the operator fits all examples; if it returns false, then the operator has failed on an example.

Finally, we can define our guess-and-check loop (along with the helper function `choose_and_remove`):

```python

def choose_and_remove(xs: set):
    x = choose_one(xs) # to be defined
    xs.remove(x)
    return x

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

#### the parallel neurosymbolic solver