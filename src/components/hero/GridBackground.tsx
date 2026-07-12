/**
 * Faint drifting grid, awwards/21st.dev-style, kept inside the site's
 * existing border-token color at very low opacity so it reads as structure
 * rather than decoration. The wrapper is oversized and drifts by exactly one
 * grid cell (see .animate-grid-drift in globals.css) so the loop is
 * seamless, and it's transform-only so it costs nothing beyond compositing.
 * A radial mask fades it out toward the edges instead of hard-cutting.
 */
export function GridBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-40 overflow-hidden">
      <div
        className="animate-grid-drift absolute -inset-14"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,10,10,0.07) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(10,10,10,0.07) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(circle at 50% 35%, black 0%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 35%, black 0%, transparent 65%)",
        }}
      />
    </div>
  );
}
