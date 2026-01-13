import { A } from "@solidjs/router";

interface TilCardProps {
  title: string;
  date: string;
  href: string;
  category: "tech" | "life";
}

export default function TilCard(props: TilCardProps) {
  return (
    <A
      href={props.href}
      class="entry-card group block p-5"
      data-category={props.category}
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-fg leading-snug group-hover:text-tech transition-colors">
            {props.title}
          </h3>
          <div class="flex items-center gap-3 mt-3">
            <span class={`tag ${props.category === "tech" ? "tag-tech" : "tag-life"}`}>
              {props.category}
            </span>
            <span class="text-[13px] text-muted">{props.date}</span>
          </div>
        </div>
        <div class="mt-1 text-muted group-hover:text-tech transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </A>
  );
}
