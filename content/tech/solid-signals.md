---
title: Understanding SolidJS Signals
date: 2026-01-10
---

SolidJS signals are the foundation of its reactivity system. Unlike React's useState, signals are not tied to component renders.

## Basic Usage

```tsx
import { createSignal } from "solid-js";

const [count, setCount] = createSignal(0);

// Reading: count()
// Writing: setCount(1) or setCount(c => c + 1)
```

## Key Difference from React

In React, state updates trigger re-renders. In Solid, signals trigger fine-grained updates to only the DOM nodes that use them.

```tsx
// This function only runs ONCE
function Counter() {
  const [count, setCount] = createSignal(0);

  console.log("This logs only once!");

  return <button onClick={() => setCount(c => c + 1)}>
    {count()} {/* Only this expression updates */}
  </button>;
}
```

## Mental Model

Think of signals as:
- **Getter function** - `count()` reads the current value
- **Setter function** - `setCount()` updates and notifies subscribers
- **Reactive graph** - Solid tracks which computations depend on which signals

This makes Solid incredibly fast - no virtual DOM diffing, just direct DOM updates.
