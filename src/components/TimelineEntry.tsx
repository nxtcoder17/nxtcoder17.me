import { A } from "@solidjs/router";
import type { TilEntry } from "~/lib/content.server";

interface TimelineEntryProps {
  entry: TilEntry;
}

export default function TimelineEntry(props: TimelineEntryProps) {
  const isTech = () => props.entry.category === "tech";

  return (
    <A
      href={`/${props.entry.category}/${props.entry.slug}`}
      class="group flex items-center gap-3 py-2.5 px-3 -ml-3 rounded-lg hover:bg-surface transition-colors"
    >
      {/* Category dot */}
      <span
        class={`w-2 h-2 rounded-full flex-shrink-0 transition-transform group-hover:scale-125 ${
          isTech() ? "bg-tech" : "bg-life"
        }`}
      />

      {/* Title */}
      <span class="flex-1 text-[14px] text-fg font-medium truncate group-hover:text-tech transition-colors">
        {props.entry.title}
      </span>

      {/* Category tag */}
      <span
        class={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
          isTech()
            ? "bg-tech-subtle text-tech"
            : "bg-life-subtle text-life"
        }`}
      >
        {props.entry.category}
      </span>

      {/* Arrow (visible on hover) */}
      <svg
        class="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transform -translate-x-1 group-hover:translate-x-0 transition-all"
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
    </A>
  );
}
