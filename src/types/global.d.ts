/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="webworker" />

interface Window {
  workbox: any;
  scrollY: number;
  scrollTo(options: { top: number; behavior: ScrollBehavior }): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  matchMedia(query: string): MediaQueryList;
}

interface Document {
  getElementById(elementId: string): HTMLElement | null;
  documentElement: HTMLElement;
  querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
  querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
  querySelector<E extends Element = Element>(selectors: string): E | null;
}

declare var document: Document;

interface MediaQueryList extends EventTarget {
  matches: boolean;
  media: string;
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null;
  addListener(listener: ((this: MediaQueryList, ev: MediaQueryListEvent) => any)): void;
  removeListener(listener: ((this: MediaQueryList, ev: MediaQueryListEvent) => any)): void;
  addEventListener(type: 'change', listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any): void;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: 'change', listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any): void;
  removeEventListener(type: string, listener: EventListener): void;
  dispatchEvent(event: Event): boolean;
}

interface MediaQueryListEvent extends Event {
  readonly matches: boolean;
  readonly media: string;
  readonly target: MediaQueryList;
}

interface HTMLElement {
  closest(selector: string): HTMLElement | null;
}

interface Element {
  closest(selector: string): Element | null;
}

interface EventTarget {
  value?: string;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.jpeg' {
  const content: any;
  export default content;
}

declare module '*.gif' {
  const content: any;
  export default content;
}

declare module '*.webp' {
  const content: any;
  export default content;
}

declare module '*.mp4' {
  const content: any;
  export default content;
}

declare module '*.webm' {
  const content: any;
  export default content;
} 