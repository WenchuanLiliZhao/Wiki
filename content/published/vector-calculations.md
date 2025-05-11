---
title: Vector Calculations
update: 2025-05-13
---

# Vector Calculations

Vectors are mathematical objects that have both magnitude and direction. They are fundamental in physics, engineering, and many areas of mathematics.

## Vector Magnitude

The magnitude (or length) of a vector $\vec{v} = (v_1, v_2, \ldots, v_n)$ is calculated using the Euclidean norm:

$$|\vec{v}| = \sqrt{v_1^2 + v_2^2 + \ldots + v_n^2}$$

This is a direct application of the [[Pythagorean Theorem]] extended to $n$ dimensions.

## Vector Addition

Vectors can be added component-wise:

$$\vec{a} + \vec{b} = (a_1 + b_1, a_2 + b_2, \ldots, a_n + b_n)$$

Geometrically, vector addition follows the parallelogram law.

## Dot Product

The dot product of two vectors $\vec{a}$ and $\vec{b}$ is defined as:

$$\vec{a} \cdot \vec{b} = a_1b_1 + a_2b_2 + \ldots + a_nb_n$$

Alternatively, it can be expressed using the magnitudes and the angle $\theta$ between the vectors:

$$\vec{a} \cdot \vec{b} = |\vec{a}||\vec{b}|\cos\theta$$

This gives us a way to find the angle between vectors:

$$\cos\theta = \frac{\vec{a} \cdot \vec{b}}{|\vec{a}||\vec{b}|}$$

## Cross Product

For three-dimensional vectors, the cross product $\vec{a} \times \vec{b}$ produces a vector perpendicular to both $\vec{a}$ and $\vec{b}$:

$$\vec{a} \times \vec{b} = (a_2b_3 - a_3b_2, a_3b_1 - a_1b_3, a_1b_2 - a_2b_1)$$

The magnitude of the cross product is:

$$|\vec{a} \times \vec{b}| = |\vec{a}||\vec{b}|\sin\theta$$

This is useful in calculating areas and volumes.

## Relation to [[Linear Algebra]]

Vector calculations form the foundation of linear algebra, which extends these concepts to more general vector spaces and transformations.
