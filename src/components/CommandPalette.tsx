import { createSignal, createEffect, For, Show, onCleanup } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import type { TilEntry } from "~/lib/content.server";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  entries: TilEntry[];
}

export default function CommandPalette(props: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = createSignal("");
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  let inputRef: HTMLInputElement | undefined;

  const filteredEntries = () => {
    const q = query().toLowerCase().trim();
    if (!q) return props.entries.slice(0, 10);
    return props.entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    ).slice(0, 10);
  };

  // Reset selection when results change
  createEffect(() => {
    filteredEntries();
    setSelectedIndex(0);
  });

  // Focus input when opened
  createEffect(() => {
    if (props.isOpen) {
      setTimeout(() => inputRef?.focus(), 10);
      setQuery("");
      setSelectedIndex(0);
    }
  });

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    const results = filteredEntries();

    switch (e.key) {
      case "ArrowDown":
      case "j":
        if (e.key === "j" && !e.ctrlKey) break;
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
        break;
      case "ArrowUp":
      case "k":
        if (e.key === "k" && !e.ctrlKey) break;
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        const selected = results[selectedIndex()];
        if (selected) {
          navigate(`/${selected.category}/${selected.slug}`);
          props.onClose();
        }
        break;
      case "Escape":
        e.preventDefault();
        props.onClose();
        break;
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen}>
      <div
        class="fixed inset-0 z-[100] bg-fg/20 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
        onClick={handleBackdropClick}
      >
        <div class="w-full max-w-lg mx-4 bg-bg border border-border rounded-xl shadow-2xl overflow-hidden animate-palette-in">
          {/* Search input */}
          <div class="flex items-center gap-3 px-4 py-3 border-b border-border">
            <svg
              class="w-5 h-5 text-muted flex-shrink-0"
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
            <input
              ref={inputRef}
              type="text"
              placeholder="Search entries..."
              value={query()}
              onInput={(e) => setQuery(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              class="flex-1 bg-transparent text-fg text-[15px] placeholder:text-muted outline-none"
            />
            <kbd class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-muted bg-surface border border-border rounded">
              esc
            </kbd>
          </div>

          {/* Results */}
          <div class="max-h-[50vh] overflow-y-auto py-2">
            <Show
              when={filteredEntries().length > 0}
              fallback={
                <div class="px-4 py-8 text-center text-muted text-[14px]">
                  No entries found for "{query()}"
                </div>
              }
            >
              <For each={filteredEntries()}>
                {(entry, index) => (
                  <A
                    href={`/${entry.category}/${entry.slug}`}
                    onClick={() => props.onClose()}
                    class={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                      index() === selectedIndex()
                        ? "bg-surface"
                        : "hover:bg-surface/50"
                    }`}
                    onMouseEnter={() => setSelectedIndex(index())}
                  >
                    {/* Category indicator */}
                    <span
                      class={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        entry.category === "tech" ? "bg-tech" : "bg-life"
                      }`}
                    />

                    {/* Title and meta */}
                    <div class="flex-1 min-w-0">
                      <div class="text-[14px] font-medium text-fg truncate">
                        {entry.title}
                      </div>
                      <div class="flex items-center gap-2 mt-0.5">
                        <span
                          class={`text-[11px] font-semibold uppercase tracking-wide ${
                            entry.category === "tech"
                              ? "text-tech"
                              : "text-life"
                          }`}
                        >
                          {entry.category}
                        </span>
                        <span class="text-[11px] text-muted">
                          {formatDate(entry.date)}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <Show when={index() === selectedIndex()}>
                      <svg
                        class="w-4 h-4 text-muted"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Show>
                  </A>
                )}
              </For>
            </Show>
          </div>

          {/* Footer hints */}
          <div class="flex items-center justify-center gap-4 px-4 py-2.5 border-t border-border bg-surface/50 text-[11px] text-muted">
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px]">
                ↑↓
              </kbd>
              navigate
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px]">
                ⏎
              </kbd>
              open
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px]">
                esc
              </kbd>
              close
            </span>
          </div>
        </div>
      </div>
    </Show>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
