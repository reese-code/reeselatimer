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
  contactText = "Let's get in touch",
  isHomePage = false,
  textColor = "text-hero-white",
  forceTransparent = false,
  useGradient = false
}: NavBarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const [scrollReady, setScrollReady] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    if (forceTransparent && !useGradient) {
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

    // For gradient pages, show the gradient background and set white text
    if (useGradient) {
      if (gradientRef.current) {
        gradientRef.current.style.opacity = '1';
        gradientRef.current.style.height = '120px'; // Taller for gradient effect
      }
      
      // Set colors to white for gradient
      const navTexts = document.querySelectorAll('.nav-text');
      const navDividers = document.querySelectorAll('.nav-divider');
      const squareDesigns = document.querySelectorAll('.square-design');
      
      navTexts.forEach(el => (el as HTMLElement).style.color = '#fff');
      navDividers.forEach(el => (el as HTMLElement).style.backgroundColor = '#fff');
      squareDesigns.forEach(el => (el as HTMLElement).style.backgroundColor = '#fff');
    }
    
  }, [scrollReady, isHomePage, textColor]);

  // Mobile menu functions
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    closeMobileMenu();
  };

  // Social links (matching footer)
  const socialLinks = [
    { platform: "Twitter", url: "https://twitter.com" },
    { platform: "Instagram", url: "https://instagram.com" },
    { platform: "Dribbble", url: "https://dribbble.com" },
    { platform: "Behance", url: "https://behance.net" }
  ];

  return (
    <div ref={navRef} className="sticky top-0 left-0 w-full z-50">
      <div 
        ref={gradientRef} 
        className={`absolute top-0 left-0 w-full opacity-0 z-0 ${useGradient ? 'bg-gradient-to-b from-black to-transparent' : 'bg-white'}`}
        style={{ transition: 'opacity 0.3s ease, height 0.3s ease' }}
      ></div>
      
      <div className="px-3 md:px-10">
        <div className="flex justify-between items-center pt-4 relative z-10">
          <TransitionLink to={isHomePage ? "#top" : "/"} className={`text-nav nav-text ${textColor}`} style={{ transition: 'color 0.3s ease' }}>
            {title}
          </TransitionLink>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <TransitionLink to="/ai-art" className={`text-nav nav-text ${textColor} flex items-center gap-2`} style={{ transition: 'color 0.3s ease' }}>
              AI Art
            </TransitionLink>
            <TransitionLink to="/contact" className={`text-nav nav-text ${textColor}`} style={{ transition: 'color 0.3s ease' }}>
              {contactText}
            </TransitionLink>
          </div>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center cursor-pointer z-50"
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-6 h-4 flex flex-col justify-between">
              <span 
                className={`block h-0.5 w-full nav-text transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                } ${textColor === "text-hero-white" ? "bg-white" : "bg-black"}`}
                style={{ transition: 'all 0.3s ease, background-color 0.3s ease' }}
              ></span>
              <span 
                className={`block h-0.5 w-full nav-text transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                } ${textColor === "text-hero-white" ? "bg-white" : "bg-black"}`}
                style={{ transition: 'all 0.3s ease, background-color 0.3s ease' }}
              ></span>
            </div>
          </button>
        </div>

        <div className={`w-full h-px ${textColor === "text-hero-white" ? "bg-hero-white" : "bg-black"} mt-4 relative z-10 nav-divider`} style={{ transition: 'background-color 0.3s ease' }}>
          <div className={`square-design absolute left-0 z-10 nav-detail ${textColor === "text-hero-white" ? "bg-white" : "bg-black"}`} style={{ transition: 'background-color 0.3s ease' }}></div>
          <div className={`square-design absolute right-0 z-10 nav-detail ${textColor === "text-hero-white" ? "bg-white" : "bg-black"}`} style={{ transition: 'background-color 0.3s ease' }}></div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-95 z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeMobileMenu}
      >
        <div 
          className={`flex flex-col justify-between h-full p-6 pt-20 transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Menu Header */}
          <div className="text-center">
            <h2 className="text-2xl font-light text-white mb-12 font-editorial">
              Reese Latimer
            </h2>
            
            {/* Navigation Links */}
            <nav className="flex flex-col gap-8">
              {isHomePage ? (
                <button 
                  onClick={() => scrollToSection('hero')}
                  className="text-6xl font-light text-white hover:text-gray-300 transition-colors font-editorial"
                >
                  INDEX
                </button>
              ) : (
                <TransitionLink 
                  to="/" 
                  onClick={closeMobileMenu}
                  className="text-6xl font-light text-white hover:text-gray-300 transition-colors font-editorial"
                >
                  INDEX
                </TransitionLink>
              )}
              
              <TransitionLink 
                to="/contact" 
                onClick={closeMobileMenu}
                className="text-6xl font-light text-white hover:text-gray-300 transition-colors font-editorial"
              >
                CONTACT
              </TransitionLink>
              
              <TransitionLink 
                to="/ai-art" 
                onClick={closeMobileMenu}
                className="text-6xl font-light text-white hover:text-gray-300 transition-colors font-editorial"
              >
                AI ART
              </TransitionLink>
            </nav>
          </div>

          {/* Social Links */}
          <div className="text-center">
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
    </div>
  );
}
