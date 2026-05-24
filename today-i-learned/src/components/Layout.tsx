import { A, createAsync, cache } from "@solidjs/router";
import { JSX, createSignal, Show, onMount, onCleanup } from "solid-js";
import ThemeSwitcher from "./ThemeSwitcher";
import Terminal from "./Terminal";
import { getRecentTils } from "~/lib/content.server";

interface LayoutProps {
  children: JSX.Element;
}

const loadEntries = cache(async () => {
  "use server";
  return getRecentTils(100);
}, "terminal-entries");

export default function Layout(props: LayoutProps) {
  const [isTerminalOpen, setIsTerminalOpen] = createSignal(false);
  const [terminalWidth, setTerminalWidth] = createSignal(40); // percentage
  const [isDragging, setIsDragging] = createSignal(false);
  const entries = createAsync(() => loadEntries());

  // Resize handling
  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging()) return;
      const percentage = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
      setTerminalWidth(Math.max(30, Math.min(70, percentage)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    onCleanup(() => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    });
  });

  return (
    <div class="h-screen flex overflow-hidden">
      {/* Main content column */}
      <div
        class="flex flex-col overflow-hidden transition-all duration-300"
        style={{
          width: isTerminalOpen() ? `${100 - terminalWidth()}%` : "100%",
        }}
      >
        {/* Header - only above main content */}
        <header class="flex-shrink-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
          <nav class="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
            {/* Logo */}
            <A
              href="/"
              class="font-bold text-fg hover:text-tech transition-colors"
            >
              TIL
            </A>

            <div class="flex items-center gap-2">
              {/* Terminal toggle */}
              <button
                onClick={() => setIsTerminalOpen(!isTerminalOpen())}
                class={`p-2 rounded-lg transition-colors ${
                  isTerminalOpen()
                    ? "text-tech bg-tech/10"
                    : "text-muted hover:text-fg hover:bg-surface"
                }`}
                title="Toggle Terminal (⌘+`)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <ThemeSwitcher />
            </div>
          </nav>
        </header>

        {/* Scrollable main content */}
        <main class="flex-1 overflow-y-auto">
          <div class="max-w-3xl mx-auto px-6 py-12">
            {props.children}
          </div>

          {/* Footer inside main scroll area */}
          <footer class="border-t border-border">
            <div class="max-w-3xl mx-auto px-6 py-8">
              <div class="flex items-center justify-between">
                <p class="text-[13px] text-muted">
                  Learning something new, every day.
                </p>
                <a
                  href="https://github.com/nxtcoder17/nxtcoder17.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-1.5 text-[13px] text-muted hover:text-fg transition-colors"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Source
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Terminal panel */}
      <Show when={isTerminalOpen()}>
        <div
          class="flex h-full flex-shrink-0"
          style={{ width: `${terminalWidth()}%` }}
        >
          {/* Resizable divider */}
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            class={`w-1 h-full cursor-ew-resize flex-shrink-0 transition-colors ${
              isDragging() ? "bg-tech" : "bg-border hover:bg-tech/50"
            }`}
          />

          {/* Terminal content */}
          <Terminal
            onClose={() => setIsTerminalOpen(false)}
            entries={entries() || []}
          />
        </div>
      </Show>
    </div>
  );
}
