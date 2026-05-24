import type { TilEntry } from "~/lib/content.server";

export interface CommandOutput {
  type: "success" | "error";
  text?: string;
  html?: string;
  newCwd?: string;
}

type CommandHandler = (
  args: string[],
  entries: TilEntry[],
  cwd: string
) => CommandOutput | Promise<CommandOutput>;

const commands: Record<string, CommandHandler> = {
  help: () => ({
    type: "success",
    text: `Available commands:

  help          Show this help message
  clear         Clear terminal output
  ls [-l]       List TIL entries (-l for detailed view with dates)
  cat <slug>    View a TIL entry
  grep <term>   Search TIL titles
  cd <dir>      Change directory (tech, life, or ~ for all)

Examples:
  ls -l
  cat solidjs-signals
  grep react
  cd tech`,
  }),

  ls: (args, entries, cwd) => {
    const showLong = args.includes("-l");

    // Filter entries by cwd
    let filtered = entries;
    if (cwd === "tech" || cwd === "life") {
      filtered = entries.filter((e) => e.category === cwd);
    }

    if (filtered.length === 0) {
      return { type: "success", text: "No entries found." };
    }

    if (showLong) {
      const lines = filtered.map((e) => {
        const date = e.date || "----------";
        const cat = e.category.padEnd(4);
        return `${date}  ${cat}  ${e.slug}`;
      });
      return { type: "success", text: lines.join("\n") };
    }

    // Simple list - multiple columns
    const slugs = filtered.map((e) => e.slug);
    return { type: "success", text: slugs.join("  ") };
  },

  cat: async (args, entries) => {
    if (args.length === 0) {
      return { type: "error", text: "Usage: cat <slug>" };
    }

    const slug = args[0];
    const entry = entries.find((e) => e.slug === slug);

    if (!entry) {
      return { type: "error", text: `cat: ${slug}: No such entry` };
    }

    // Fetch full content from server
    try {
      const response = await fetch(`/api/til/${slug}`);
      if (!response.ok) {
        return { type: "error", text: `cat: ${slug}: Failed to load content` };
      }
      const data = await response.json();

      // Return rendered HTML with metadata header and distinct background
      const categoryColor = data.category === "tech" ? "text-tech" : "text-life";
      const header = `<div class="flex items-center gap-3 mb-4 pb-3 border-b border-border">
        <span class="${categoryColor} text-xs font-medium uppercase">${data.category}</span>
        <span class="text-muted text-xs">${data.date}</span>
      </div>
      <div class="text-fg font-bold text-lg mb-3">${data.title}</div>`;

      return {
        type: "success",
        html: `<div class="bg-surface/50 border border-border rounded-lg p-4 my-2">${header}<div class="prose">${data.content}</div></div>`,
      };
    } catch {
      return { type: "error", text: `cat: ${slug}: Failed to load content` };
    }
  },

  grep: (args, entries) => {
    if (args.length === 0) {
      return { type: "error", text: "Usage: grep <search-term>" };
    }

    const term = args.join(" ").toLowerCase();
    const matches = entries.filter(
      (e) =>
        e.title.toLowerCase().includes(term) ||
        e.slug.toLowerCase().includes(term) ||
        e.tags.some((tag) => tag.toLowerCase().includes(term))
    );

    if (matches.length === 0) {
      return { type: "success", text: "No matches found." };
    }

    const lines = matches.map((e) => {
      // Check where match occurred
      const titleMatch = e.title.toLowerCase().includes(term);
      const tagMatch = e.tags.find((t) => t.toLowerCase().includes(term));

      let result = `<span class="text-muted">${e.slug}</span>: `;

      // Highlight in title if matched
      if (titleMatch) {
        const titleLower = e.title.toLowerCase();
        const idx = titleLower.indexOf(term);
        const before = e.title.slice(0, idx);
        const match = e.title.slice(idx, idx + term.length);
        const after = e.title.slice(idx + term.length);
        result += `${before}<span class="text-tech font-bold">${match}</span>${after}`;
      } else {
        result += e.title;
      }

      // Show matching tag
      if (tagMatch) {
        result += ` <span class="text-xs bg-tech/20 text-tech px-1.5 py-0.5 rounded">${tagMatch}</span>`;
      }

      return result;
    });

    return { type: "success", html: lines.join("<br/>") };
  },

  cd: (args, _entries, _cwd) => {
    if (args.length === 0 || args[0] === "~" || args[0] === "/") {
      return { type: "success", text: "", newCwd: "~" };
    }

    const target = args[0].toLowerCase();
    if (target === "tech" || target === "life") {
      return { type: "success", text: "", newCwd: target };
    }

    return { type: "error", text: `cd: ${args[0]}: No such directory` };
  },
};

export async function executeCommand(
  input: string,
  entries: TilEntry[],
  cwd: string
): Promise<CommandOutput> {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (cmd === "clear") {
    return { type: "success", text: "" };
  }

  const handler = commands[cmd];
  if (!handler) {
    return {
      type: "error",
      text: `${cmd}: command not found. Type 'help' for available commands.`,
    };
  }

  return handler(args, entries, cwd);
}
