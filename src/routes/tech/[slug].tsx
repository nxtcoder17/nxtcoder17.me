import { Show } from "solid-js";
import { A, createAsync, cache, useParams } from "@solidjs/router";
import { formatDisplayDate } from "~/lib/types";
import { getTil } from "~/lib/content.server";

const loadTil = cache(async (slug: string) => {
  "use server";
  return getTil("tech", slug);
}, "tech-til");

export const route = {
  load: ({ params }: { params: { slug: string } }) => loadTil(params.slug),
};

export default function TechTil() {
  const params = useParams();
  const til = createAsync(() => loadTil(params.slug));

  return (
    <Show when={til()} fallback={<NotFound />}>
      {(t) => (
        <article>
          {/* Back navigation */}
          <A
            href="/tech"
            class="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-tech transition-colors mb-8 group"
          >
            <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tech
          </A>

          {/* Article header */}
          <header class="mb-10">
            <div class="flex items-center gap-3 mb-4">
              <span class="tag tag-tech">Tech</span>
              <span class="text-[13px] text-muted">{formatDisplayDate(t().date)}</span>
              <span class="text-muted">·</span>
              <span class="text-[13px] text-muted">{t().readingTime}</span>
            </div>
            <h1 class="text-2xl font-bold tracking-tight leading-snug">
              {t().title}
            </h1>
          </header>

          {/* Article content */}
          <div class="prose" innerHTML={t().content} />

          {/* Navigation */}
          <nav class="mt-16 pt-8 border-t border-border">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Show when={t().navigation.prev}>
                  {(prev) => (
                    <A href={`/tech/${prev().slug}`} class="nav-card group block">
                      <div class="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">
                        Previous
                      </div>
                      <p class="text-[14px] font-medium text-fg group-hover:text-tech transition-colors line-clamp-2 leading-snug">
                        {prev().title}
                      </p>
                    </A>
                  )}
                </Show>
              </div>
              <div class="text-right">
                <Show when={t().navigation.next}>
                  {(next) => (
                    <A href={`/tech/${next().slug}`} class="nav-card group block">
                      <div class="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">
                        Next
                      </div>
                      <p class="text-[14px] font-medium text-fg group-hover:text-tech transition-colors line-clamp-2 leading-snug">
                        {next().title}
                      </p>
                    </A>
                  )}
                </Show>
              </div>
            </div>
          </nav>
        </article>
      )}
    </Show>
  );
}

function NotFound() {
  return (
    <div class="text-center py-20">
      <h1 class="text-xl font-bold mb-3">Entry Not Found</h1>
      <p class="text-muted mb-6">This entry doesn't exist.</p>
      <A href="/tech" class="btn">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Tech
      </A>
    </div>
  );
}
