import { useEffect, useRef } from "react";
import { Link } from "@remix-run/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

  useEffect(() => {
    // Only run on the client side
    if (typeof window === "undefined") return;

    // Only apply the scroll effect on the home page
    if (isHomePage && navRef.current && gradientRef.current) {
      // Create the scroll trigger animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "section#hero", // The hero section
          start: "bottom top+=80", // When the bottom of the hero section reaches the top of the viewport + 80px
          end: "bottom top+=80", // End at the same point for a snap effect
          toggleActions: "play none none reverse",
          onEnter: () => {
            // Change text color to black when gradient appears
            gsap.to(".nav-text", { color: "#000", duration: 0.3 });
            // Change divider line color
            gsap.to(".nav-divider", { backgroundColor: "#000", duration: 0.3 });
            // Change square designs color
            gsap.to(".square-design", { backgroundColor: "#000", duration: 0.3 });
          },
          onLeave: () => {
            // Not needed as we're using reverse
          },
          onEnterBack: () => {
            // Not needed as we're using reverse
          },
          onLeaveBack: () => {
            // Change text color back to white when gradient disappears
            gsap.to(".nav-text", { color: "#fff", duration: 0.3 });
            // Change divider line color back
            gsap.to(".nav-divider", { backgroundColor: "#fff", duration: 0.3 });
            // Change square designs color back
            gsap.to(".square-design", { backgroundColor: "#fff", duration: 0.3 });
          }
        }
      });

      // Animate the gradient
      tl.fromTo(
        gradientRef.current,
        { opacity: 0, height: "0" },
        { opacity: 1, height: "80px", duration: 0.3 }
      );

      // Clean up
      return () => {
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
        tl.kill();
      };
    }
  }, [isHomePage]);

  return (
    <div ref={navRef} className="fixed top-0 left-0 w-full z-50">
      {/* White gradient background - initially hidden */}
      <div 
        ref={gradientRef} 
        className="absolute top-0 left-0 w-full bg-white opacity-0 z-0"
      ></div>
      
      {/* Navigation content */}
      <div className="px-3 sm:px-10">
        <div className="flex justify-between items-center pt-4 relative z-10">
          <p className="text-nav nav-text text-hero-white">{title}</p>
          <Link to="/contact" className="text-nav nav-text text-hero-white">
            {contactText}
          </Link>
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-hero-white mt-4 relative z-10 nav-divider">
          <div className="square-design absolute left-0 z-10 nav-detail"></div>
          <div className="square-design absolute right-0 z-10 nav-detail"></div>
        </div>
      </div>
    </div>
  );
}
