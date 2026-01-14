import { Show } from "solid-js";
import { createAsync, cache } from "@solidjs/router";
import Spotlight from "~/components/Spotlight";
import Timeline from "~/components/Timeline";
import { getRecentTils } from "~/lib/content.server";

const loadRecentTils = cache(async () => {
  "use server";
  return getRecentTils(50);
}, "recent-tils-unified");

export const route = {
  load: () => loadRecentTils(),
};

export default function TilHomepage() {
  const tils = createAsync(() => loadRecentTils());

  // Get first entry for spotlight
  const spotlightEntry = () => {
    const entries = tils();
    if (!entries || entries.length === 0) return null;
    return entries[0];
  };

  return (
    <div class="flex flex-col h-[calc(100vh-14rem)]">
      {/* Sticky top section */}
      <div class="flex-shrink-0 space-y-6 pb-6">
        {/* Header section with title */}
        <header>
          <h1 class="text-2xl font-bold tracking-tight text-fg">
            Today I Learned
          </h1>
        </header>

        {/* Spotlight - Latest entry */}
        <Show when={spotlightEntry()}>
          {(entry) => (
            <Spotlight entry={entry()} />
          )}
        </Show>
      </div>

      {/* Scrollable timeline section */}
      <div class="flex-1 overflow-y-auto min-h-0">
        {/* Timeline - All entries grouped by date */}
        <Show when={tils() && tils()!.length > 0}>
          <Timeline entries={tils()!} skipFirst={true} />
        </Show>

        {/* Empty state */}
        <Show when={!tils() || tils()?.length === 0}>
          <div class="text-center py-20 border border-dashed border-border rounded-xl bg-surface/30">
            <div class="text-4xl mb-4 opacity-50">
              &#128218;
            </div>
            <p class="text-muted font-medium">No entries yet.</p>
            <p class="text-[13px] text-muted mt-1 opacity-75">
              Start documenting your learnings.
            </p>
          </div>
        </Show>
      </div>
    </div>
  );
}
