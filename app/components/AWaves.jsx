import React, { useEffect, useRef } from 'react';
import Noise from './Noise.jsx';

// React component for the waves background
const WavesBackground = () => {
  const elementRef = useRef(null);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || !elementRef.current) return;

    // Initialize the custom element
    const element = elementRef.current;
    const svg = element.querySelector('.js-svg');

    // Properties
    const mouse = {
      x: -10,
      y: 0,
      lx: 0,
      ly: 0,
      sx: 0,
      sy: 0,
      v: 0,
      vs: 0,
      a: 0,
      set: false,
    };

    let lines = [];
    let paths = [];
    const noise = new Noise(Math.random());
    let bounding = element.getBoundingClientRect();
    let animationFrame = null;

    // Set size
    const setSize = () => {
      bounding = element.getBoundingClientRect();
      svg.style.width = `${bounding.width}px`;
      svg.style.height = `${bounding.height}px`;
    };

    // Set lines
    const setLines = () => {
      const { width, height } = bounding;
      
      lines = [];

      paths.forEach((path) => {
        path.remove();
      });
      paths = [];

      const xGap = 10;
      const yGap = 32;

      const oWidth = width + 200;
      const oHeight = height + 30;

      const totalLines = Math.ceil(oWidth / xGap);
      const totalPoints = Math.ceil(oHeight / yGap);

      const xStart = (width - xGap * totalLines) / 2;
      const yStart = (height - yGap * totalPoints) / 2;

      for (let i = 0; i <= totalLines; i++) {
        const points = [];

        for (let j = 0; j <= totalPoints; j++) {
          const point = {
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          };

          points.push(point);
        }

        // Create path
        const path = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );
        path.classList.add('a__line');
        path.classList.add('js-line');

        svg.appendChild(path);
        paths.push(path);

        // Add points
        lines.push(points);
      }
    };

    // Update mouse position
    const updateMousePosition = (x, y) => {
      mouse.x = x - bounding.left;
      mouse.y = y - bounding.top + window.scrollY;

      if (!mouse.set) {
        mouse.sx = mouse.x;
        mouse.sy = mouse.y;
        mouse.lx = mouse.x;
        mouse.ly = mouse.y;

        mouse.set = true;
      }
    };

    // Mouse handler
    const onMouseMove = (e) => {
      updateMousePosition(e.pageX, e.pageY);
    };

    // Touch handler
    const onTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      updateMousePosition(touch.clientX, touch.clientY);
    };

    // Resize handler
    const onResize = () => {
      setSize();
      setLines();
    };

    // Move points
    const movePoints = (time) => {
      lines.forEach((points) => {
        points.forEach((p) => {
          // Wave movement
          const move =
                noise.perlin2(
                  (p.x + time * 0.0125) * 0.002,
                  (p.y + time * 0.005) * 0.0015
                ) * 12;
          p.wave.x = Math.cos(move) * 32;
          p.wave.y = Math.sin(move) * 16;

          // Mouse effect
          const dx = p.x - mouse.sx;
          const dy = p.y - mouse.sy;
          const d = Math.hypot(dx, dy);
          const l = Math.max(175, mouse.vs);

          if (d < l) {
            const s = 1 - d / l;
            const f = Math.cos(d * 0.001) * s;

            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065;
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065;
          }

          p.cursor.vx += (0 - p.cursor.x) * 0.005; // String tension
          p.cursor.vy += (0 - p.cursor.y) * 0.005;

          p.cursor.vx *= 0.925; // Friction/duration
          p.cursor.vy *= 0.925;

          p.cursor.x += p.cursor.vx * 2; // Strength
          p.cursor.y += p.cursor.vy * 2;

          p.cursor.x = Math.min(100, Math.max(-100, p.cursor.x)); // Clamp movement
          p.cursor.y = Math.min(100, Math.max(-100, p.cursor.y));
        });
      });
    };

    // Get point coordinates with movement added
    const moved = (point, withCursorForce = true) => {
      const coords = {
        x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
        y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
      };

      // Round to 2 decimals
      coords.x = Math.round(coords.x * 10) / 10;
      coords.y = Math.round(coords.y * 10) / 10;

      return coords;
    };

    // Draw lines
    const drawLines = () => {
      lines.forEach((points, lIndex) => {
        let p1 = moved(points[0], false);

        let d = `M ${p1.x} ${p1.y}`;

        points.forEach((p1, pIndex) => {
          const isLast = pIndex === points.length - 1;

          p1 = moved(p1, !isLast);

          const p2 = moved(
            points[pIndex + 1] || points[points.length - 1],
            !isLast
          );

          // d += `Q ${p1.x} ${p1.y} ${(p1.x + p2.x) / 2} ${(p1.y + p2.y) / 2} `;
          d += `L ${p1.x} ${p1.y}`;
        });

        paths[lIndex].setAttribute('d', d);
      });
    };

    // Animation tick
    const tick = (time) => {
      // Smooth mouse movement
      mouse.sx += (mouse.x - mouse.sx) * 0.1;
      mouse.sy += (mouse.y - mouse.sy) * 0.1;

      // Mouse velocity
      const dx = mouse.x - mouse.lx;
      const dy = mouse.y - mouse.ly;
      const d = Math.hypot(dx, dy);

      mouse.v = d;
      mouse.vs += (d - mouse.vs) * 0.1;
      mouse.vs = Math.min(100, mouse.vs);

      // Mouse last position
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;

      // Mouse angle
      mouse.a = Math.atan2(dy, dx);

      // Animation
      element.style.setProperty('--x', `${mouse.sx}px`);
      element.style.setProperty('--y', `${mouse.sy}px`);

      movePoints(time);
      drawLines();
      
      animationFrame = requestAnimationFrame(tick);
    };

    // Initialize
    setSize();
    setLines();

    // Bind events
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    element.addEventListener('touchmove', onTouchMove);
    
    // Start animation
    animationFrame = requestAnimationFrame(tick);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('touchmove', onTouchMove);
      
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div 
      ref={elementRef} 
      className="a-waves"
      style={{
        '--x': '-0.5rem',
        '--y': '50%',
        position: 'absolute',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0
      }}
    >
      <svg className="js-svg"></svg>
    </div>
  );
};

export default WavesBackground;
