import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "@remix-run/react";
import { gsap } from "gsap";

// Create a context to manage the transition state
import React from "react";

export const TransitionContext = React.createContext({
  startTransition: (to: string) => {},
  isTransitioning: false,
});

export const useTransition = () => React.useContext(TransitionContext);

// The main transition provider component
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const navigate = useNavigate();
  const transitionRef = useRef<HTMLDivElement>(null);
  const squaresRef = useRef<HTMLDivElement[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to start the transition
  const startTransition = (to: string) => {
    setIsTransitioning(true);
    setNextPath(to);
  };

  // Handle the actual transition animation
  useEffect(() => {
    if (!isTransitioning || !transitionRef.current) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Get all rhombuses
    const rhombuses = squaresRef.current;
    
    // Create the timeline for the entrance animation (rhombuses appear when leaving a page)
    const tl = gsap.timeline({
      onComplete: () => {
        // Navigate to the next page after the screen is covered
        navigate(nextPath);
        
        // Set a timeout to start the exit animation after the page has loaded
        timeoutRef.current = setTimeout(() => {
          // Create the timeline for the exit animation (rhombuses disappear when entering a page)
          const exitTl = gsap.timeline({
            onComplete: () => {
              setIsTransitioning(false);
            }
          });
          
          // Get the number of rows and columns
          const height = window.innerHeight;
          const shapeHeight = Math.ceil(height / 8);
          const numRows = 8;
          const shapesPerRow = rhombuses.length / numRows;
          
          // Create an array of all indices and randomize their order for exit animation
          const exitIndices = [...Array(rhombuses.length).keys()];
          const randomizedExitIndices = exitIndices.sort(() => Math.random() - 0.5);
          
          // Animate each rhombus out in random order with a top-down clip effect
          randomizedExitIndices.forEach((index, i) => {
            if (index < rhombuses.length) {
              const rhombus = rhombuses[index];
              
              // Reset to fully visible
              gsap.set(rhombus, {
                clipPath: "inset(0 0 0% 0)", // Fully visible
                opacity: 1
              });
              
              // Add randomness to the duration and delay for staggered effect
              const randomDuration = 0.1 + Math.random() * 0.15; // Random duration between 0.1 and 0.25
              const randomDelay = Math.random() * 0.5; // Random delay between 0 and 0.5
              
              // Animate the clip-path to hide from top to bottom
              exitTl.to(rhombus, {
                clipPath: "inset(100% 0 0% 0)", // Hide from top
                duration: randomDuration,
                delay: randomDelay,
                ease: "power1.inOut"
              }, 0);
            }
          });
        }, 100); // Smaller delay to ensure the new page has loaded
      }
    });
    
    // Get the number of rows and columns
    const height = window.innerHeight;
    const shapeHeight = Math.ceil(height / 8);
    const numRows = 8;
    const shapesPerRow = rhombuses.length / numRows;
    
    // Create an array of all indices and randomize their order
    const allIndices = [...Array(rhombuses.length).keys()];
    const randomizedIndices = allIndices.sort(() => Math.random() - 0.5);
    
    // Animate each rhombus in random order with a top-down reveal effect
    randomizedIndices.forEach((index, i) => {
      if (index < rhombuses.length) {
        const rhombus = rhombuses[index];
        
        // Set initial state - visible but clipped from bottom
        gsap.set(rhombus, {
          clipPath: "inset(0 0 100% 0)", // Hidden from bottom
          opacity: 1 // Make visible but clipped
        });
        
        // Add randomness to the duration and delay for staggered effect
        const randomDuration = 0.1 + Math.random() * 0.15; // Random duration between 0.1 and 0.25
        const randomDelay = Math.random() * 0.5; // Random delay between 0 and 0.5
        
        // Animate the clip-path to reveal from top to bottom
        tl.to(rhombus, {
          clipPath: "inset(0 0 0% 0)", // Fully visible
          duration: randomDuration,
          delay: randomDelay,
          ease: "power1.inOut"
        }, 0);
      }
    });
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      tl.kill();
    };
  }, [isTransitioning, navigate, nextPath]);

  // Calculate the number of rhombuses needed based on screen size
  useEffect(() => {
    if (!transitionRef.current) return;
    
    const updateShapes = () => {
      if (!transitionRef.current) return;
      
      // Clear existing shapes
      transitionRef.current.innerHTML = "";
      squaresRef.current = [];
      
      // Calculate dimensions
      const height = window.innerHeight;
      const width = window.innerWidth;
      
      // We want 8 rhombuses along the height
      const shapeHeight = Math.ceil(height / 8);
      // Make the width a bit wider to account for the skew
      const shapeWidth = shapeHeight * 1.5;
      
      // Calculate how many rhombuses we need for the width
      const shapesPerRow = Math.ceil(width / shapeWidth) + 1; // Add one extra to cover the edge
      
      // Create the grid of rhombuses
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < shapesPerRow; x++) {
          const rhombus = document.createElement("div");
          rhombus.className = "transition-rhombus";
          rhombus.style.width = `${shapeWidth}px`;
          rhombus.style.height = `${shapeHeight}px`;
          rhombus.style.position = "absolute";
          rhombus.style.backgroundColor = "black";
          rhombus.style.top = `${y * shapeHeight}px`;
          rhombus.style.left = `${x * shapeWidth - shapeWidth/2}px`; // Offset to account for skew
          rhombus.style.opacity = "0";
          rhombus.style.transform = "skew(-20deg)"; // Angle to the right
          
          transitionRef.current.appendChild(rhombus);
          squaresRef.current.push(rhombus);
        }
      }
    };
    
    // Initial setup
    updateShapes();
    
    // Update on resize
    window.addEventListener("resize", updateShapes);
    
    return () => {
      window.removeEventListener("resize", updateShapes);
    };
  }, []);

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
      />
    </TransitionContext.Provider>
  );
}

// Custom Link component that uses our transition
export function TransitionLink({
  to,
  children,
  className,
  ...props
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const { startTransition } = useTransition();
  const location = useLocation();
  
  // Don't transition if we're already on the target page
  const handleClick = (e: React.MouseEvent) => {
    if (location.pathname === to) return;
    
    e.preventDefault();
    startTransition(to);
  };
  
  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
