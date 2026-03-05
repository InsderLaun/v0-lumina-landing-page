"use client";

import React, { useEffect, useRef } from "react";

interface Star {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    color: string;
}

export function Starfield() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stars = useRef<Star[]>([]);
    const mouse = useRef({ x: 0, y: 0 });
    const rafId = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            const starCount = Math.floor((canvas.width * canvas.height) / 8000); // Responsive density
            const colors = ["#ffffff", "#ffffff", "#ffffff", "#eab308", "#facc15"]; // White and subtle golds

            stars.current = Array.from({ length: starCount }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.2, // Very slow drift
                speedY: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.7 + 0.3,
                color: colors[Math.floor(Math.random() * colors.length)],
            }));
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.current.forEach((star) => {
                // Move stars
                star.x += star.speedX;
                star.y += star.speedY;

                // Wrap around screen
                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;
                if (star.y < 0) star.y = canvas.height;
                if (star.y > canvas.height) star.y = 0;

                // Mouse interaction (subtle parallax/repulse)
                const dx = mouse.current.x - star.x;
                const dy = mouse.current.y - star.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    star.x -= dx * force * 0.02;
                    star.y -= dy * force * 0.02;
                }

                // Draw star
                ctx.globalAlpha = star.opacity;
                ctx.fillStyle = star.color;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();

                // Add subtle twinkle effect
                if (Math.random() > 0.98) {
                    star.opacity = Math.random() * 0.7 + 0.3;
                }
            });

            rafId.current = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("mousemove", handleMouseMove);

        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(rafId.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 -z-10 bg-[#0a0a10]"
            style={{ opacity: 0.8 }}
        />
    );
}
