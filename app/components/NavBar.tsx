import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { TransitionLink } from "./PageTransition";
import { useLocation } from "@remix-run/react";

type NavBarProps = {
  title?: string;
  contactText?: string;
  isHomePage?: boolean;
  textColor?: string;
  forceTransparent?: boolean;
  useGradient?: boolean;
};

export default function NavBar({ 
  title = "Reese Latimer •", 
  contactText = "Work together",
  isHomePage = false,
  textColor = "text-hero-white",
  forceTransparent = false,
  useGradient = false
}: NavBarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [scrollReady, setScrollReady] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dynamically load ScrollTrigger
    import("gsap/ScrollTrigger").then((module) => {
      const ScrollTrigger = module.default || module;
      gsap.registerPlugin(ScrollTrigger);
      setScrollReady(true);
    });
  }, []);

  useEffect(() => {
    if (!scrollReady || !navRef.current) return;

    // Only set up scroll animations on home page
    if (isHomePage) {
      const handleScroll = () => {
        const heroSection = document.querySelector('section#hero');
        if (!heroSection || !navRef.current) return;

        const heroRect = heroSection.getBoundingClientRect();
        const heroBottom = heroRect.bottom;
        
        // Update scroll state for navbar positioning
        const scrolledPastHero = heroBottom <= 80;
        setIsScrolledPastHero(scrolledPastHero);
        
        // Hide navbar background when in hero section, show when scrolled past
        if (scrolledPastHero) {
          // Show navbar background when scrolled past hero
          navRef.current.style.backgroundColor = 'rgba(107, 114, 128, 0.5)';
          navRef.current.style.backdropFilter = 'blur(12px)';
        } else {
          // Hide navbar background when in hero section
          navRef.current.style.backgroundColor = 'transparent';
          navRef.current.style.backdropFilter = 'none';
        }
      };

      // Add scroll listener
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      // For non-home pages, always show the background
      if (navRef.current && !forceTransparent) {
        navRef.current.style.backgroundColor = 'rgba(107, 114, 128, 0.5)';
        navRef.current.style.backdropFilter = 'blur(12px)';
      } else if (navRef.current && forceTransparent) {
        navRef.current.style.backgroundColor = 'transparent';
        navRef.current.style.backdropFilter = 'none';
      }
    }
    
  }, [scrollReady, isHomePage, textColor, forceTransparent]);

  /**
   * HERO LOGO → NAVBAR LOGO ANIMATION
   * This copies the Studio RO pattern:
   * - Uses the hero section (".hero") and #hero-logo as the moving element
   * - Uses #nav-logo-placeholder in the navbar center as the target
   * - Moves and scales the hero logo straight up into the nav center and keeps it there
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isHomePage) return;

    let retryCount = 0;
    const maxRetries = 10;

    const initializeAnimation = () => {
      const hero = document.querySelector(".hero") as HTMLElement | null;
      const heroLogo = document.querySelector("#hero-logo") as HTMLElement | null;
      const navPlaceholder = document.querySelector("#nav-logo-placeholder") as HTMLElement | null;

      if (!hero || !heroLogo || !navPlaceholder) {
        retryCount++;
        if (retryCount < maxRetries) {
          setTimeout(initializeAnimation, 200);
          return;
        } else {
          console.warn("Required DOM elements not found for logo animation after retries");
          return;
        }
      }

      const originalFontSize = heroLogo.style.fontSize || "";
      const originalLineHeight = heroLogo.style.lineHeight || "";
      const originalColor = heroLogo.style.color || "";

      let isFixed = false;
      let hasLockedFrom = false;
      let rafId: number | null = null;

      let lastProgress = 0;
      let targetProgress = 0;

      const heroStartY = 0;
      const heroEndY = hero.offsetHeight * 3;

      let fromRect: DOMRect | null = null;

      const finalTextHeight = () => (window.innerWidth < 768 ? 28 : 40); // match nav text size
      const getScale = (fromHeight: number) =>
        finalTextHeight() / Math.max(fromHeight, 1);

      const getPad = (el: HTMLElement) => {
        const cs = window.getComputedStyle(el);
        const pl = parseFloat(cs.paddingLeft || "0") || 0;
        const pt = parseFloat(cs.paddingTop || "0") || 0;
        const pr = parseFloat(cs.paddingRight || "0") || 0;
        const pb = parseFloat(cs.paddingBottom || "0") || 0;
        return { pl, pt, pr, pb };
      };

      const getTargetCenter = () => {
        const n = navPlaceholder.getBoundingClientRect();
        const currentMobile = window.innerWidth < 1024;

        if (currentMobile) {
          const pads = getPad(navPlaceholder);
          const finalH = finalTextHeight();
          const aspect = fromRect ? fromRect.width / fromRect.height : 5;
          const finalW = aspect * finalH;

          const x = n.left + pads.pl + finalW / 2;
          const y = n.top + pads.pt + finalH / 2;
          return { x, y };
        }

        return {
          x: n.left + n.width / 2,
          y: n.top + n.height / 2,
        };
      };

      const clearFixedLayer = () => {
        isFixed = false;
        hasLockedFrom = false;
        fromRect = null;
        heroLogo.style.position = "";
        heroLogo.style.left = "";
        heroLogo.style.top = "";
        heroLogo.style.width = "";
        heroLogo.style.height = "";
        heroLogo.style.zIndex = "";
        heroLogo.style.transform = "";
        heroLogo.style.fontSize = originalFontSize;
        heroLogo.style.lineHeight = originalLineHeight;
        heroLogo.style.color = originalColor || "#FFFFFF";
      };

      const lockFromRect = () => {
        const r = heroLogo.getBoundingClientRect();
        fromRect = r;
        hasLockedFrom = true;
        if (!isFixed) {
          isFixed = true;
          heroLogo.style.position = "fixed";
          heroLogo.style.left = `${r.left}px`;
          heroLogo.style.top = `${r.top}px`;
          heroLogo.style.width = `${r.width}px`;
          heroLogo.style.height = `${r.height}px`;
          heroLogo.style.zIndex = "1002"; // above nav container
          heroLogo.style.transformOrigin = "center center";
        }
      };

      const applyFinalStylesWhileFixed = () => {
        heroLogo.style.fontSize = `${finalTextHeight()}px`;
        heroLogo.style.lineHeight = "1";
      };

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const animate = () => {
        rafId = null;

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isMobileSafari =
          isIOS &&
          /Safari/.test(navigator.userAgent) &&
          !/CriOS|FxiOS/.test(navigator.userAgent);

        const alpha = isMobileSafari && window.innerWidth < 1024 ? 0.4 : 0.22;
        const pLinear =
          lastProgress + (targetProgress - lastProgress) * alpha;
        lastProgress = pLinear;
        const p = easeOutCubic(pLinear);

        // Between states: move and scale
        if (pLinear > 0 && pLinear < 1) {
          if (!isFixed || !hasLockedFrom) lockFromRect();

          const to = getTargetCenter();
          const f = fromRect!;
          const cx = f.left + f.width / 1;
          const cy = f.top + f.height / 2;
          const tx = (to.x - cx) * p;
          const ty = (to.y - cy) * p;
          const s = 1 + (getScale(f.height) - 1) * p;

          const transform = isMobileSafari
            ? `translate3d(${tx}px, ${ty}px, 0) scale(${s})`
            : `translate(${tx}px, ${ty}px) scale(${s})`;
          heroLogo.style.transform = transform;
        }

        // End state: docked in navbar
        if (pLinear >= 1) {
          if (!isFixed || !hasLockedFrom) lockFromRect();
          const to = getTargetCenter();
          const f = fromRect!;
          const cx = f.left + f.width / 2;
          const cy = f.top + f.height / 2;
          const tx = to.x - cx;
          const ty = to.y - cy;
          const s = getScale(f.height);
          const isIOS2 = /iPad|iPhone|iPod/.test(navigator.userAgent);
          const isMobileSafari2 =
            isIOS2 &&
            /Safari/.test(navigator.userAgent) &&
            !/CriOS|FxiOS/.test(navigator.userAgent);
          const transform = isMobileSafari2
            ? `translate3d(${tx}px, ${ty}px, 0) scale(${s})`
            : `translate(${tx}px, ${ty}px) scale(${s})`;
          heroLogo.style.transform = transform;
          applyFinalStylesWhileFixed();
        }

        // Back at top: restore hero layout
        if (pLinear <= 0) {
          if (isFixed) clearFixedLayer();
        }

        if (Math.abs(targetProgress - lastProgress) > 0.001) {
          rafId = window.requestAnimationFrame(animate);
        }
      };

      const computeProgress = () => {
        const y = window.scrollY;
        const raw =
          (y - heroStartY) / Math.max(heroEndY - heroStartY, 1);
        return Math.min(1, Math.max(0, raw));
      };

      const onScroll = () => {
        targetProgress = computeProgress();
        if (rafId == null) rafId = window.requestAnimationFrame(animate);
      };

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isMobileSafari =
        isIOS &&
        /Safari/.test(navigator.userAgent) &&
        !/CriOS|FxiOS/.test(navigator.userAgent);
      let lastViewportWidth = window.innerWidth;

      const onResize = () => {
        const currentWidth = window.innerWidth;
        if (isMobileSafari && currentWidth === lastViewportWidth) {
          return;
        }
        lastViewportWidth = currentWidth;

        if (isFixed && heroLogo) {
          const r = heroLogo.getBoundingClientRect();
          fromRect = r;
        }
        targetProgress = computeProgress();
        if (rafId == null) rafId = window.requestAnimationFrame(animate);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);

      const initialProgress = computeProgress();
      targetProgress = initialProgress;
      lastProgress = 0;

      if (initialProgress > 0) {
        onScroll();
      }

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        if (rafId) cancelAnimationFrame(rafId);
        clearFixedLayer();
      };
    };

    const cleanup = initializeAnimation();

    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, [isHomePage]);

  // Mobile menu functions
  const toggleMobileMenu = () => {
    const newMenuState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newMenuState);
    
    if (newMenuState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    closeMobileMenu();
  };

  const getHamburgerColor = () => {
    if (isMobileMenuOpen) return 'bg-white';
    return textColor === "text-hero-white" ? "bg-white" : "bg-black";
  };

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isCurrentPage = (route: string) => {
    if (route === '/' && isHomePage) return true;
    if (route === '/contact' && location.pathname === '/contact') return true;
    if (route === '/ai-art' && location.pathname === '/ai-art') return true;
    return false;
  };

  const socialLinks = [
    { platform: "Twitter", url: "https://twitter.com" },
    { platform: "Instagram", url: "https://instagram.com" },
    { platform: "Dribbble", url: "https://dribbble.com" },
    { platform: "Behance", url: "https://behance.net" }
  ];

  return (
    <>
      {/* Mobile Menu Overlay - Full Height */}
      <div 
        className={`fixed bg-black transition-all duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible z-[9999]' : 'opacity-0 invisible z-[9999]'
        }`}
        onClick={closeMobileMenu}
        style={{ 
          top: `${scrollY}px`,
          left: 0,
          right: 0,
          height: '109vh'
        }}
      >
        <div 
          className={`flex flex-col justify-center items-center h-full transition-transform duration-500 ease-in-out ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col gap-8 text-center">
            {isHomePage ? (
              <button 
                onClick={() => scrollToSection('hero')}
                className={`relative text-6xl font-light text-white hover:text-gray-300 transition-colors font-editorial ${
                  isCurrentPage('/') ? 'after:content-[""] after:absolute after:left-1/2 after:top-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:w-full after:h-0.5 after:bg-white' : ''
                }`}
              >
                INDEX
              </button>
            ) : (
              <TransitionLink 
                to="/" 
                onClick={closeMobileMenu}
                className={`relative text-6xl font-light text-white hover:text-gray-300 transition-colors font-editorial ${
                  isCurrentPage('/') ? 'after:content-[""] after:absolute after:left-1/2 after:top-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:w-full after:h-0.5 after:bg-white' : ''
                }`}
              >
                INDEX
              </TransitionLink>
            )}
            
            <TransitionLink 
              to="/contact" 
              onClick={closeMobileMenu}
              className={`relative text-6xl font-light text-white hover:text-gray-300 transition-colors font-editorial ${
                isCurrentPage('/contact') ? 'after:content-[""] after:absolute after:left-1/2 after:top-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:w-full after:h-0.5 after:bg-white' : ''
              }`}
            >
              CONTACT
            </TransitionLink>
            
            <TransitionLink 
              to="/ai-art" 
              onClick={closeMobileMenu}
              className={`relative text-6xl font-light text-white hover:text-gray-300 transition-colors font-editorial ${
                isCurrentPage('/ai-art') ? 'after:content-[""] after:absolute after:left-1/2 after:top-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:w-full after:h-0.5 after:bg-white' : ''
              }`}
            >
              AI ART
            </TransitionLink>
          </nav>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black-400/50">
            <div className="flex justify-center gap-6 text-sm text-white">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors uppercase tracking-wider font-neue"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Navbar */}
      <div
        ref={navRef}
        className={`sticky top-3 sm:top-5 left-0 w-full z-[1001] ${
          isHomePage ? 'bg-transparent' : 'bg-gray-500/50'
        } ${
          isHomePage 
            ? isScrolledPastHero 
              ? 'mx-3 sm:mx-10 sm:w-[calc(100%-80px)] w-[calc(100%-23.9px)]'
              : 'mx-3 sm:mx-0 sm:w-full w-[calc(100%-23.9px)]'
            : 'mx-3 sm:mx-10 sm:w-[calc(100%-80px)] w-[calc(100%-23.9px)]'
        } backdrop-blur h-fit pb-4 rounded-full px-2 transition-all duration-500 ease-in-out`}
      >
        <div 
          className={`absolute top-0 left-0 w-full z-0 transition-all duration-300 ease ${
            isMobileMenuOpen ? 'bg-black opacity-100 h-20' : 'opacity-0'
          }`}
        ></div>
        
        <div className="px-3 md:px-10">
          <div className="flex justify-between items-center pt-4 relative z-[10002]">
            {/* Mobile Title */}
            <TransitionLink 
              to={isHomePage ? "#top" : "/"} 
              className={`md:hidden text-nav nav-text ${isMobileMenuOpen ? 'text-white' : textColor} relative z-[10003]`} 
              style={{ transition: 'color 0.3s ease' }}
            >
              {title}
            </TransitionLink>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex w-full items-center relative">
              {/* Left Side Links */}
              <div className="flex items-center gap-6">
                <TransitionLink 
                  to="/ai-art" 
                  className={`text-nav nav-text ${textColor}`} 
                  style={{ transition: 'color 0.3s ease' }}
                >
                  AI Art
                </TransitionLink>
                {isHomePage ? (
                  <button 
                    onClick={() => scrollToSection('work')}
                    className={`text-nav nav-text ${textColor}`}
                    style={{ transition: 'color 0.3s ease' }}
                  >
                    Work
                  </button>
                ) : (
                  <TransitionLink 
                    to="/#work" 
                    className={`text-nav nav-text ${textColor}`}
                    style={{ transition: 'color 0.3s ease' }}
                  >
                    Work
                  </TransitionLink>
                )}
                {isHomePage ? (
                  <button 
                    onClick={() => scrollToSection('about')}
                    className={`text-nav nav-text ${textColor}`}
                    style={{ transition: 'color 0.3s ease' }}
                  >
                    About
                  </button>
                ) : (
                  <TransitionLink 
                    to="/#about" 
                    className={`text-nav nav-text ${textColor}`}
                    style={{ transition: 'color 0.3s ease' }}
                  >
                    About
                  </TransitionLink>
                )}
              </div>

              {/* Centered Logo / Placeholder */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                {isHomePage ? (
                  <div
                    id="nav-logo-placeholder"
                    style={{
                      width: "260px",
                      height: "40px",
                    }}
                  />
                ) : (
                  <TransitionLink 
                    to="/"
                    className={`text-[40px] font-normal nav-text ${textColor}`}
                    style={{ transition: 'color 0.3s ease' }}
                  >
                    LATIMER
                  </TransitionLink>
                )}
              </div>

              {/* Right Side Button */}
              <div className="ml-auto">
                <TransitionLink 
                  to="/contact" 
                  className={`bg-gray-500/70 text-white px-6 py-2 rounded-full text-nav font-medium hover:bg-gray-500 transition-colors`}
                >
                  Work Together
                </TransitionLink>
              </div>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center cursor-pointer z-[10003]"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-4 flex flex-col justify-between">
                <span 
                  className={`hamburger-bar block h-0.5 w-full transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5 bg-white' : getHamburgerColor()
                  }`}
                ></span>
                <span 
                  className={`hamburger-bar block h-0.5 w-full transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5 bg-white' : getHamburgerColor()
                  }`}
                ></span>
              </div>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}