import { For, createSignal, createMemo, Show } from "solid-js";
import { createAsync, cache, A } from "@solidjs/router";
import { formatDisplayDate } from "~/lib/types";
import { getRecentTils } from "~/lib/content.server";

const loadRecentTils = cache(async () => {
  "use server";
  return getRecentTils(20);
}, "recent-tils-v2");

export const route = {
  load: () => loadRecentTils(),
};

type Filter = "all" | "tech" | "life";

export default function V2() {
  const tils = createAsync(() => loadRecentTils());
  const [filter, setFilter] = createSignal<Filter>("all");
  const [dropdownOpen, setDropdownOpen] = createSignal(false);

  const filteredTils = createMemo(() => {
    const all = tils() || [];
    if (filter() === "all") return all;
    return all.filter((til) => til.category === filter());
  });

  const stats = createMemo(() => {
    const all = tils() || [];
    return {
      total: all.length,
      tech: all.filter((t) => t.category === "tech").length,
      life: all.filter((t) => t.category === "life").length,
    };
  });

  const filterLabel = () => {
    const f = filter();
    if (f === "all") return "All";
    if (f === "tech") return "Tech";
    return "Life";
  };

  return (
    <div class="max-w-4xl mx-auto">
      {/* Compact header */}
      <header class="mb-4">
        <h1 class="text-lg font-semibold tracking-tight">TIL</h1>
      </header>

      {/* Stat bar - single horizontal line with pipes */}
      <div class="text-sm text-muted text-center mb-4 py-2 border-y border-border">
        <span class="text-fg font-medium">{stats().total}</span> entries
        <span class="mx-2 text-border">|</span>
        <span class="text-tech font-medium">{stats().tech}</span> tech
        <span class="mx-2 text-border">|</span>
        <span class="text-life font-medium">{stats().life}</span> life
      </div>

      {/* Filter row - compact dropdown */}
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs text-muted uppercase tracking-wider font-medium">
          {filteredTils().length} showing
        </span>

        {/* Compact filter dropdown */}
        <div class="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen())}
            class="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border border-border rounded bg-surface hover:bg-bg transition-colors"
          >
            <span>{filterLabel()}</span>
            <svg
              class={`w-3 h-3 text-muted transition-transform ${dropdownOpen() ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <Show when={dropdownOpen()}>
            <div class="absolute right-0 mt-1 w-24 bg-surface border border-border rounded shadow-lg z-10">
              <button
                onClick={() => { setFilter("all"); setDropdownOpen(false); }}
                class={`w-full text-left px-3 py-1.5 text-xs hover:bg-bg ${filter() === "all" ? "text-fg font-medium" : "text-muted"}`}
              >
                All
              </button>
              <button
                onClick={() => { setFilter("tech"); setDropdownOpen(false); }}
                class={`w-full text-left px-3 py-1.5 text-xs hover:bg-bg ${filter() === "tech" ? "text-tech font-medium" : "text-muted"}`}
              >
                Tech
              </button>
              <button
                onClick={() => { setFilter("life"); setDropdownOpen(false); }}
                class={`w-full text-left px-3 py-1.5 text-xs hover:bg-bg ${filter() === "life" ? "text-life font-medium" : "text-muted"}`}
              >
                Life
              </button>
            </div>
          </Show>
        </div>
      </div>

      {/* Dense 2-column grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <For each={filteredTils()}>
          {(til) => (
            <A
              href={`/${til.category}/${til.slug}`}
              class={`block p-3 bg-surface border border-border rounded-r hover:bg-bg transition-colors border-l-4 ${
                til.category === "tech" ? "border-l-tech" : "border-l-life"
              }`}
            >
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-sm font-medium text-fg leading-snug line-clamp-2">
                  {til.title}
                </h3>
                <span
                  class={`shrink-0 text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded ${
                    til.category === "tech"
                      ? "bg-tech-subtle text-tech"
                      : "bg-life-subtle text-life"
                  }`}
                >
                  {til.category}
                </span>
              </div>
              <div class="text-xs text-muted mt-1.5">
                {formatDisplayDate(til.date)}
              </div>
            </A>
          )}
        </For>
      </div>

      {/* Empty state */}
      <Show when={filteredTils()?.length === 0}>
        <div class="text-center py-12 border border-dashed border-border rounded bg-surface/50">
          <p class="text-sm text-muted">No entries found.</p>
        </div>
      </Show>
    </div>
  );
}
