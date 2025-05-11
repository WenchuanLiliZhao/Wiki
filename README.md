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

## Dependencies on the `content` Directory

The `content` directory is a critical part of the project, as it stores Markdown files that are used to generate pages and content dynamically. Below are the parts of the project that depend on the `content` directory:

1. **`lib/wiki-utils.ts`**:
   - The `getAllPages` and `getPageBySlug` functions use the `content/published` directory to read Markdown files.

   ```typescript
   const contentDirectory = path.join(process.cwd(), "content/published")
   ```

2. **`components/sidebar.tsx`**:
   - The `Sidebar` component fetches page data from the `/api/pages` endpoint, which ultimately relies on the `content` directory for its data.

3. **`app/[slug]/page.tsx`**:
   - The dynamic route page uses the `getPageBySlug` and `getAllPages` functions to load content from the `content` directory.

4. **`app/page.tsx`**:
   - The homepage uses the `getAllPages` function to load all pages from the `content` directory.

5. **`components/wiki-content.tsx`**:
   - The `WikiContent` component renders Markdown content loaded from the `content` directory.
