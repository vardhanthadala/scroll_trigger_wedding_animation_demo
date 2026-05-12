"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function WeddingFrames() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const frameCount = 305;
    const currentFrame = (index: number) =>
      `/frames/${index.toString().padStart(4, "0")}.jpg`;

    const images: HTMLImageElement[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const render = (index: number) => {
      const img = images[index];
      if (!img || !img.complete) return;

      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      
      // Update canvas dimensions if they changed
      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }

      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.height * imgRatio;
        drawHeight = canvas.height;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const obj = { frame: 0 };

    // Preload images
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    let ctx = gsap.context(() => {
      gsap.to(obj, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=5000",
          scrub: 0.1, // Smooth scrub
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Ensure the very last frame is rendered at the end of scroll
            if (self.progress > 0.99) {
              render(frameCount - 1);
            }
          }
        },
        onUpdate: () => {
          render(obj.frame);
        },
      });
    });

    // Handle resize
    const handleResize = () => {
      render(obj.frame);
    };
    window.addEventListener("resize", handleResize);

    // Initial render
    if (images[0]) {
      images[0].onload = () => render(0);
    }

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="frame-section relative w-full h-screen bg-black overflow-hidden"
      style={{ willChange: "transform" }}
    >
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full block object-cover"
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <h1 className="text-white text-4xl md:text-6xl font-light tracking-[10px] md:tracking-[20px] uppercase text-center px-4 drop-shadow-2xl">
          Forever Begins
        </h1>
      </div>
    </section>
  );
}