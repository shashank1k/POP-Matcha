"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TOTAL_FRAMES = 189;

export default function MatchaCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothedProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const preloadImages = async () => {
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        const frameNumber = i.toString().padStart(3, "0");
        img.src = `/Frames/ezgif-frame-${frameNumber}.jpg`;
        
        const handleLoad = () => {
          loadedCount++;
          setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
          if (loadedCount === TOTAL_FRAMES) {
            setImages(loadedImages);
            setIsLoading(false);
          }
        };

        img.onload = handleLoad;
        img.onerror = () => {
          console.error(`Failed to load frame: ${frameNumber}`);
          handleLoad(); // Still increment loadedCount to avoid getting stuck
        };
        loadedImages[i - 1] = img;
      }
    };

    preloadImages();
  }, []);

  // Draw to canvas
  useEffect(() => {
    const render = () => {
      if (images.length === 0 || !canvasRef.current) return;

      const context = canvasRef.current.getContext("2d");
      if (!context) return;

      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor((smoothedProgress.get() / 0.4) * (TOTAL_FRAMES - 1)));
      const image = images[frameIndex] || images[0];

      // "Cover" logic for canvas
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;

      context.scale(dpr, dpr);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      const imageWidth = image.naturalWidth || 1920; // Fallback
      const imageHeight = image.naturalHeight || 1080; // Fallback
      
      const ratio = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);
      const newWidth = imageWidth * ratio;
      const newHeight = imageHeight * ratio;
      const x = (canvasWidth - newWidth) / 2;
      const y = (canvasHeight - newHeight) / 2;

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.drawImage(image, x, y, newWidth, newHeight);
    };

    const unsubscribe = smoothedProgress.on("change", render);
    
    // Initial render
    if (!isLoading) {
      render();
    }

    window.addEventListener("resize", render);
    return () => {
      unsubscribe();
      window.removeEventListener("resize", render);
    };
  }, [images, isLoading, smoothedProgress]);

  // Scrollytelling Overlays
  const text1Opacity = useTransform(scrollYProgress, [0, 0.03, 0.07, 0.1], [0, 1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0, 0.03, 0.07, 0.1], [20, 0, 0, -20]);

  const text2Opacity = useTransform(scrollYProgress, [0.13, 0.16, 0.2, 0.23], [0, 1, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.13, 0.16, 0.2, 0.23], [20, 0, 0, -20]);

  const text3Opacity = useTransform(scrollYProgress, [0.26, 0.29, 0.33, 0.36], [0, 1, 1, 0]);
  const text3Y = useTransform(scrollYProgress, [0.26, 0.29, 0.33, 0.36], [20, 0, 0, -20]);

  const text4Opacity = useTransform(scrollYProgress, [0.4, 0.43, 1, 1], [0, 1, 1, 1]);
  const text4Y = useTransform(scrollYProgress, [0.4, 0.43, 1, 1], [20, 0, 0, 0]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
        <div className="mb-4 text-2xl font-bold tracking-tighter text-[#98FF98]">POP MATCHA</div>
        <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <motion.div 
            className="h-full bg-[#98FF98]"
            initial={{ width: 0 }}
            animate={{ width: `${loadProgress}%` }}
          />
        </div>
        <div className="mt-2 font-mono text-xs text-white/40">{loadProgress}%</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[1200vh] bg-[#050505]">
      <div className="sticky top-20 h-[calc(100vh-5rem)] w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="h-full w-full object-cover"
        />

        {/* Overlays */}
        <div className="pointer-events-none absolute inset-0">
          {/* 0%–20%: "PURE ENERGY" (Center) */}
          <motion.div
            style={{ opacity: text1Opacity, y: text1Y }}
            className="absolute inset-0 flex items-center justify-center px-8 text-center drop-shadow-[0_0_30px_rgba(0,0,0,1)]"
          >
            <h2 className="text-6xl font-black uppercase tracking-tighter md:text-8xl lg:text-9xl">
              Pure <span className="text-[#98FF98]">Energy</span>
            </h2>
          </motion.div>

          {/* 25%–45%: "THE SNAP" (Center) */}
          <motion.div
            style={{ opacity: text2Opacity, y: text2Y }}
            className="absolute inset-0 flex items-center justify-center px-8 text-center drop-shadow-[0_0_30px_rgba(0,0,0,1)]"
          >
            <h2 className="text-5xl font-black uppercase tracking-tighter md:text-7xl lg:text-8xl">
              The <br />
              <span className="text-[#98FF98]">Snap</span>
            </h2>
          </motion.div>

          {/* 50%–70%: "ZERO CRASH" (Center) */}
          <motion.div
            style={{ opacity: text3Opacity, y: text3Y }}
            className="absolute inset-0 flex items-center justify-center px-8 text-center drop-shadow-[0_0_30px_rgba(0,0,0,1)]"
          >
            <h2 className="text-5xl font-black uppercase tracking-tighter md:text-7xl lg:text-8xl">
              Zero <br />
              <span className="text-[#98FF98]">Crash</span>
            </h2>
          </motion.div>

          {/* 75%–100%: "POP MATCHA" (Center + Call to Action) */}
          <motion.div
            style={{ opacity: text4Opacity, y: text4Y }}
            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center drop-shadow-[0_0_40px_rgba(0,0,0,1)]"
          >
            <h2 className="mb-8 text-6xl font-black uppercase tracking-tighter md:text-8xl lg:text-9xl">
              Pop <span className="text-[#98FF98]">Matcha</span>
            </h2>
            <button suppressHydrationWarning className="pointer-events-auto rounded-full bg-[#98FF98] px-10 py-5 text-xl font-bold uppercase tracking-widest text-black shadow-[0_0_40px_rgba(152,255,152,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(152,255,152,0.5)] active:scale-95">
              Order Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
