// Shape of content/site.json. Every word on the site lives in that file.

export interface Link {
  label: string;
  href: string;
  value?: string;
}

export interface Project {
  id: string;
  name: string;
  year: string;
  tagline: string;
  summary: string;
  role: string;
  stack: string[];
  links: Link[];
}

export interface SkillGroup {
  level: 1 | 2 | 3;
  name: string;
  note: string;
  items: string[];
}

export interface BootSlide {
  id: 'boot';
  num: string;
  title: string;
  intro: {
    lines: string[];
    chargedLabel: string;
    question: string;
    enterSound: string;
    enterSilent: string;
    skip: string;
  };
  kicker: string;
  oneLiner: string;
  annotation: string;
  scribble: string;
}

export interface AboutSlide {
  id: 'about';
  num: string;
  title: string;
  heading: string;
  body: string[];
  facts: { label: string; value: string }[];
  logTitle: string;
  log: { when: string; what: string; note: string }[];
  joining: { label: string; text: string; todo?: string };
  todo?: string;
}

export interface WorkSlide {
  id: 'work';
  num: string;
  title: string;
  heading: string;
  caption: string;
  projects: Project[];
}

export interface ToolkitSlide {
  id: 'toolkit';
  num: string;
  title: string;
  heading: string;
  caption: string;
  groups: SkillGroup[];
  todo?: string;
}

export interface NowSlide {
  id: 'now';
  num: string;
  title: string;
  heading: string;
  now: { label: string; items: { kind: string; text: string }[] };
  next: { label: string; date: string; title: string; text: string; todo?: string };
  updated: string;
}

export interface ContactSlide {
  id: 'contact';
  num: string;
  title: string;
  heading: string;
  body: string;
  links: Link[];
  footer: string;
}

export interface Slides {
  boot: BootSlide;
  about: AboutSlide;
  work: WorkSlide;
  toolkit: ToolkitSlide;
  now: NowSlide;
  contact: ContactSlide;
}

export type SlideId = keyof Slides;

export interface Site {
  meta: {
    title: string;
    description: string;
    url: string;
    locale: string;
    themeColor: string;
    ogImage: string;
    ogImageAlt: string;
  };
  person: {
    name: string;
    firstName: string;
    lastName: string;
    handle: string;
    location: string;
    email: string;
  };
  ui: Record<string, string>;
  slides: Slides;
  order: SlideId[];
  player: Record<string, string>;
  notFound: { title: string; code: string; heading: string; body: string; back: string };
}

/** Strings that start with this are placeholders Vansh still has to fill in. */
export const TODO_PREFIX = 'TODO(Vansh)';

export const isTodo = (value: string | undefined): boolean =>
  typeof value === 'string' && value.startsWith(TODO_PREFIX);
