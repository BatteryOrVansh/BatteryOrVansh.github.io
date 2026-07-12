/**
 * Bottom-of-hero "scroll to explore" cue, shown on fresh page load. No JS —
 * it scrolls out of view naturally with the rest of the hero content, and
 * the bounce is a plain CSS keyframe so it costs nothing on the main thread.
 */
export function ScrollCue() {
  return (
    <div
      aria-hidden
      className="animate-reveal-up pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
      style={{ animationDelay: "700ms" }}
    >
      <div className="flex flex-col items-center gap-2 text-fg-muted">
        <span className="font-headline text-[11px] font-medium uppercase tracking-[0.3em]">Scroll</span>
        <svg
          className="animate-scroll-bounce h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4v14M6 13l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
