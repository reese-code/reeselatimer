import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { TransitionLink } from "./PageTransition";

type NavBarProps = {
  title?: string;
  contactText?: string;
  isHomePage?: boolean;
  textColor?: string;
  forceTransparent?: boolean;
};

export default function NavBar({ 
  title = "Reese Latimer •", 
  contactText = "Let's get in touch",
  isHomePage = false,
  textColor = "text-hero-white",
  forceTransparent = false
}: NavBarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const [scrollReady, setScrollReady] = useState(false);

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
    if (!scrollReady || !navRef.current || !gradientRef.current) return;

    // Only set up scroll animations on home page using vanilla JS instead of GSAP for positioning
    if (isHomePage) {
      const handleScroll = () => {
        const heroSection = document.querySelector('section#hero');
        if (!heroSection || !gradientRef.current) return;

        const heroRect = heroSection.getBoundingClientRect();
        const heroBottom = heroRect.bottom;
        
        // Show background when hero section is scrolled past
        if (heroBottom <= 80) {
          // Show white background
          gradientRef.current.style.opacity = '1';
          gradientRef.current.style.height = '80px';
          
          // Change text colors to black
          const navTexts = document.querySelectorAll('.nav-text');
          const navDividers = document.querySelectorAll('.nav-divider');
          const squareDesigns = document.querySelectorAll('.square-design');
          
          navTexts.forEach(el => (el as HTMLElement).style.color = '#000');
          navDividers.forEach(el => (el as HTMLElement).style.backgroundColor = '#000');
          squareDesigns.forEach(el => (el as HTMLElement).style.backgroundColor = '#000');
        } else {
          // Hide white background
          gradientRef.current.style.opacity = '0';
          gradientRef.current.style.height = '0';
          
          // Change text colors to white
          const navTexts = document.querySelectorAll('.nav-text');
          const navDividers = document.querySelectorAll('.nav-divider');
          const squareDesigns = document.querySelectorAll('.square-design');
          
          navTexts.forEach(el => (el as HTMLElement).style.color = '#fff');
          navDividers.forEach(el => (el as HTMLElement).style.backgroundColor = '#fff');
          squareDesigns.forEach(el => (el as HTMLElement).style.backgroundColor = '#fff');
        }
      };

      // Add scroll listener
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    // For non-home pages, show the white background and set colors based on textColor
    if (!isHomePage && !forceTransparent) {
      if (gradientRef.current) {
        gradientRef.current.style.opacity = '1';
        gradientRef.current.style.height = '80px';
      }
      
      // Set initial colors based on textColor
      const navTexts = document.querySelectorAll('.nav-text');
      const navDividers = document.querySelectorAll('.nav-divider');
      const squareDesigns = document.querySelectorAll('.square-design');
      
      if (textColor === "text-black") {
        navTexts.forEach(el => (el as HTMLElement).style.color = '#000');
        navDividers.forEach(el => (el as HTMLElement).style.backgroundColor = '#000');
        squareDesigns.forEach(el => (el as HTMLElement).style.backgroundColor = '#000');
      } else if (textColor === "text-hero-white") {
        navTexts.forEach(el => (el as HTMLElement).style.color = '#fff');
        navDividers.forEach(el => (el as HTMLElement).style.backgroundColor = '#fff');
        squareDesigns.forEach(el => (el as HTMLElement).style.backgroundColor = '#fff');
      }
    }

    // For forceTransparent pages, keep background transparent and set white text
    if (forceTransparent) {
      if (gradientRef.current) {
        gradientRef.current.style.opacity = '0';
        gradientRef.current.style.height = '0';
      }
      
      // Set colors to white
      const navTexts = document.querySelectorAll('.nav-text');
      const navDividers = document.querySelectorAll('.nav-divider');
      const squareDesigns = document.querySelectorAll('.square-design');
      
      navTexts.forEach(el => (el as HTMLElement).style.color = '#fff');
      navDividers.forEach(el => (el as HTMLElement).style.backgroundColor = '#fff');
      squareDesigns.forEach(el => (el as HTMLElement).style.backgroundColor = '#fff');
    }
    
  }, [scrollReady, isHomePage, textColor]);

  return (
    <div ref={navRef} className="sticky top-0 left-0 w-full z-50">
      <div 
        ref={gradientRef} 
        className="absolute top-0 left-0 w-full bg-white opacity-0 z-0"
        style={{ transition: 'opacity 0.3s ease, height 0.3s ease' }}
      ></div>
      
      <div className="px-3 md:px-10">
        <div className="flex justify-between items-center pt-4 relative z-10">
          <TransitionLink to={isHomePage ? "#top" : "/"} className={`text-nav nav-text ${textColor}`} style={{ transition: 'color 0.3s ease' }}>
            {title}
          </TransitionLink>
          
          <div className="flex items-center gap-6">
            <TransitionLink to="/ai-art" className={`text-nav nav-text ${textColor} flex items-center gap-2`} style={{ transition: 'color 0.3s ease' }}>
              AI Art
              <img src="/images/arrow.svg" alt="Arrow" className="w-4 h-4" />
            </TransitionLink>
            <TransitionLink to="/contact" className={`text-nav nav-text ${textColor}`} style={{ transition: 'color 0.3s ease' }}>
              {contactText}
            </TransitionLink>
          </div>
        </div>

        <div className={`w-full h-px ${textColor === "text-hero-white" ? "bg-hero-white" : "bg-black"} mt-4 relative z-10 nav-divider`} style={{ transition: 'background-color 0.3s ease' }}>
          <div className={`square-design absolute left-0 z-10 nav-detail ${textColor === "text-hero-white" ? "bg-white" : "bg-black"}`} style={{ transition: 'background-color 0.3s ease' }}></div>
          <div className={`square-design absolute right-0 z-10 nav-detail ${textColor === "text-hero-white" ? "bg-white" : "bg-black"}`} style={{ transition: 'background-color 0.3s ease' }}></div>
        </div>
      </div>
    </div>
  );
}
