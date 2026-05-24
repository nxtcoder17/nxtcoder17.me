"use server";

import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
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

function getContentDir(category: "tech" | "life"): string {
  return join(CONTENT_DIR, category);
}

export async function getAllTils(category: "tech" | "life"): Promise<TilEntry[]> {
  const dir = getContentDir(category);

  if (!existsSync(dir)) {
    return [];
  }

  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));

  const tils = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const filePath = join(dir, file);
    const fileContent = readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      title: data.title || slug,
      date: data.date ? formatDateString(data.date) : "",
      slug,
      category,
      tags: Array.isArray(data.tags) ? data.tags : [],
    };
  });

  // Sort by date, newest first
  return tils.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
}

export async function getTil(category: "tech" | "life", slug: string): Promise<TilWithNavigation | null> {
  const dir = getContentDir(category);
  const filePath = join(dir, `${slug}.md`);

  if (!existsSync(filePath)) {
    return null;
  }

  const fileContent = readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  // Get all TILs in this category to find prev/next
  const allTils = await getAllTils(category);
  const currentIndex = allTils.findIndex((t) => t.slug === slug);

  const navigation: TilNavigation = {
    // Next is newer (earlier in array since sorted newest first)
    next: currentIndex > 0 ? { title: allTils[currentIndex - 1].title, slug: allTils[currentIndex - 1].slug } : null,
    // Prev is older (later in array)
    prev: currentIndex < allTils.length - 1 ? { title: allTils[currentIndex + 1].title, slug: allTils[currentIndex + 1].slug } : null,
  };

  return {
    title: data.title || slug,
    date: data.date ? formatDateString(data.date) : "",
    slug,
    category,
    content: await renderMarkdown(content),
    navigation,
  };
}

export async function getTilBySlug(slug: string): Promise<TilWithNavigation | null> {
  // Search in both categories
  for (const category of ["tech", "life"] as const) {
    const dir = getContentDir(category);
    const filePath = join(dir, `${slug}.md`);

    if (existsSync(filePath)) {
      const fileContent = readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      // Get all TILs across both categories for prev/next navigation
      const allTils = await getRecentTils(100);
      const currentIndex = allTils.findIndex((t) => t.slug === slug);

      const navigation: TilNavigation = {
        next: currentIndex > 0 ? { title: allTils[currentIndex - 1].title, slug: allTils[currentIndex - 1].slug } : null,
        prev: currentIndex < allTils.length - 1 ? { title: allTils[currentIndex + 1].title, slug: allTils[currentIndex + 1].slug } : null,
      };

      return {
        title: data.title || slug,
        date: data.date ? formatDateString(data.date) : "",
        slug,
        category,
        tags: Array.isArray(data.tags) ? data.tags : [],
        content: await renderMarkdown(content),
        navigation,
      };
    }
  }

  return null;
}

export async function getRecentTils(count: number = 20): Promise<TilEntry[]> {
  const techTils = await getAllTils("tech");
  const lifeTils = await getAllTils("life");

  const allTils = [...techTils, ...lifeTils];

  // Sort by date, newest first
  allTils.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return allTils.slice(0, count);
}

function formatDateString(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

// https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A37285%2Foauth2callback&access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&state=bf9187b9a2f4d1b0ab06b78f42390f2363ac7b7e057ad1c5853be3d45eb3a49&response_type=code&client_id=681255809395-oo8ft2oprdrnp9e3aqf6av3hmdib135j.apps.googleusercontent.com
