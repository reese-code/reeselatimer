import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { TransitionLink } from "./PageTransition";

type NavBarProps = {
  title?: string;
  contactText?: string;
  isHomePage?: boolean;
  textColor?: string;
};

export default function NavBar({ 
  title = "Reese Latimer •", 
  contactText = "Let's get in touch",
  isHomePage = false,
  textColor = "text-hero-white"
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

    // Only set up scroll animations on home page
    if (isHomePage) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "section#hero",
          start: "bottom top+=80",
          end: "bottom top+=80",
          toggleActions: "play none none reverse",
          onEnter: () => {
            gsap.to(".nav-text", { color: "#000", duration: 0.3 });
            gsap.to(".nav-divider", { backgroundColor: "#000", duration: 0.3 });
            gsap.to(".square-design", { backgroundColor: "#000", duration: 0.3 });
          },
          onLeaveBack: () => {
            gsap.to(".nav-text", { color: "#fff", duration: 0.3 });
            gsap.to(".nav-divider", { backgroundColor: "#fff", duration: 0.3 });
            gsap.to(".square-design", { backgroundColor: "#fff", duration: 0.3 });
          }
        }
      });
      
      tl.fromTo(
        gradientRef.current,
        { opacity: 0, height: "0" },
        { opacity: 1, height: "80px", duration: 0.3 }
      );
      
      return () => {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
      };
    }

    // For non-home pages, show the white background and set colors based on textColor
    if (!isHomePage) {
      gsap.to(gradientRef.current, { opacity: 1, height: "80px", duration: 0 });
      
      // Set initial colors based on textColor
      if (textColor === "text-black") {
        gsap.set(".nav-text", { color: "#000" });
        gsap.set(".nav-divider", { backgroundColor: "#000" });
        gsap.set(".square-design", { backgroundColor: "#000" });
      } else if (textColor === "text-hero-white") {
        gsap.set(".nav-text", { color: "#fff" });
        gsap.set(".nav-divider", { backgroundColor: "#fff" });
        gsap.set(".square-design", { backgroundColor: "#fff" });
      }
    }
    
  }, [scrollReady, isHomePage]);

  return (
    <div ref={navRef} className="fixed top-0 left-0 w-full z-50">
      <div 
        ref={gradientRef} 
        className="absolute top-0 left-0 w-full bg-white opacity-0 z-0"
      ></div>
      
      <div className="px-3 md:px-10">
        <div className="flex justify-between items-center pt-4 relative z-10">
          <TransitionLink to={isHomePage ? "#top" : "/"} className={`text-nav nav-text ${textColor}`}>
            {title}
          </TransitionLink>
          <TransitionLink to="/contact" className={`text-nav nav-text ${textColor}`}>
            {contactText}
          </TransitionLink>
        </div>

        <div className={`w-full h-px ${textColor === "text-hero-white" ? "bg-hero-white" : "bg-black"} mt-4 relative z-10 nav-divider`}>
          <div className={`square-design absolute left-0 z-10 nav-detail ${textColor === "text-hero-white" ? "bg-white" : "bg-black"}`}></div>
          <div className={`square-design absolute right-0 z-10 nav-detail ${textColor === "text-hero-white" ? "bg-white" : "bg-black"}`}></div>
        </div>
      </div>
    </div>
  );
}
