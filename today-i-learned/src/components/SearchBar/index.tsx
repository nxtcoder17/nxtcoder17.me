import { createSignal, onMount, onCleanup } from "solid-js";
import CommandPalette from "./CommandPalette";
import type { TilEntry } from "~/lib/types";

interface SearchBarProps {
  entries: TilEntry[];
}

export default function SearchBar(props: SearchBarProps) {
  const [isOpen, setIsOpen] = createSignal(false);

  // Global keyboard shortcut for Cmd+K
  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      // Also allow / to open (when not in input)
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes(
          (e.target as HTMLElement)?.tagName || ""
        )
      ) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        class="w-full flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-lg text-left group hover:border-muted transition-colors"
      >
        {/* Search icon */}
        <svg
          class="w-4 h-4 text-muted group-hover:text-fg transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Placeholder text */}
        <span class="flex-1 text-[14px] text-muted">Search entries...</span>

        {/* Keyboard shortcut */}
        <kbd class="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-muted bg-bg border border-border rounded group-hover:border-muted transition-colors">
          <span class="text-[10px]">⌘</span>K
        </kbd>
      </button>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isOpen()}
        onClose={() => setIsOpen(false)}
        entries={props.entries}
      />
    </>
  );
}
