import React, { useState, useEffect, useRef } from 'react';

const PixelizeImage = ({ src, alt, className, disableEffect = false, lazy = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy); // Only load immediately if not lazy
  const [error, setError] = useState(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const intersectionObserverRef = useRef(null);

  useEffect(() => {
    if (disableEffect) return () => {}; // Always return a cleanup function

    let gsap;
    let ScrollTrigger;
    let isMounted = true;
    let timer = null;
    let animations = [];

    const loadGSAP = async () => {
      try {
        const gsapModule = await import('gsap');
        const scrollTriggerModule = await import('gsap/ScrollTrigger');
        gsap = gsapModule.default;
        ScrollTrigger = scrollTriggerModule.default;
        gsap.registerPlugin(ScrollTrigger);

        // Check if component is still mounted before proceeding
        if (!isMounted || !isLoaded || !canvasRef.current || !imageRef.current || !containerRef.current) {
          return;
        }

        // Clean up any existing ScrollTrigger
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
          scrollTriggerRef.current = null;
        }

        const calculatePixelSize = (width, height) => {
          const totalPixels = 18; // Target number of pixels
          return Math.sqrt((width * height) / totalPixels);
        };

        const startPixelSize = calculatePixelSize(canvasRef.current.width, canvasRef.current.height);
        const endPixelSize = 1;

        const depixelize = (progress) => {
          if (!isMounted || !canvasRef.current || !imageRef.current) return;
          
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            const currentPixelSize = gsap.utils.interpolate(startPixelSize, endPixelSize, progress);
            ctx.imageSmoothingEnabled = false;
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            const scaledWidth = canvasRef.current.width / currentPixelSize;
            const scaledHeight = canvasRef.current.height / currentPixelSize;

            ctx.drawImage(imageRef.current, 0, 0, scaledWidth, scaledHeight);
            ctx.drawImage(canvasRef.current, 0, 0, scaledWidth, scaledHeight, 0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        };

        const isMobile = window.innerWidth <= 768;

        // Use regular ScrollTrigger without Locomotive Scroll
        const initScrollTrigger = () => {
          if (!isMounted) return;

          scrollTriggerRef.current = ScrollTrigger.create({
            trigger: containerRef.current,
            start: isMobile ? 'top bottom-=15%' : 'top bottom-=20%',
            end: isMobile ? 'top center' : 'top center+=20%',
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (isMounted) depixelize(self.progress);
            },
            onEnter: () => {
              if (!isMounted || !canvasRef.current || !imageRef.current) return;
              // Entering from top - start pixelated animation
              const canvasAnim = gsap.to(canvasRef.current, { opacity: 1, duration: isMobile ? 0.05 : 0.2 });
              const imageAnim = gsap.to(imageRef.current, { opacity: 0, duration: isMobile ? 0.05 : 0.2 });
              animations.push(canvasAnim, imageAnim);
            },
            onLeave: () => {
              if (!isMounted || !canvasRef.current || !imageRef.current) return;
              // Leaving downward - show clear image
              const canvasAnim = gsap.to(canvasRef.current, { opacity: 0, duration: isMobile ? 0.05 : 0.2 });
              const imageAnim = gsap.to(imageRef.current, { opacity: 1, duration: isMobile ? 0.05 : 0.2 });
              animations.push(canvasAnim, imageAnim);
            },
            onEnterBack: () => {
              if (!isMounted || !canvasRef.current || !imageRef.current) return;
              // Re-entering from bottom - start pixelated animation again
              const canvasAnim = gsap.to(canvasRef.current, { opacity: 1, duration: isMobile ? 0.05 : 0.2 });
              const imageAnim = gsap.to(imageRef.current, { opacity: 0, duration: isMobile ? 0.05 : 0.2 });
              animations.push(canvasAnim, imageAnim);
            },
            onLeaveBack: () => {
              if (!isMounted || !canvasRef.current || !imageRef.current) return;
              // Leaving upward - return to pixelated state
              depixelize(0); // Reset to fully pixelated
              const canvasAnim = gsap.to(canvasRef.current, { opacity: 1, duration: isMobile ? 0.05 : 0.2 });
              const imageAnim = gsap.to(imageRef.current, { opacity: 0, duration: isMobile ? 0.05 : 0.2 });
              animations.push(canvasAnim, imageAnim);
            },
          });

          // Refresh ScrollTrigger after creation
          if (isMounted && ScrollTrigger) {
            ScrollTrigger.refresh();
          }
        };

        // Initialize ScrollTrigger with a delay to ensure Locomotive Scroll is ready
        timer = setTimeout(initScrollTrigger, 100);

      } catch (error) {
        console.error('Error loading GSAP:', error);
      }
    };

    loadGSAP();

    // Cleanup function
    return () => {
      isMounted = false;
      
      if (timer) {
        clearTimeout(timer);
      }
      
      // Kill all animations
      animations.forEach(anim => {
        if (anim && anim.kill) {
          anim.kill();
        }
      });
      
      // Kill ScrollTrigger
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [isLoaded, src, disableEffect]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Start loading 200px before the image comes into view
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    intersectionObserverRef.current = observer;

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [lazy, shouldLoad]);

  // Image loading effect - only runs when shouldLoad is true
  useEffect(() => {
    if (!shouldLoad) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
      if (canvasRef.current && imageRef.current && !disableEffect) {
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const calculatePixelSize = (width, height) => {
            const totalPixels = 18;
            return Math.sqrt((width * height) / totalPixels);
          };

          const initialPixelSize = calculatePixelSize(img.width, img.height);
          ctx.imageSmoothingEnabled = false;

          const scaledWidth = img.width / initialPixelSize;
          const scaledHeight = img.height / initialPixelSize;

          ctx.clearRect(0, 0, img.width, img.height);
          ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
          ctx.drawImage(canvasRef.current, 0, 0, scaledWidth, scaledHeight, 0, 0, img.width, img.height);
        }
      }
    };
    img.onerror = () => {
      setError('Failed to load image');
    };
  }, [src, disableEffect, shouldLoad]);

  if (disableEffect) {
    return (
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {!shouldLoad && lazy && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      {shouldLoad && !isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-red-900 flex items-center justify-center text-red-400 text-sm">
          {error}
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover opacity-100"
        style={{ opacity: 1 }}
      />
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover opacity-0"
        style={{ opacity: 0 }}
      />
    </div>
  );
};

export default PixelizeImage;
