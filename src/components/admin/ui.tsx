export const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-fg-muted/60 transition focus:border-red focus:outline-none focus:ring-1 focus:ring-red";

export const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fg-muted";

export const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-red px-4 py-2 text-sm font-semibold text-bg transition duration-200 ease-[var(--ease-google)] hover:bg-red-glow disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium text-fg-muted transition duration-200 ease-[var(--ease-google)] hover:border-red-dim hover:text-fg disabled:cursor-not-allowed disabled:opacity-50";

export const dangerButtonClass =
  "inline-flex items-center justify-center rounded-full border border-red-dim px-4 py-2 text-sm font-medium text-red transition duration-200 ease-[var(--ease-google)] hover:bg-red-dim/20 disabled:cursor-not-allowed disabled:opacity-50";

export function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-bg-elevated p-6 sm:p-8">
      <h2 className="font-headline text-xl font-bold">{title}</h2>
      {description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function StatusMessage({ message, tone }: { message: string; tone: "error" | "success" }) {
  return (
    <p
      role="status"
      className={`mt-4 text-sm ${tone === "error" ? "text-red" : "text-fg"}`}
    >
      {message}
    </p>
  );
}
