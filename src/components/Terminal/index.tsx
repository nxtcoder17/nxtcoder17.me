import { createSignal, createEffect, For, Show, onMount, onCleanup } from "solid-js";
import { executeCommand, type CommandOutput } from "./commands";
import type { TilEntry } from "~/lib/content.server";

interface TerminalProps {
  onClose: () => void;
  entries: TilEntry[];
}

interface HistoryEntry {
  command: string;
  output: CommandOutput;
}

const COMMANDS = ["help", "clear", "ls", "cat", "grep", "cd"];
const CD_TARGETS = ["~", "tech", "life"];

export default function Terminal(props: TerminalProps) {
  const [input, setInput] = createSignal("");
  const [history, setHistory] = createSignal<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = createSignal<string[]>([]);
  const [historyIndex, setHistoryIndex] = createSignal(-1);
  const [cwd, setCwd] = createSignal("~");

  // Autocomplete state
  const [suggestions, setSuggestions] = createSignal<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = createSignal(-1);

  let inputRef: HTMLInputElement | undefined;
  let containerRef: HTMLDivElement | undefined;

  // Focus input on mount
  onMount(() => {
    setTimeout(() => inputRef?.focus(), 100);
  });

  // Scroll to bottom helper
  const scrollToBottom = () => {
    if (containerRef) {
      containerRef.scrollTop = containerRef.scrollHeight;
    }
  };

  // Clear suggestions when input changes (except from tab completion)
  let isTabCompleting = false;
  createEffect(() => {
    input();
    if (!isTabCompleting) {
      setSuggestions([]);
      setSuggestionIndex(-1);
    }
  });

  // Keyboard shortcut to close (Escape)
  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        props.onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });

  // Get completions based on current input
  const getCompletions = (text: string): string[] => {
    const parts = text.split(/\s+/);
    const cmd = parts[0]?.toLowerCase() || "";
    const arg = parts.slice(1).join(" ");

    if (!text.trim()) {
      return COMMANDS;
    }

    if (parts.length === 1) {
      return COMMANDS.filter((c) => c.startsWith(cmd));
    }

    switch (cmd) {
      case "cat":
      case "grep": {
        const slugs = props.entries.map((e) => e.slug);
        if (!arg) return slugs;
        return slugs.filter((s) => s.includes(arg));
      }
      case "cd": {
        if (!arg) return CD_TARGETS;
        return CD_TARGETS.filter((t) => t.includes(arg));
      }
      case "ls": {
        const lsFlags = ["-l"];
        if (!arg) return lsFlags;
        return lsFlags.filter((f) => f.startsWith(arg));
      }
      default:
        return [];
    }
  };

  const applyCompletion = (completion: string) => {
    const parts = input().split(/\s+/);

    if (parts.length <= 1) {
      setInput(completion + " ");
    } else {
      parts[parts.length - 1] = completion;
      setInput(parts.join(" ") + " ");
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const cmd = input().trim();
    if (!cmd) return;

    setSuggestions([]);
    setSuggestionIndex(-1);

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const result = await executeCommand(cmd, props.entries, cwd());

    if (result.newCwd) {
      setCwd(result.newCwd);
    }

    setHistory((prev) => [...prev, { command: cmd, output: result }]);
    setInput("");

    // Scroll after content renders (multiple attempts for async content/images)
    requestAnimationFrame(scrollToBottom);
    setTimeout(scrollToBottom, 100);
    setTimeout(scrollToBottom, 300);
    setTimeout(scrollToBottom, 500);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const cmdHist = commandHistory();

    if (e.key === "Tab") {
      e.preventDefault();
      isTabCompleting = true;

      const currentSuggestions = suggestions();

      if (currentSuggestions.length === 0) {
        const completions = getCompletions(input());
        if (completions.length === 1) {
          applyCompletion(completions[0]);
        } else if (completions.length > 1) {
          setSuggestions(completions);
          setSuggestionIndex(0);
          applyCompletion(completions[0]);
        }
      } else {
        const nextIndex = (suggestionIndex() + 1) % currentSuggestions.length;
        setSuggestionIndex(nextIndex);
        applyCompletion(currentSuggestions[nextIndex]);
      }

      setTimeout(() => {
        isTabCompleting = false;
      }, 0);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSuggestions([]);
      if (cmdHist.length > 0) {
        const newIndex =
          historyIndex() === -1
            ? cmdHist.length - 1
            : Math.max(0, historyIndex() - 1);
        setHistoryIndex(newIndex);
        setInput(cmdHist[newIndex]);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSuggestions([]);
      if (historyIndex() !== -1) {
        const newIndex = historyIndex() + 1;
        if (newIndex >= cmdHist.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(cmdHist[newIndex]);
        }
      }
      return;
    }
  };

  const handleContainerClick = () => {
    // Only focus if no text is selected (allows copy/paste)
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      inputRef?.focus();
    }
  };

  return (
    <div class="flex-1 flex flex-col min-w-0 bg-bg">
      {/* Header */}
      <div class="flex items-center justify-between px-4 h-14 border-b border-border flex-shrink-0">
        <span class="text-sm font-medium text-fg">Terminal</span>
        <button
          onClick={props.onClose}
          class="p-1.5 text-muted hover:text-fg hover:bg-surface rounded transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable terminal area */}
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        class="flex-1 overflow-y-auto p-4 font-mono text-sm cursor-text"
      >
        {/* Welcome message */}
        <div class="text-muted mb-4">
          Welcome to TIL Terminal. Type <span class="text-tech">help</span> for commands.
          <span class="text-muted/60 text-xs block mt-1">Tab for autocomplete, ↑↓ for history, Esc to close</span>
        </div>

        {/* History */}
        <For each={history()}>
          {(entry) => (
            <div class="mb-3">
              <div class="flex gap-2 text-fg flex-wrap">
                <span class="text-tech">{entry.output.newCwd || cwd()}</span>
                <span class="text-muted">$</span>
                <span>{entry.command}</span>
              </div>
              {entry.output.html ? (
                <div class="mt-1" innerHTML={entry.output.html} />
              ) : (
                <div
                  class={`mt-1 whitespace-pre-wrap ${
                    entry.output.type === "error" ? "text-red-400" : "text-muted"
                  }`}
                >
                  {entry.output.text}
                </div>
              )}
            </div>
          )}
        </For>

        {/* Current prompt */}
        <div class="relative">
          <form onSubmit={handleSubmit} class="flex gap-2 items-start flex-wrap">
            <span class="text-tech">{cwd()}</span>
            <span class="text-muted">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input()}
              onInput={(e) => setInput(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              class="flex-1 bg-transparent outline-none text-fg min-w-[100px]"
              autocomplete="off"
              spellcheck={false}
            />
          </form>

          <Show when={suggestions().length > 1}>
            <div class="mt-1 text-xs text-muted/60">
              {suggestions().map((s, i) => (
                <span class={i === suggestionIndex() ? "text-tech" : ""}>
                  {s}{i < suggestions().length - 1 ? "  " : ""}
                </span>
              ))}
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
