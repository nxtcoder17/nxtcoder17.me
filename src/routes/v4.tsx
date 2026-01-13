import { For, createSignal, createMemo } from "solid-js";
import { createAsync, cache, A } from "@solidjs/router";
import { formatDisplayDate } from "~/lib/types";
import { getRecentTils } from "~/lib/content.server";

const loadRecentTils = cache(async () => {
  "use server";
  return getRecentTils(20);
}, "recent-tils-v4");

export const route = {
  load: () => loadRecentTils(),
};

type Filter = "all" | "tech" | "life";

export default function V4() {
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

  const featuredTil = createMemo(() => filteredTils()[0]);
  const remainingTils = createMemo(() => filteredTils().slice(1));

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "tech", label: "Tech" },
    { id: "life", label: "Life" },
  ];

  return (
    <div class="relative">
      {/* Large decorative numeral watermark */}
      <div class="absolute -z-10 text-[12rem] font-bold opacity-5 right-0 top-0 select-none pointer-events-none leading-none">
        {stats().total}
      </div>

      {/* Hero section - editorial style */}
      <section class="mb-16">
        <h1 class="text-3xl font-bold tracking-tight mb-2">
          Today I Learned
        </h1>
        <p class="text-muted leading-relaxed max-w-lg mb-8">
          A curated collection of daily discoveries, insights, and learnings from the intersection of technology and life.
        </p>

        {/* Stats - featured total, inline others */}
        <div class="flex items-baseline gap-6">
          <div>
            <span class="text-4xl font-bold text-fg">{stats().total}</span>
            <span class="text-sm text-muted ml-2">entries</span>
          </div>
          <div class="flex items-center gap-4 text-sm text-muted">
            <span>
              <span class="font-medium text-tech">{stats().tech}</span> tech
            </span>
            <span class="text-border">|</span>
            <span>
              <span class="font-medium text-life">{stats().life}</span> life
            </span>
          </div>
        </div>
      </section>

      {/* Featured Entry - Latest */}
      {featuredTil() && (
        <section class="mb-12">
          {/* Section label with extending rule */}
          <div class="flex items-center gap-4 mb-6">
            <span class="text-xs font-semibold uppercase tracking-wider text-muted">
              Latest
            </span>
            <div class="flex-1 h-px bg-border" />
          </div>

          {/* Featured card - full width, larger */}
          <A
            href={`/${featuredTil()!.category}/${featuredTil()!.slug}`}
            class="block group"
          >
            <article class="p-6 bg-surface border border-border rounded-lg hover:border-fg/20 transition-colors">
              <div class="flex items-center gap-3 mb-3">
                <span
                  class={`text-xs font-medium uppercase tracking-wider ${
                    featuredTil()!.category === "tech" ? "text-tech" : "text-life"
                  }`}
                >
                  {featuredTil()!.category}
                </span>
                <span class="text-xs text-muted">
                  {formatDisplayDate(featuredTil()!.date)}
                </span>
              </div>
              <h2 class="text-xl font-semibold text-fg group-hover:text-fg/80 transition-colors">
                {featuredTil()!.title}
              </h2>
            </article>
          </A>
        </section>
      )}

      {/* More Entries section */}
      <section>
        {/* Section label with extending rule and filter */}
        <div class="flex items-center gap-4 mb-6">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">
            More Entries
          </span>
          <div class="flex-1 h-px bg-border" />

          {/* Filter buttons */}
          <div class="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
            <For each={filters}>
              {(f) => (
                <button
                  onClick={() => setFilter(f.id)}
                  class={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    filter() === f.id
                      ? "bg-bg text-fg shadow-sm"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  {f.label}
                </button>
              )}
            </For>
          </div>
        </div>

        {/* Entry grid */}
        <div class="space-y-2">
          <For each={remainingTils()}>
            {(til) => (
              <A
                href={`/${til.category}/${til.slug}`}
                class="block group"
              >
                <article class="flex items-center justify-between py-3 px-4 bg-surface/50 border border-border rounded-lg hover:border-fg/20 hover:bg-surface transition-colors">
                  <div class="flex items-center gap-3 min-w-0">
                    <span
                      class={`text-[10px] font-semibold uppercase tracking-wider shrink-0 ${
                        til.category === "tech" ? "text-tech" : "text-life"
                      }`}
                    >
                      {til.category}
                    </span>
                    <h3 class="text-sm font-medium text-fg truncate group-hover:text-fg/80 transition-colors">
                      {til.title}
                    </h3>
                  </div>
                  <span class="text-xs text-muted shrink-0 ml-4">
                    {formatDisplayDate(til.date)}
                  </span>
                </article>
              </A>
            )}
          </For>
        </div>

        {/* Empty state */}
        {filteredTils()?.length === 0 && (
          <div class="text-center py-16 border border-dashed border-border rounded-lg bg-surface/50">
            <p class="text-muted">No entries found.</p>
            <p class="text-xs text-muted mt-1 opacity-75">
              Check back soon for new content.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
