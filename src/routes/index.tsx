import {
  Show,
  createSignal,
  onMount,
  onCleanup,
} from "solid-js";
import { createAsync, cache } from "@solidjs/router";
import SearchBar from "~/components/SearchBar";
import CommandPalette from "~/components/CommandPalette";
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
  const [isPaletteOpen, setIsPaletteOpen] = createSignal(false);

  // Global keyboard shortcut for Cmd+K
  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
      // Also allow / to open (when not in input)
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes(
          (e.target as HTMLElement)?.tagName || ""
        )
      ) {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });

  // Get first entry for spotlight
  const spotlightEntry = () => {
    const entries = tils();
    if (!entries || entries.length === 0) return null;
    return entries[0];
  };

  // Stats calculation
  const stats = () => {
    const all = tils() || [];
    const tech = all.filter((t) => t.category === "tech").length;
    const life = all.filter((t) => t.category === "life").length;

    // Count unique days
    const uniqueDays = new Set(all.map((t) => t.date)).size;

    return { total: all.length, tech, life, days: uniqueDays };
  };

  return (
    <div class="space-y-10">
      {/* Header section with title and search */}
      <header class="space-y-6">
        {/* Title and stats */}
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-fg">
              Today I Learned
            </h1>
            <p class="text-[14px] text-muted mt-1.5 max-w-sm">
              Small discoveries and insights from daily learning.
            </p>
          </div>

          {/* Compact stats */}
          <div class="flex items-center gap-4 text-[12px]">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-fg">{stats().total}</span>
              <span class="text-muted">entries</span>
            </div>
            <div class="w-px h-3 bg-border" />
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-tech" />
              <span class="font-semibold text-tech">{stats().tech}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-life" />
              <span class="font-semibold text-life">{stats().life}</span>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <SearchBar onClick={() => setIsPaletteOpen(true)} />
      </header>

      {/* Spotlight - Latest entry */}
      <Show when={spotlightEntry()}>
        {(entry) => (
          <Spotlight entry={entry()} />
        )}
      </Show>

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

      {/* Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen()}
        onClose={() => setIsPaletteOpen(false)}
        entries={tils() || []}
      />
    </div>
  );
}
