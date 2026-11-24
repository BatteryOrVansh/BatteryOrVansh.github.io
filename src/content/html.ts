// Tiny string-templating helpers for build-time rendering (no DOM needed).
import { isTodo, TODO_PREFIX } from './types';

const ESC: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const esc = (value: string): string => value.replace(/[&<>"']/g, (c) => ESC[c] ?? c);

/** Escaped text; TODO(Vansh) placeholders become a visible pending mark. */
export const t = (value: string): string => {
  if (isTodo(value)) {
    const rest = value.slice(TODO_PREFIX.length).replace(/^:\s*/, '');
    return `<span class="todo" title="${esc(value)}">${esc(TODO_PREFIX)}: ${esc(rest)}</span>`;
  }
  return esc(value);
};

/** Fill {placeholders} in a ui string. */
export const fill = (template: string, vars: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));

/** href that is safe to render; TODO links become inert '#'. */
export const href = (value: string): string => (isTodo(value) ? '#' : esc(value));

export const isExternal = (value: string): boolean => /^https?:\/\//.test(value);

export const html = (strings: TemplateStringsArray, ...values: unknown[]): string =>
  strings.reduce((out, str, i) => {
    const v = values[i - 1];
    const s = Array.isArray(v) ? v.join('') : v === false || v == null ? '' : String(v);
    return out + s + str;
  });
