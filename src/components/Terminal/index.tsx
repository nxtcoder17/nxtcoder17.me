import { createSignal, createEffect, For, onMount, onCleanup } from "solid-js";
import { executeCommand, type CommandOutput } from "./commands";
import type { TilEntry } from "~/lib/content.server";

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: TilEntry[];
}

interface HistoryEntry {
  command: string;
  output: CommandOutput;
}

export default function Terminal(props: TerminalProps) {
  const [input, setInput] = createSignal("");
  const [history, setHistory] = createSignal<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = createSignal<string[]>([]);
  const [historyIndex, setHistoryIndex] = createSignal(-1);
  const [cwd, setCwd] = createSignal("~");
  const [width, setWidth] = createSignal(400);
  const [isDragging, setIsDragging] = createSignal(false);

  let inputRef: HTMLInputElement | undefined;
  let containerRef: HTMLDivElement | undefined;

  // Focus input when terminal opens
  createEffect(() => {
    if (props.isOpen && inputRef) {
      setTimeout(() => inputRef?.focus(), 100);
    }
  });

  // Scroll to bottom on new output
  createEffect(() => {
    history();
    input(); // Also scroll when typing
    if (containerRef) {
      containerRef.scrollTop = containerRef.scrollHeight;
    }
  });

  // Keyboard shortcut to close (Escape)
  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && props.isOpen) {
        props.onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });

  // Resize handling
  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging()) return;
      const newWidth = window.innerWidth - e.clientX;
      setWidth(Math.max(300, Math.min(800, newWidth)));
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

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const cmd = input().trim();
    if (!cmd) return;

    // Add to command history
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    // Handle clear specially
    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    // Execute command
    const result = await executeCommand(cmd, props.entries, cwd());

    // Update cwd if cd command
    if (result.newCwd) {
      setCwd(result.newCwd);
    }

    setHistory((prev) => [...prev, { command: cmd, output: result }]);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const cmdHist = commandHistory();

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHist.length > 0) {
        const newIndex =
          historyIndex() === -1
            ? cmdHist.length - 1
            : Math.max(0, historyIndex() - 1);
        setHistoryIndex(newIndex);
        setInput(cmdHist[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
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
    }
  };

  // Click anywhere in terminal to focus input
  const handleContainerClick = () => {
    inputRef?.focus();
  };

  return (
    <div
      class={`fixed top-0 right-0 h-full bg-bg z-50 transform transition-transform duration-300 flex ${
        props.isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: `${width()}px` }}
    >
      {/* Resizable divider */}
      <div
        onMouseDown={handleMouseDown}
        class={`w-1 h-full cursor-ew-resize hover:bg-tech/50 transition-colors ${
          isDragging() ? "bg-tech" : "bg-border"
        }`}
      />

      {/* Terminal content */}
      <div class="flex-1 flex flex-col min-w-0">
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
          </div>

          {/* History */}
          <For each={history()}>
            {(entry) => (
              <div class="mb-3">
                {/* Command line */}
                <div class="flex gap-2 text-fg flex-wrap">
                  <span class="text-tech">{entry.output.newCwd || cwd()}</span>
                  <span class="text-muted">$</span>
                  <span>{entry.command}</span>
                </div>
                {/* Output */}
                {entry.output.html ? (
                  <div class="mt-1" innerHTML={entry.output.html} />
                ) : (
                  <div
                    class={`mt-1 whitespace-pre-wrap ${
                      entry.output.type === "error" ? "text-life" : "text-muted"
                    }`}
                  >
                    {entry.output.text}
                  </div>
                )}
              </div>
            )}
          </For>

          {/* Current prompt - inline with history */}
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
        </div>
      </div>
    </div>
  );
}
