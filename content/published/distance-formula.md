---
title: Distance Formula
---

# Distance Formula

The distance formula is a direct application of the [[Pythagorean Theorem]].


![Description of the image](https://i.pinimg.com/736x/70/56/09/705609443c4518f3207c944317d410dc.jpg)

## Formula $\Tuple{a,b,c}$

The distance between two points $(x_1, y_1)$ and $(x_2, y_2)$ in a Cartesian coordinate system is given by:

$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

## Derivation

To derive this formula, we create a right triangle where:
- The horizontal leg has length $|x_2 - x_1|$
- The vertical leg has length $|y_2 - y_1|$
- The hypotenuse is the distance we want to find

By the Pythagorean theorem:
$$d^2 = (x_2 - x_1)^2 + (y_2 - y_1)^2$$

Taking the square root of both sides:
$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

## Extension to Higher Dimensions

In three-dimensional space, the distance between points $(x_1, y_1, z_1)$ and $(x_2, y_2, z_2)$ is:

$$d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}$$

More generally, in $n$-dimensional space, the Euclidean distance between points $\mathbf{p}$ and $\mathbf{q}$ is:

$$d(\mathbf{p}, \mathbf{q}) = \sqrt{\sum_{i=1}^{n} (q_i - p_i)^2}$$

## Applications

The distance formula is used in:
- Computer graphics
- Machine learning (e.g., k-nearest neighbors algorithm)
- Physics (calculating trajectories)
- [[Euclidean Geometry]]
