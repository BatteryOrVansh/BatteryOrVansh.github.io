/**
 * Awwards/21st.dev-style ambient aurora wash — a few large, heavily-blurred
 * gradient blobs drifting slowly behind the whole Hero page. Pure CSS
 * transform/opacity keyframes (see globals.css .animate-aurora-*), so it's
 * compositor-only and costs nothing on the main thread regardless of scroll
 * length. Stays within the red/black/white palette — no new accent color.
 */
export function AnimatedGradientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-30 overflow-hidden">
      <div className="animate-aurora-1 absolute left-[10%] top-[-10%] h-[60vh] w-[60vh] rounded-full bg-red opacity-[0.10] blur-[110px]" />
      <div className="animate-aurora-2 absolute right-[-5%] top-[25%] h-[50vh] w-[50vh] rounded-full bg-red-glow opacity-[0.10] blur-[100px]" />
      <div className="animate-aurora-3 absolute bottom-[-10%] left-[15%] h-[55vh] w-[55vh] rounded-full bg-fg opacity-[0.04] blur-[120px]" />
    </div>
  );
}
