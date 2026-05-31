import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { createHighlighter, type Highlighter } from "shiki";

export interface TilEntry {
  title: string;
  date: string;
  slug: string;
  category: "tech" | "life";
  tags: string[];
  content?: string;
}

export interface TilNavigation {
  prev: { title: string; slug: string } | null;
  next: { title: string; slug: string } | null;
}

export interface TilWithNavigation extends TilEntry {
  navigation: TilNavigation;
}

const CONTENT_DIR = join(process.cwd(), "content");
const OUTPUT_FILE = join(process.cwd(), "src", "tils.json");

// Singleton highlighter instance
let highlighter: Highlighter | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: [
        "javascript",
        "typescript",
        "jsx",
        "tsx",
        "json",
        "html",
        "css",
        "bash",
        "shell",
        "markdown",
        "yaml",
        "python",
        "go",
        "rust",
        "sql",
        "graphql",
        "dockerfile",
      ],
    });
  }
  return highlighter;
}

// Configure marked with syntax highlighting
async function renderMarkdown(content: string): Promise<string> {
  const hl = await getHighlighter();

  const renderer = new marked.Renderer();

  renderer.code = ({ text, lang }) => {
    const language = lang || "text";
    const displayLang = language === "text" ? "" : language;
    try {
      // Use shiki for highlighting with dual themes
      const html = hl.codeToHtml(text, {
        lang: hl.getLoadedLanguages().includes(language) ? language : "text",
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
        defaultColor: false,
      });
      // Wrap with container for language label and copy button
      return `<div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-block-lang">${displayLang}</span>
          <button class="code-copy-btn" aria-label="Copy code">
            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
        </div>
        ${html}
      </div>`;
    } catch {
      // Fallback to plain code block
      return `<div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-block-lang">${displayLang}</span>
          <button class="code-copy-btn" aria-label="Copy code">
            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
        </div>
        <pre><code class="language-${language}">${text}</code></pre>
      </div>`;
    }
  };

  marked.use({ renderer });

  return marked(content);
}

function formatDateString(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

async function build() {
  console.log("Generating TIL entries...");
  const categories = ["tech", "life"] as const;
  const allEntries: TilWithNavigation[] = [];

  // Temporary list to gather everything and sort first
  const rawEntries: { category: "tech" | "life"; slug: string; filePath: string; data: any; content: string }[] = [];

  for (const category of categories) {
    const dir = join(CONTENT_DIR, category);
    if (!existsSync(dir)) continue;

    const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const slug = file.replace(/\.md$/, "");
      const filePath = join(dir, file);
      const fileContent = readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      rawEntries.push({
        category,
        slug,
        filePath,
        data,
        content
      });
    }
  }

  // Sort by date (newest first)
  rawEntries.sort((a, b) => {
    const dateA = new Date(a.data.date || "");
    const dateB = new Date(b.data.date || "");
    return dateB.getTime() - dateA.getTime();
  });

  // Render and compute prev/next
  for (let i = 0; i < rawEntries.length; i++) {
    const raw = rawEntries[i];
    const renderedHtml = await renderMarkdown(raw.content);

    const prev = i < rawEntries.length - 1 ? { title: rawEntries[i + 1].data.title || rawEntries[i + 1].slug, slug: rawEntries[i + 1].slug } : null;
    const next = i > 0 ? { title: rawEntries[i - 1].data.title || rawEntries[i - 1].slug, slug: rawEntries[i - 1].slug } : null;

    allEntries.push({
      title: raw.data.title || raw.slug,
      date: raw.data.date ? formatDateString(raw.data.date) : "",
      slug: raw.slug,
      category: raw.category,
      tags: Array.isArray(raw.data.tags) ? raw.data.tags : [],
      content: renderedHtml,
      navigation: {
        prev,
        next
      }
    });
  }

  // Ensure src directory exists
  const outDir = dirname(OUTPUT_FILE);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(allEntries, null, 2), "utf-8");
  console.log(`Successfully generated ${allEntries.length} TIL entries in ${OUTPUT_FILE}`);
}

build().catch((err) => {
  console.error("Failed to build content:", err);
  process.exit(1);
});
