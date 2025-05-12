import { useEffect, useRef, useState } from "react";
import { Link } from "@remix-run/react";
import { gsap } from "gsap";

type NavBarProps = {
  title?: string;
  contactText?: string;
  isHomePage?: boolean;
};

export default function NavBar({ 
  title = "Reese Latimer •", 
  contactText = "Let's get in touch",
  isHomePage = false
}: NavBarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const [scrollReady, setScrollReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dynamically load ScrollTrigger
    import("gsap/ScrollTrigger").then((module) => {
      const ScrollTrigger = module.ScrollTrigger || module.default?.ScrollTrigger || module;
      gsap.registerPlugin(ScrollTrigger);
      setScrollReady(true);
    });
  }, []);

  useEffect(() => {
    if (!scrollReady || !isHomePage || !navRef.current || !gradientRef.current) return;

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
  }, [scrollReady, isHomePage]);

  return (
    <div ref={navRef} className="fixed top-0 left-0 w-full z-50">
      <div 
        ref={gradientRef} 
        className="absolute top-0 left-0 w-full bg-white opacity-0 z-0"
      ></div>
      
      <div className="px-3 sm:px-10">
        <div className="flex justify-between items-center pt-4 relative z-10">
          <p className="text-nav nav-text text-hero-white">{title}</p>
          <Link to="/contact" className="text-nav nav-text text-hero-white">
            {contactText}
          </Link>
        </div>

        <div className="w-full h-px bg-hero-white mt-4 relative z-10 nav-divider">
          <div className="square-design absolute left-0 z-10 nav-detail"></div>
          <div className="square-design absolute right-0 z-10 nav-detail"></div>
        </div>
      </div>
    </div>
  );
}