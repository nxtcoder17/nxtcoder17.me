import { A } from "@solidjs/router";
import type { TilEntry } from "~/lib/content.server";

interface SpotlightProps {
  entry: TilEntry;
}

export default function Spotlight(props: SpotlightProps) {
  const isTech = () => props.entry.category === "tech";

  return (
    <section class="relative">
      {/* Section label */}
      <div class="flex items-center gap-3 mb-4">
        <span class="text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
          Latest
        </span>
        <div class="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
      </div>

      {/* Spotlight card */}
      <A
        href={`/${props.entry.category}/${props.entry.slug}`}
        class="group block relative"
      >
        {/* Decorative border */}
        <div
          class={`absolute -inset-px rounded-lg bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isTech()
              ? "from-tech/30 via-transparent to-tech/10"
              : "from-life/30 via-transparent to-life/10"
          }`}
        />

        <div class="relative bg-surface border border-border rounded-lg p-4 group-hover:border-transparent transition-colors">
          {/* Header row: category + date + title */}
          <div class="flex items-center gap-3 mb-2">
            <span
              class={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                isTech()
                  ? "bg-tech-subtle text-tech"
                  : "bg-life-subtle text-life"
              }`}
            >
              <span
                class={`w-1.5 h-1.5 rounded-full ${
                  isTech() ? "bg-tech" : "bg-life"
                }`}
              />
              {props.entry.category}
            </span>
            <span class="text-[12px] text-muted">{formatDate(props.entry.date)}</span>
          </div>

          {/* Title + arrow on same row */}
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-lg font-bold text-fg leading-snug group-hover:text-tech transition-colors">
              {props.entry.title}
            </h2>

            {/* Arrow indicator */}
            <svg
              class="w-4 h-4 text-muted group-hover:text-tech group-hover:translate-x-1 transition-all flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </A>
    </section>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
