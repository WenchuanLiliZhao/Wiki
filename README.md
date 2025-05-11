# Math-Wiki

## Custom Commands in Math Rendering

This project supports custom LaTeX commands for math rendering using KaTeX. For example, you can define a custom command like `\Tuple` to simplify writing mathematical expressions.

### Implementation

The custom commands are defined in the `WikiContent` component using the `macros` option of the `rehype-katex` plugin. The following code snippet demonstrates how the `\Tuple` command is added:

```tsx
// filepath: [`components/wiki-content.tsx`](components/wiki-content.tsx )
.use(rehypeKatex, {
  macros: {
    "\\Tuple": "\\left\\langle #1 \\right\\rangle", // Custom command for tuples
  },
})
```

### Usage

To use the custom command in your Markdown content, simply include it in your math expressions. For example:

```markdown
# Example with Custom Command

Using the custom command for tuples: $\Tuple{a, b, c}$.
```

When rendered, the above will display as `⟨a, b, c⟩`.

### Notes

- Ensure that the `katex` styles are loaded in your project. This is already handled in the `app/layout.tsx` file by importing `katex/dist/katex.min.css`.
- You can add more custom commands by extending the `macros` object in the `rehype-katex` configuration.
