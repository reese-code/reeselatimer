import { useEffect, useRef } from 'react';

interface LocomotiveScrollInstance {
  init: () => void;
  destroy: () => void;
  update: () => void;
  scrollTo: (target: string | number, options?: any) => void;
}

export const useLocomotiveScroll = (start: boolean = true) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const locomotiveScrollRef = useRef<LocomotiveScrollInstance | null>(null);

  useEffect(() => {
    if (!start) return;

    let LocomotiveScroll: any;

    const initLocomotiveScroll = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const LocomotiveScrollModule = await import('locomotive-scroll');
        LocomotiveScroll = LocomotiveScrollModule.default;

        if (scrollRef.current && LocomotiveScroll) {
          locomotiveScrollRef.current = new LocomotiveScroll({
            el: scrollRef.current,
            smooth: true,
            lerp: 0.1,
            multiplier: 1,
            class: 'is-revealed',
            scrollbarContainer: false,
            scrollFromAnywhere: true,
          });

          // Update locomotive scroll when images load
          const images = scrollRef.current.querySelectorAll('img');
          images.forEach((img) => {
            if (img.complete) {
              locomotiveScrollRef.current?.update();
            } else {
              img.addEventListener('load', () => {
                locomotiveScrollRef.current?.update();
              });
            }
          });
        }
      } catch (error) {
        console.error('Failed to initialize Locomotive Scroll:', error);
      }
    };

    // Initialize after a small delay to ensure DOM is ready
    const timer = setTimeout(initLocomotiveScroll, 100);

    return () => {
      clearTimeout(timer);
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy();
        locomotiveScrollRef.current = null;
      }
    };
  }, [start]);

  const updateScroll = () => {
    locomotiveScrollRef.current?.update();
  };

  return { scrollRef, updateScroll, locomotiveScroll: locomotiveScrollRef.current };
};
