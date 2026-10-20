import React, { useRef, useCallback, useEffect } from "react";

export function useMiniConfetti(hasPassed: boolean) {
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiCanvasMobileRef = useRef<HTMLCanvasElement | null>(null);

  const fireMiniConfetti = useCallback(() => {
    const canvas =
      typeof window !== "undefined" && window.innerWidth < 1024
        ? confettiCanvasMobileRef.current || confettiCanvasRef.current
        : confettiCanvasRef.current || confettiCanvasMobileRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to right panel container size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const colors = ["#ec4899", "#f59e0b", "#10b981", "#6366f1", "#06b6d4", "#fbbf24", "#e11d48"];
    const particlesCount = 42;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      alpha: number;
      shape: "rect" | "circle";
    }> = [];

    // Burst from bottom center of the right action panel
    const startX = canvas.width / 2;
    const startY = canvas.height - 80;

    for (let i = 0; i < particlesCount; i++) {
      const speed = 4 + Math.random() * 7;
      particles.push({
        x: startX + (Math.random() - 0.5) * 80,
        y: startY,
        vx: (Math.random() - 0.5) * 8,
        vy: -speed - 2,
        size: 5 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        shape: Math.random() > 0.4 ? "rect" : "circle",
      });
    }

    let animationFrameId: number;
    const startTime = performance.now();

    const render = (time: number) => {
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.vx *= 0.98; // air drag
        p.rotation += p.rotationSpeed;
        if (elapsed > 900) {
          p.alpha = Math.max(0, 1 - (elapsed - 900) / 900);
        }

        if (p.alpha > 0 && p.y < canvas.height + 20) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;

          if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (alive && elapsed < 2000) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animationFrameId = requestAnimationFrame(render);
  }, []);

  // Trigger mini confetti only when transitioning from false -> true
  const prevPassedRef = useRef(false);
  useEffect(() => {
    if (hasPassed && !prevPassedRef.current) {
      fireMiniConfetti();
    }
    prevPassedRef.current = hasPassed;
  }, [hasPassed, fireMiniConfetti]);

  return {
    confettiCanvasRef,
    confettiCanvasMobileRef,
    fireMiniConfetti,
  };
}
