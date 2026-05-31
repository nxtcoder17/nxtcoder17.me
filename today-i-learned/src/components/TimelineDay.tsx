import { For } from "solid-js";
import TimelineEntry from "./TimelineEntry";
import type { TilEntry } from "~/lib/types";

interface TimelineDayProps {
  date: string;
  entries: TilEntry[];
  isLast?: boolean;
}

export default function TimelineDay(props: TimelineDayProps) {
  return (
    <div class="relative">
      {/* Date header */}
      <div class="flex items-center gap-3 mb-3">
        {/* Node dot */}
        <div class="relative z-10 w-[15px] flex justify-center">
          <div class="w-3 h-3 rounded-full bg-border" />
        </div>

        {/* Date text */}
        <span class="text-[13px] font-semibold text-fg">
          {props.date}
        </span>

        {/* Entry count badge */}
        {props.entries.length > 1 && (
          <span class="text-[11px] font-medium text-muted bg-surface border border-border rounded-full px-2 py-0.5">
            {props.entries.length} entries
          </span>
        )}
      </div>

      {/* Entries for this day */}
      <div class="ml-[15px] pl-5 border-l border-transparent space-y-2">
        <For each={props.entries}>
          {(entry) => <TimelineEntry entry={entry} />}
        </For>
      </div>
    </div>
  );
}
