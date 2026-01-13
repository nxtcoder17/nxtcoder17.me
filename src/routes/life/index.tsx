import { For } from "solid-js";
import { createAsync, cache } from "@solidjs/router";
import TilCard from "~/components/TilCard";
import { formatDisplayDate } from "~/lib/types";
import { getAllTils } from "~/lib/content.server";

const loadLifeTils = cache(async () => {
  "use server";
  return getAllTils("life");
}, "life-tils");

export const route = {
  load: () => loadLifeTils(),
};

export default function LifeIndex() {
  const tils = createAsync(() => loadLifeTils());

  return (
    <div>
      {/* Header */}
      <section class="mb-10">
        <div class="flex items-center gap-3 mb-3">
          <span class="tag tag-life">Life</span>
          <span class="text-[13px] text-muted">{tils()?.length || 0} entries</span>
        </div>
        <h1 class="text-[1.75rem] font-bold tracking-tight mb-3">
          Life Learnings
        </h1>
        <p class="text-muted leading-relaxed max-w-md">
          Lessons and insights from everyday experiences — the non-technical side.
        </p>
      </section>

      {/* Entry list */}
      <section>
        <span class="section-label mb-6 block">All Entries</span>
        <div class="space-y-3">
          <For each={tils()}>
            {(til) => (
              <TilCard
                title={til.title}
                date={formatDisplayDate(til.date)}
                href={`/life/${til.slug}`}
                category={til.category}
              />
            )}
          </For>
        </div>

        {tils()?.length === 0 && (
          <div class="text-center py-16 border border-dashed border-border rounded-lg bg-surface/50">
            <p class="text-muted">No entries yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
