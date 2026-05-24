import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <div class="text-center py-20">
      <div class="text-8xl font-bold gradient-text mb-4">404</div>
      <h1 class="text-2xl font-semibold mb-2">Page not found</h1>
      <p class="text-muted mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <A
        href="/"
        class="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Go home
      </A>
    </div>
  );
}
