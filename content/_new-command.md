---
title: New Command
hide: true
---


| Command                                        | Example         |
| ---------------------------------------------- | --------------- |
| $\newcommand{\Tuple}[1]{\left< x,y,z \right>}$ | $\Tuple{x,y,z}$ |
| $\newcommand{\Class}[1]{\left\{ #1 \right\}}$  | $\Class{x,y,z}$ |

The above `newcommands` would be translated into macros settings in `wiki-content.tsx`: 

```typescript
.use(rehypeKatex, {
  macros: {
    // here
  },
  trust: true,
})
```

For example

```typescript
.use(rehypeKatex, {
  macros: {
    "\\Tuple": "{\\langle #1 \\rangle}",
  },
  trust: true,
})
```