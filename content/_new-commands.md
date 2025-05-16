---
hidden: true
---
# TeX Commands Used in This Website

sss

## Set theory

| Command                                                           | Use case                                                                                                                                     |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| $\newcommand{\Tuple}[1]{\left\langle #1 \right\rangle} \Tuple{x}$ | If $x_1, \ldots, x_n$ are elements, we write $\Tuple{x_1, \ldots, x_n}$ for the $n$-tuples consisting of $x_1, \ldots, x_n$ (in this order). |

## Metamathematics

| Command                                                    | Use case                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| $\newcommand{\String}[1]{\text{`} #1 \text{'}} \String{x}$ | Just as in JavaScript and other programming language, we wrap a string (which can be a symbol or a formula) in $\String{}$ if and only if the string is treated as an element of the domain of discourse. For example, the string $\String{\forall x (x = x)}$ is an element of the domain of the Gödel numbering $\gamma$. |
| $\newcommand{\Numeral}[1]{\tilde{#1}} \Numeral{x}$         | If $n$ is a natural number, then $\Numeral{n}$ is the numeral of $n$.                                                                                                                                                                                                                                                       |
| $\newcommand{\StringAdd}{{^\frown}} \phi \StringAdd \psi$  | If $\phi$ and $\psi$ are strings, then $\phi \StringAdd \psi$ is the combination of $\phi$ and $\psi$. For example, if $\phi = \String{\forall x}$ and $\psi = \String{(x = x)}$, then $\phi \StringAdd \psi = \String{\forall x(x = x)}$.                                                                                  |
