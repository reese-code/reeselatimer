import React, { useEffect, useRef } from 'react';
import Noise from './Noise.jsx';

// React component for the waves background
const WavesBackground = () => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return;

    const element = elementRef.current;
    const svg = element.querySelector('.js-svg');

    const mouse = {
      x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false,
    };

    let lines = [], paths = [];
    const noise = new Noise(Math.random());
    let bounding = element.getBoundingClientRect();
    let animationFrame = null;

    const setSize = () => {
      bounding = element.getBoundingClientRect();
      svg.style.width = `${bounding.width}px`;
      svg.style.height = `${bounding.height}px`;
    };

    const setLines = () => {
      const { width, height } = bounding;
      lines = [];
      paths.forEach((path) => path.remove());
      paths = [];

      const xGap = 10, yGap = 32;
      const oWidth = width + 200, oHeight = height + 30;
      const totalLines = Math.ceil(oWidth / xGap);
      const totalPoints = Math.ceil(oHeight / yGap);
      const xStart = (width - xGap * totalLines) / 2;
      const yStart = (height - yGap * totalPoints) / 2;

      for (let i = 0; i <= totalLines; i++) {
        const points = [];
        for (let j = 0; j <= totalPoints; j++) {
          points.push({ x: xStart + xGap * i, y: yStart + yGap * j, wave: { x: 0, y: 0 }, cursor: { x: 0, y: 0, vx: 0, vy: 0 } });
        }
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('a__line', 'js-line');
        path.setAttribute('stroke-width', '1'); // thinner line
        path.setAttribute('stroke', 'white');
        path.setAttribute('fill', 'none');
        svg.appendChild(path);
        paths.push(path);
        lines.push(points);
      }
    };

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

    const onMouseMove = (e) => updateMousePosition(e.pageX, e.pageY);
    const onTouchMove = (e) => {
      // Don't prevent default to allow normal scrolling on mobile
      // Don't update mouse position on touch to disable line interaction
      return;
    };
    const onResize = () => { setSize(); setLines(); };

    const movePoints = (time) => {
      lines.forEach((points) => {
        points.forEach((p) => {
          /* speed change start */
          const move = noise.perlin2((p.x + time * 0.0225) * 0.002, (p.y + time * 0.0175) * 0.0015) * 12;
          /* speed change end */

          /* waviness start */
          p.wave.x = Math.cos(move) * 35;
          p.wave.y = Math.sin(move) * 20;
          /* waviness end */

          const dx = p.x - mouse.sx, dy = p.y - mouse.sy, d = Math.hypot(dx, dy), l = Math.max(175, mouse.vs);
          if (d < l) {
            const s = 1 - d / l, f = Math.cos(d * 0.001) * s;
            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065;
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065;
          }
          p.cursor.vx += (0 - p.cursor.x) * 0.005;
          p.cursor.vy += (0 - p.cursor.y) * 0.005;
          p.cursor.vx *= 0.925;
          p.cursor.vy *= 0.925;
          p.cursor.x += p.cursor.vx * 2;
          p.cursor.y += p.cursor.vy * 2;
          p.cursor.x = Math.min(100, Math.max(-100, p.cursor.x));
          p.cursor.y = Math.min(100, Math.max(-100, p.cursor.y));
        });
      });
    };

    const moved = (point, withCursorForce = true) => {
      const coords = {
        x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
        y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
      };
      coords.x = Math.round(coords.x * 10) / 10;
      coords.y = Math.round(coords.y * 10) / 10;
      return coords;
    };

    const drawLines = () => {
      lines.forEach((points, lIndex) => {
        let p1 = moved(points[0], false);
        let d = `M ${p1.x} ${p1.y}`;
        points.forEach((p1, pIndex) => {
          const isLast = pIndex === points.length - 1;
          p1 = moved(p1, !isLast);
          const p2 = moved(points[pIndex + 1] || points[points.length - 1], !isLast);
          d += `L ${p1.x} ${p1.y}`;
        });
        paths[lIndex].setAttribute('d', d);
      });
    };

    const tick = (time) => {
      mouse.sx += (mouse.x - mouse.sx) * 0.1;
      mouse.sy += (mouse.y - mouse.sy) * 0.1;
      const dx = mouse.x - mouse.lx, dy = mouse.y - mouse.ly;
      const d = Math.hypot(dx, dy);
      mouse.v = d;
      mouse.vs += (d - mouse.vs) * 0.1;
      mouse.vs = Math.min(100, mouse.vs);
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
      mouse.a = Math.atan2(dy, dx);
      element.style.setProperty('--x', `${mouse.sx}px`);
      element.style.setProperty('--y', `${mouse.sy}px`);

      movePoints(time);
      drawLines();
      animationFrame = requestAnimationFrame(tick);
    };

    setSize();
    setLines();
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    element.addEventListener('touchmove', onTouchMove);
    animationFrame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('touchmove', onTouchMove);
      if (animationFrame) cancelAnimationFrame(animationFrame);
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
        zIndex: 0,
      }}
    >
      <svg className="js-svg"></svg>
    </div>
  );
};

export default WavesBackground;
