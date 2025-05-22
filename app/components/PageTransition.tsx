// PageTransition.tsx
import { useEffect, useRef, useState, memo } from "react";
import { useNavigate, useLocation } from "@remix-run/react";
import { gsap } from "gsap";
import React from "react";

export const TransitionContext = React.createContext({
  startTransition: (to: string, pageName?: string) => {},
  isTransitioning: false,
});

export const useTransition = () => React.useContext(TransitionContext);

// Helper function to extract page name from path
const getPageNameFromPath = (path: string): string => {
  // Remove any hash or query params
  const cleanPath = path.split(/[#?]/)[0];
  
  // Handle root path
  if (cleanPath === "/" || cleanPath === "") {
    return "Home";
  }
  
  // Extract the last segment of the path and capitalize it
  const pathSegment = cleanPath.split("/").filter(Boolean).pop() || "";
  return pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
};

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const [nextPageName, setNextPageName] = useState("");
  const [hasNavigated, setHasNavigated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const transitionRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement[]>([]);

  const startTransition = (to: string, pageName?: string) => {
    if (to.startsWith('#') && location.pathname === '/') {
      const element = document.querySelector(to);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    setIsTransitioning(true);
    setNextPath(to);
    // Set the page name, default to path-based name if not provided
    setNextPageName(pageName || getPageNameFromPath(to));
    setHasNavigated(false);
  };

  // Reference for the blocks container
  const blocksContainerRef = useRef<HTMLDivElement>(null);
  
  // Create blocks once
  useEffect(() => {
    if (!blocksContainerRef.current) return;

    const createBlocks = () => {
      if (!blocksContainerRef.current) return;
      blocksContainerRef.current.innerHTML = "";
      blocksRef.current = [];

      const height = window.innerHeight;
      const width = window.innerWidth;
      // Slightly reduce number of rows to make blocks larger
      const numRows = 7;
      const blockHeight = Math.ceil(height / numRows);
      const blockWidth = blockHeight * 1.5;
      // Add extra columns to ensure full coverage
      const numCols = Math.ceil(width / blockWidth) + 2;

      for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < numCols; x++) {
          const div = document.createElement("div");
          // Increase dimensions to ensure overlap between blocks
          div.style.width = `${blockWidth + 4}px`;
          div.style.height = `${blockHeight + 2}px`;
          div.style.position = "absolute";
          div.style.top = `${y * blockHeight}px`;
          // Adjust left position to ensure no gaps
          div.style.left = `${x * blockWidth - blockWidth / 2}px`;
          div.style.backgroundColor = "black";
          div.style.transform = "skew(-20deg)";
          div.style.opacity = "0";
          div.style.clipPath = "inset(0 0 100% 0)";

          blocksContainerRef.current.appendChild(div);
          blocksRef.current.push(div);
        }
      }
    };

    createBlocks();
    window.addEventListener("resize", createBlocks);
    return () => window.removeEventListener("resize", createBlocks);
  }, []);

  // Entrance - only run when starting a transition from the current page
  useEffect(() => {
    if (!isTransitioning || blocksRef.current.length === 0 || hasNavigated || !pageNameRef.current) return;

    const blocks = blocksRef.current;
    const indices = [...Array(blocks.length).keys()].sort(() => Math.random() - 0.5);

    const entranceTl = gsap.timeline({
      onComplete: () => {
        if (!hasNavigated) {
          // Add a 0.75 second delay before navigation (extended by 0.5 seconds)
          setTimeout(() => {
            setHasNavigated(true);
            navigate(nextPath);
          }, 750); // 750ms = 0.75 seconds
        }
      }
    });

    // Animate blocks
    indices.forEach((index) => {
      const block = blocks[index];
      gsap.set(block, { clipPath: "inset(0 0 100% 0)", opacity: 1 });
      entranceTl.to(block, {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.2 + Math.random() * 0.2,
        delay: Math.random() * 0.5,
        ease: "power2.inOut"
      }, 0);
    });

    // Animate page name - fade in only after blocks have fully covered the screen
    gsap.set(pageNameRef.current, { opacity: 0, scale: 0.9 });
    entranceTl.to(pageNameRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "power2.out"
    }, 0.8); // Start after blocks have fully covered the screen

    return () => {
      entranceTl.kill();
    };
  }, [isTransitioning, nextPath, navigate, hasNavigated]);

  // Exit - runs after navigation to hide blocks
  useEffect(() => {
    if (!isTransitioning || !hasNavigated || !pageNameRef.current) return;

    // Add a 0.75 second delay after page change before starting exit animation (extended by 0.5 seconds)
    const delayTimer = setTimeout(() => {
      const blocks = blocksRef.current;
      const indices = [...Array(blocks.length).keys()].sort(() => Math.random() - 0.5);

      const exitTl = gsap.timeline({
        onComplete: () => {
          // ✅ Ensure all blocks are hidden after exit animation
          blocks.forEach(block => {
            gsap.set(block, {
              opacity: 0,
              clipPath: "inset(0 0 100% 0)"
            });
          });
          
          // Ensure page name is hidden
          gsap.set(pageNameRef.current, { opacity: 0 });
          
          setIsTransitioning(false);
        }
      });

      // First fade out the page name
      exitTl.to(pageNameRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in"
      }, 0);

      // Then animate the blocks
      indices.forEach((index) => {
        const block = blocks[index];
        gsap.set(block, { clipPath: "inset(0 0 0% 0)", opacity: 1 });
        exitTl.to(block, {
          clipPath: "inset(100% 0 0% 0)",
          duration: 0.2 + Math.random() * 0.2,
          delay: Math.random() * 0.5,
          ease: "power2.inOut"
        }, 0.3); // Start after the page name begins to fade out
      });
    }, 500); // 750ms = 0.75 seconds

    return () => {
      clearTimeout(delayTimer);
    };
  }, [location.pathname, isTransitioning, hasNavigated]);

  // Reset blocks when location changes
  useEffect(() => {
    if (!transitionRef.current || blocksRef.current.length === 0) return;
    
    // Hide all blocks when a new page is loaded
    if (!isTransitioning) {
      blocksRef.current.forEach(block => {
        gsap.set(block, {
          opacity: 0,
          clipPath: "inset(0 0 100% 0)"
        });
      });
    }
  }, [location.pathname, isTransitioning]);

  // Reference for the page name text element
  const pageNameRef = useRef<HTMLDivElement>(null);

  return (
    <TransitionContext.Provider value={{ startTransition, isTransitioning }}>
      {children}
      <div
        ref={transitionRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          pointerEvents: isTransitioning ? "all" : "none",
        }}
      >
        {/* Container for transition blocks */}
        <div ref={blocksContainerRef} style={{ width: "100%", height: "100%" }}></div>
        
        {/* Page name text overlay */}
        <div
          ref={pageNameRef}
          className="font-editorial"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "5rem",
            textTransform: "none",
            opacity: 0,
            zIndex: 10000,
            
            
          }}
        >
          {nextPageName}
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

export const TransitionLink = memo(({ to, pageName, children, className, ...props }: {
  to: string;
  pageName?: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  const { startTransition } = useTransition();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    if (location.pathname === to && !to.startsWith('#')) return;
    e.preventDefault();
    startTransition(to, pageName);
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
});

TransitionLink.displayName = 'TransitionLink';
