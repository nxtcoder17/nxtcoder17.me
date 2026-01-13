import { For, createSignal, createMemo } from "solid-js";
import { createAsync, cache, A } from "@solidjs/router";
import { formatDisplayDate } from "~/lib/types";
import { getRecentTils } from "~/lib/content.server";

const loadRecentTils = cache(async () => {
  "use server";
  return getRecentTils(20);
}, "recent-tils-v1");

export const route = {
  load: () => loadRecentTils(),
};

type Filter = "all" | "tech" | "life";

export default function EditorialMinimal() {
  const tils = createAsync(() => loadRecentTils());
  const [filter, setFilter] = createSignal<Filter>("all");

  const filteredTils = createMemo(() => {
    const all = tils() || [];
    if (filter() === "all") return all;
    return all.filter((til) => til.category === filter());
  });

  const entryCount = createMemo(() => filteredTils().length);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "tech", label: "Tech" },
    { id: "life", label: "Life" },
  ];

  return (
    <div class="max-w-[640px]">
      {/* Header with inline count */}
      <header class="mb-10">
        <h1 class="text-2xl font-semibold tracking-tight text-fg">
          Today I Learned
          <span class="text-muted font-normal ml-2">
            · {entryCount()} {entryCount() === 1 ? "entry" : "entries"}
          </span>
        </h1>
      </header>

      {/* Underline filter nav */}
      <nav class="flex gap-6 mb-8 border-b border-border">
        <For each={filters}>
          {(f) => (
            <button
              onClick={() => setFilter(f.id)}
              class={`pb-2 text-sm transition-colors -mb-px ${
                filter() === f.id
                  ? "text-fg border-b-2 border-fg font-medium"
                  : "text-muted hover:text-fg"
              }`}
            >
              {f.label}
            </button>
          )}
        </For>
      </nav>

      {/* Entry list */}
      <ul class="divide-y divide-border">
        <For each={filteredTils()}>
          {(til) => (
            <li>
              <A
                href={`/${til.category}/${til.slug}`}
                class="flex items-center justify-between py-3 group"
              >
                <div class="flex items-center gap-3 min-w-0">
                  {/* Category dot */}
                  <span
                    class={`w-2 h-2 rounded-full flex-shrink-0 ${
                      til.category === "tech" ? "bg-[#4A7B5E]" : "bg-[#C2714F]"
                    }`}
                  />
                  <span class="text-fg group-hover:text-muted transition-colors truncate">
                    {til.title}
                  </span>
                </div>
                <time class="text-sm text-muted flex-shrink-0 ml-4">
                  {formatDisplayDate(til.date)}
                </time>
              </A>
            </li>
          )}
        </For>
      </ul>

      {/* Empty state */}
      {filteredTils()?.length === 0 && (
        <p class="text-muted py-12">No entries found.</p>
      )}
    </div>
  );
}
