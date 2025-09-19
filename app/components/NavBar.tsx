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
          const hamburgerBars = document.querySelectorAll('.hamburger-bar');
          
          navTexts.forEach(el => (el as HTMLElement).style.color = '#000');
          navDividers.forEach(el => (el as HTMLElement).style.backgroundColor = '#000');
          squareDesigns.forEach(el => (el as HTMLElement).style.backgroundColor = '#000');
          hamburgerBars.forEach(el => {
            if (!isMobileMenuOpen) {
              (el as HTMLElement).style.backgroundColor = '#000';
            }
          });
        } else {
          // Hide white background
          gradientRef.current.style.opacity = '0';
          gradientRef.current.style.height = '0';
          
          // Change text colors to white
          const navTexts = document.querySelectorAll('.nav-text');
          const navDividers = document.querySelectorAll('.nav-divider');
          const squareDesigns = document.querySelectorAll('.square-design');
          const hamburgerBars = document.querySelectorAll('.hamburger-bar');
          
          navTexts.forEach(el => (el as HTMLElement).style.color = '#fff');
          navDividers.forEach(el => (el as HTMLElement).style.backgroundColor = '#fff');
          squareDesigns.forEach(el => (el as HTMLElement).style.backgroundColor = '#fff');
          hamburgerBars.forEach(el => {
            if (!isMobileMenuOpen) {
              (el as HTMLElement).style.backgroundColor = '#fff';
            }
          });
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
    // Prevent/allow scrolling when menu is open/closed
    if (!isMobileMenuOpen) {
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

  // Get current hamburger color based on scroll state and page
  const getHamburgerColor = () => {
    if (isMobileMenuOpen) return 'bg-white'; // Always white when menu is open
    return textColor === "text-hero-white" ? "bg-white" : "bg-black";
  };

  // Get current scroll position for mobile menu positioning
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if current page matches route
  const isCurrentPage = (route: string) => {
    if (route === '/' && isHomePage) return true;
    if (route === '/contact' && location.pathname === '/contact') return true;
    if (route === '/ai-art' && location.pathname === '/ai-art') return true;
    return false;
  };

  // Social links (matching footer)
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
          height: '100vh'
        }}
      >
        <div 
          className={`flex flex-col justify-center items-center h-full transition-transform duration-500 ease-in-out ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Navigation Links */}
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

          {/* Social Links */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
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
      <div ref={navRef} className="sticky top-0 left-0 w-full z-50">
        {/* Background that changes when mobile menu is open */}
        <div 
          className={`absolute top-0 left-0 w-full z-0 transition-all duration-300 ease ${
            isMobileMenuOpen ? 'bg-black opacity-100 h-20' : 'opacity-0'
          }`}
        ></div>
        <div 
          ref={gradientRef} 
          className={`absolute top-0 left-0 w-full opacity-0 z-0 ${useGradient ? 'bg-gradient-to-b from-black to-transparent' : 'bg-white'}`}
          style={{ transition: 'opacity 0.3s ease, height 0.3s ease' }}
        ></div>
        
        <div className="px-3 md:px-10">
          <div className="flex justify-between items-center pt-4 relative z-50">
            <TransitionLink 
              to={isHomePage ? "#top" : "/"} 
              className={`text-nav nav-text ${isMobileMenuOpen ? 'text-white' : textColor}`} 
              style={{ transition: 'color 0.3s ease' }}
            >
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
              className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center cursor-pointer z-[10000]"
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

          <div 
            className={`w-full h-px mt-4 relative z-50 nav-divider transition-colors duration-300 ${
              isMobileMenuOpen ? 'bg-white' : (textColor === "text-hero-white" ? "bg-hero-white" : "bg-black")
            }`}
          >
            <div 
              className={`square-design absolute left-0 z-10 nav-detail transition-colors duration-300 ${
                isMobileMenuOpen ? 'bg-white' : (textColor === "text-hero-white" ? "bg-white" : "bg-black")
              }`}
            ></div>
            <div 
              className={`square-design absolute right-0 z-10 nav-detail transition-colors duration-300 ${
                isMobileMenuOpen ? 'bg-white' : (textColor === "text-hero-white" ? "bg-white" : "bg-black")
              }`}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
