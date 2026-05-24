---
title: Setting up a TIL site with SolidJS
date: 2026-01-12
---

SolidJS Start with MDX support makes it incredibly easy to create a content-focused site.

<figure style="text-align: center;">
  <img src="https://www.solidjs.com/img/logo/without-wordmark/logo.png" alt="SolidJS Logo" width="120" />
  <figcaption style="color: var(--theme-muted); font-size: 0.875rem; margin-top: 0.5rem;">SolidJS Logo</figcaption>
</figure>

Here's a wider image:

<img src="https://picsum.photos/800/400" alt="Architecture Diagram" style="border-radius: 8px; border: 1px solid var(--theme-border);" />

## The Stack

- **SolidJS Start** - Full-stack framework with file-based routing
- **MDX** - Markdown with JSX components
- **Tailwind CSS** - Utility-first styling

## Key Learnings

1. File-based routing in SolidJS is intuitive - just create files in `routes/`
2. MDX allows you to import and use components directly in markdown
3. The `@vinxi/plugin-mdx` plugin handles all the MDX transformation

## Code Example

```tsx
// Import components directly in MDX
import TilLayout from "~/components/TilLayout";

// Then use them as JSX
<TilLayout title="My TIL" date="Today" category="tech">
  Content goes here...
</TilLayout>
```

This setup makes it easy to add new TILs - just create a markdown file with frontmatter.
