declare module 'locomotive-scroll' {
  export interface LocomotiveScrollOptions {
    el?: HTMLElement;
    smooth?: boolean;
    lerp?: number;
    multiplier?: number;
    class?: string;
    scrollbarContainer?: boolean | HTMLElement;
    scrollFromAnywhere?: boolean;
    getDirection?: boolean;
    getSpeed?: boolean;
    inertia?: number;
    tablet?: {
      smooth?: boolean;
      breakpoint?: number;
    };
    smartphone?: {
      smooth?: boolean;
      breakpoint?: number;
    };
  }

  export default class LocomotiveScroll {
    constructor(options: LocomotiveScrollOptions);
    init(): void;
    destroy(): void;
    update(): void;
    scrollTo(target: string | number | HTMLElement, options?: any): void;
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
  }
}
