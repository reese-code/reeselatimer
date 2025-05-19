// PageTransition.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "@remix-run/react";
import { gsap } from "gsap";
import React from "react";

export const TransitionContext = React.createContext({
  startTransition: (to: string) => {},
  isTransitioning: false,
});

export const useTransition = () => React.useContext(TransitionContext);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const [hasNavigated, setHasNavigated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const transitionRef = useRef<HTMLDivElement>(null);
  const squaresRef = useRef<HTMLDivElement[]>([]);

  const startTransition = (to: string) => {
    setIsTransitioning(true);
    setNextPath(to);
    setHasNavigated(false);
  };

  // Build grid
  useEffect(() => {
    if (!transitionRef.current) return;
    const updateShapes = () => {
      if (!transitionRef.current) return;
      transitionRef.current.innerHTML = "";
      squaresRef.current = [];
      const height = window.innerHeight;
      const width = window.innerWidth;
      const shapeHeight = Math.ceil(height / 8);
      const shapeWidth = shapeHeight * 1.5;
      const shapesPerRow = Math.ceil(width / shapeWidth) + 1;
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < shapesPerRow; x++) {
          const rhombus = document.createElement("div");
          rhombus.className = "transition-rhombus";
          rhombus.style.width = `${shapeWidth}px`;
          rhombus.style.height = `${shapeHeight}px`;
          rhombus.style.position = "absolute";
          rhombus.style.backgroundColor = "black";
          rhombus.style.top = `${y * shapeHeight}px`;
          rhombus.style.left = `${x * shapeWidth - shapeWidth / 2}px`;
          rhombus.style.opacity = "0";
          rhombus.style.transform = "skew(-20deg)";
          transitionRef.current.appendChild(rhombus);
          squaresRef.current.push(rhombus);
        }
      }
    };
    updateShapes();
    window.addEventListener("resize", updateShapes);
    return () => window.removeEventListener("resize", updateShapes);
  }, []);

  // Handle entrance animation and navigation
  useEffect(() => {
    if (!isTransitioning || !transitionRef.current) return;
    const rhombuses = squaresRef.current;
    const timeline = gsap.timeline({
      onComplete: () => {
        if (!hasNavigated) {
          setHasNavigated(true);
          navigate(nextPath);
        }
      },
    });

    const indices = [...Array(rhombuses.length).keys()].sort(() => Math.random() - 0.5);
    indices.forEach((i) => {
      const el = rhombuses[i];
      gsap.set(el, { clipPath: "inset(0 0 100% 0)", opacity: 1 });
      timeline.to(el, {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.2,
        delay: Math.random() * 0.3,
        ease: "power2.inOut",
      }, 0);
    });

    return () => timeline.kill();
  }, [isTransitioning]);

  // Exit animation AFTER location change
  useEffect(() => {
    if (!isTransitioning || !hasNavigated) return;
    const rhombuses = squaresRef.current;
    const timeline = gsap.timeline({
      onComplete: () => setIsTransitioning(false),
    });
    const indices = [...Array(rhombuses.length).keys()].sort(() => Math.random() - 0.5);
    indices.forEach((i) => {
      const el = rhombuses[i];
      gsap.set(el, { clipPath: "inset(0 0 0% 0)", opacity: 1 });
      timeline.to(el, {
        clipPath: "inset(100% 0 0% 0)",
        duration: 0.2,
        delay: Math.random() * 0.3,
        ease: "power2.inOut",
      }, 0);
    });
    return () => timeline.kill();
  }, [location.pathname, isTransitioning, hasNavigated]);

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

export function TransitionLink({ to, children, className, ...props }: {
  to: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const { startTransition } = useTransition();
  const location = useLocation();
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
