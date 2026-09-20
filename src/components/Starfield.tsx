import React, { useEffect, useRef } from 'react';

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate stars
    const starCount = 180;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      hue: Math.random() > 0.8 ? (Math.random() > 0.5 ? 190 : 270) : 210, // cyan or purple tint
    }));

    // Floating particles (dust)
    const particleCount = 25;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space nebula subtle gradients
      const radialGrad1 = ctx.createRadialGradient(width * 0.25, height * 0.3, 10, width * 0.25, height * 0.3, width * 0.5);
      radialGrad1.addColorStop(0, 'rgba(14, 34, 61, 0.22)');
      radialGrad1.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = radialGrad1;
      ctx.fillRect(0, 0, width, height);

      const radialGrad2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 10, width * 0.8, height * 0.7, width * 0.45);
      radialGrad2.addColorStop(0, 'rgba(59, 23, 84, 0.15)');
      radialGrad2.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = radialGrad2;
      ctx.fillRect(0, 0, width, height);

      // Render stars with gentle twinkling
      const now = Date.now() * 0.002;
      stars.forEach((star, idx) => {
        const twinkle = Math.sin(now * 1.5 + idx) * 0.3;
        const currentAlpha = Math.max(0.1, Math.min(1, star.alpha + twinkle));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 80%, 90%, ${currentAlpha})`;
        ctx.fill();
      });

      // Render floating subtle particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
