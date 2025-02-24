interface Window {
  scrollY: number;
  scrollTo(options: ScrollToOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

interface ScrollToOptions {
  top?: number;
  left?: number;
  behavior?: 'auto' | 'smooth';
}

interface Document {
  documentElement: HTMLElement;
  querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
  querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
  querySelector<E extends Element = Element>(selectors: string): E | null;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

interface HTMLElement extends Element {
  classList: DOMTokenList;
  style: CSSStyleDeclaration;
  closest(selector: string): HTMLElement | null;
}

interface DOMTokenList {
  add(...tokens: string[]): void;
  remove(...tokens: string[]): void;
  contains(token: string): boolean;
  toggle(token: string, force?: boolean): boolean;
  replace(oldToken: string, newToken: string): boolean;
}

declare var document: Document;
declare var window: Window; 