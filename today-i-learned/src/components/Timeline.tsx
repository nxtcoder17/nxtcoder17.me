import { For, createMemo } from "solid-js";
import TimelineDay from "./TimelineDay";
import type { TilEntry } from "~/lib/content.server";

interface TimelineProps {
  entries: TilEntry[];
  skipFirst?: boolean; // Skip first entry (shown in spotlight)
}

interface DayGroup {
  date: string;
  displayDate: string;
  entries: TilEntry[];
}

export default function Timeline(props: TimelineProps) {
  // Group entries by date
  const groupedByDay = createMemo<DayGroup[]>(() => {
    const entries = props.skipFirst ? props.entries.slice(1) : props.entries;
    const groups: Map<string, TilEntry[]> = new Map();

    for (const entry of entries) {
      const dateKey = entry.date;
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(entry);
    }

    return Array.from(groups.entries()).map(([date, entries]) => ({
      date,
      displayDate: formatDisplayDate(date),
      entries,
    }));
  });

  return (
    <section class="relative">
      {/* Section label */}
      <div class="flex items-center gap-3 mb-6">
        <span class="text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
          Timeline
        </span>
        <div class="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
      </div>

      {/* Timeline container */}
      <div class="relative">
        {/* Vertical line */}
        <div class="absolute left-[7px] top-4 bottom-4 w-px bg-gradient-to-b from-border via-border to-transparent" />

        {/* Day groups */}
        <div class="space-y-6">
          <For each={groupedByDay()}>
            {(day, index) => (
              <TimelineDay
                date={day.displayDate}
                entries={day.entries}
                isLast={index() === groupedByDay().length - 1}
              />
            )}
          </For>
        </div>
      </div>

      {/* End indicator */}
      {groupedByDay().length > 0 && (
        <div class="flex items-center gap-3 mt-8 pt-4">
          <div class="w-[15px] flex justify-center">
            <div class="w-2 h-2 rounded-full bg-border" />
          </div>
          <span class="text-[12px] text-muted italic">
            That's all for now. More learnings coming soon.
          </span>
        </div>
      )}
    </section>
  );
}

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}
