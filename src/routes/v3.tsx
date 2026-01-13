import { For, createSignal, createMemo } from "solid-js";
import { createAsync, cache, A } from "@solidjs/router";
import { formatDisplayDate } from "~/lib/types";
import { getRecentTils } from "~/lib/content.server";

const loadRecentTils = cache(async () => {
  "use server";
  return getRecentTils(20);
}, "recent-tils-v3");

export const route = {
  load: () => loadRecentTils(),
};

type Filter = "all" | "tech" | "life";

export default function HomeV3() {
  const tils = createAsync(() => loadRecentTils());
  const [filter, setFilter] = createSignal<Filter>("all");

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

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "tech", label: "Tech" },
    { id: "life", label: "Life" },
  ];

  return (
    <div class="min-h-screen">
      {/* Hero section with dot pattern */}
      <section class="mb-16 py-12 -mx-6 px-6 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]">
        <h1 class="text-3xl font-black tracking-tight mb-4 uppercase">
          Today I Learned
        </h1>
        <p class="text-muted leading-relaxed max-w-lg text-lg">
          A personal collection of small discoveries and insights from daily learning.
        </p>

        {/* Stats row - brutalist cards */}
        <div class="flex items-stretch gap-4 mt-8">
          <div class="border-2 border-border shadow-[4px_4px_0_0_var(--theme-border)] bg-bg px-6 py-4 rounded-none">
            <div class="text-3xl font-black text-fg">{stats().total}</div>
            <div class="text-xs font-bold text-muted uppercase tracking-widest mt-1">
              Entries
            </div>
          </div>
          <div class="border-2 border-border shadow-[4px_4px_0_0_var(--theme-border)] bg-bg px-6 py-4 rounded-none">
            <div class="text-3xl font-black text-tech">{stats().tech}</div>
            <div class="text-xs font-bold text-muted uppercase tracking-widest mt-1">
              Tech
            </div>
          </div>
          <div class="border-2 border-border shadow-[4px_4px_0_0_var(--theme-border)] bg-bg px-6 py-4 rounded-none">
            <div class="text-3xl font-black text-life">{stats().life}</div>
            <div class="text-xs font-bold text-muted uppercase tracking-widest mt-1">
              Life
            </div>
          </div>
        </div>
      </section>

      {/* Entries section */}
      <section>
        {/* Section header with chunky filter buttons */}
        <div class="flex items-center justify-between mb-8">
          <span class="text-xs font-bold uppercase tracking-widest text-muted">
            Recent Entries
          </span>

          {/* Chunky toggle buttons */}
          <div class="flex items-center gap-0">
            <For each={filters}>
              {(f) => (
                <button
                  onClick={() => setFilter(f.id)}
                  class={`px-5 py-2 text-sm font-bold uppercase tracking-wide border-2 border-border -ml-[2px] first:ml-0 transition-all rounded-none ${
                    filter() === f.id
                      ? "bg-fg text-bg shadow-[2px_2px_0_0_var(--theme-border)] translate-x-[-2px] translate-y-[-2px]"
                      : "bg-bg text-muted hover:bg-surface hover:text-fg"
                  }`}
                >
                  {f.label}
                </button>
              )}
            </For>
          </div>
        </div>

        {/* Entry list - brutalist cards */}
        <div class="space-y-4">
          <For each={filteredTils()}>
            {(til) => (
              <A
                href={`/${til.category}/${til.slug}`}
                class="group block border-2 border-border bg-bg rounded-none p-6 shadow-[4px_4px_0_0_var(--theme-border)] hover:shadow-[6px_6px_0_0_var(--theme-border)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-lg text-fg leading-snug group-hover:text-tech transition-colors">
                      {til.title}
                    </h3>
                    <div class="flex items-center gap-4 mt-3">
                      <span
                        class={`px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 rounded-none ${
                          til.category === "tech"
                            ? "border-tech text-tech"
                            : "border-life text-life"
                        }`}
                      >
                        {til.category}
                      </span>
                      <span class="text-sm text-muted font-medium">
                        {formatDisplayDate(til.date)}
                      </span>
                    </div>
                  </div>
                  <div class="mt-1 text-muted group-hover:text-tech transition-colors">
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="3"
                    >
                      <path
                        stroke-linecap="square"
                        stroke-linejoin="miter"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </A>
            )}
          </For>
        </div>

        {/* Empty state */}
        {filteredTils()?.length === 0 && (
          <div class="text-center py-20 border-2 border-dashed border-border bg-surface/30 rounded-none">
            <p class="text-muted font-bold uppercase tracking-wide">
              No entries found.
            </p>
            <p class="text-sm text-muted mt-2">
              Check back soon for new content.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
