"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WeddingFrames() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frameCount = 305;

    const currentFrame = (index: number) =>
      `/frames/${String(index).padStart(4, "0")}.jpg`;

    const images: HTMLImageElement[] = [];

    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    // Retina sharpness
    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    context.scale(dpr, dpr);

    // Render frame
    const render = (index: number) => {
      const img = images[index];

      if (!img) return;

      context.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      // Cover fit
      const scale = Math.max(
        window.innerWidth / img.width,
        window.innerHeight / img.height
      );

      const x =
        (window.innerWidth - img.width * scale) / 2;

      const y =
        (window.innerHeight - img.height * scale) / 2;

      context.drawImage(
        img,
        x,
        y,
        img.width * scale,
        img.height * scale
      );
    };

    // Preload images
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();

      img.src = currentFrame(i);

      images.push(img);
    }

    // First frame
    images[0].onload = () => {
      render(0);
    };

    // Animation object
    const playhead = {
      frame: 0,
    };

    // GSAP animation
    const animation = gsap.to(playhead, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "power1.out",

      scrollTrigger: {
        trigger: ".frame-section",
        start: "top top",
        end: "+=2500",
        scrub: 0.5,
        pin: true,
      },

      onUpdate: () => {
        render(playhead.frame);
      },
    });

    // Resize support
    const handleResize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      context.scale(dpr, dpr);

      render(playhead.frame);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  return (
    <section className="frame-section relative h-screen overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        
      </div>
    </section>
  );
}