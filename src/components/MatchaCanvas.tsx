"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

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
    stiffness: 80,
    damping: 22,
    restDelta: 0.001,
  });

  /**
   * =========================
   * PRELOAD IMAGES
   * =========================
   */
  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;

    const preloadImages = async () => {
      const timeoutId = setTimeout(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      }, 10000);

      const promises = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
        return new Promise<HTMLImageElement | null>((resolve) => {
          const img = new Image();
          const frameNumber = (i + 1).toString().padStart(3, "0");
          img.src = `/Frames/ezgif-frame-${frameNumber}.jpg`;

          img.onload = () => {
            if (isMounted) {
              loadedCount++;
              setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
            }
            resolve(img);
          };

          img.onerror = () => {
            console.error("Failed to load frame:", img.src);
            if (isMounted) {
              loadedCount++;
              setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
            }
            resolve(null);
          };
        });
      });

      const results = await Promise.all(promises);

      if (!isMounted) return;

      clearTimeout(timeoutId);

      const successfulImages = results.filter(
        (img): img is HTMLImageElement => img !== null
      );

      setImages(successfulImages);
      setIsLoading(false);
    };

    preloadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * =========================
   * CANVAS RENDER
   * =========================
   */
  const renderFrame = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas || images.length === 0) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const dpr = window.devicePixelRatio || 1;
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;

      const targetWidth = Math.floor(canvasWidth * dpr);
      const targetHeight = Math.floor(canvasHeight * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
      }

      // IMPORTANT: reset transform each render
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      /**
       * ANIMATION CONTROL
       * 0% → 85% : frames animate
       * 85% → 100% : last frame stays frozen
       */
      const animationEnd = 0.85;
      const normalizedProgress = Math.min(progress / animationEnd, 1);

      const frameIndex = Math.min(
        images.length - 1,
        Math.floor(normalizedProgress * (images.length - 1))
      );

      const image = images[frameIndex];
      if (!image) return;

      // Cover fit
      const imageWidth = image.naturalWidth || 1920;
      const imageHeight = image.naturalHeight || 1080;

      const ratio = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);
      const drawWidth = imageWidth * ratio;
      const drawHeight = imageHeight * ratio;
      const x = (canvasWidth - drawWidth) / 2;
      const y = (canvasHeight - drawHeight) / 2;

      context.drawImage(image, x, y, drawWidth, drawHeight);
    },
    [images]
  );

  useEffect(() => {
    if (images.length === 0 || isLoading) return;

    renderFrame(smoothedProgress.get());

    const unsubscribe = smoothedProgress.on("change", (latest) => {
      renderFrame(latest);
    });

    const handleResize = () => {
      renderFrame(smoothedProgress.get());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [images, isLoading, smoothedProgress, renderFrame]);

  /**
   * =========================
   * TEXT TIMELINES
   * =========================
   *
   * 0%–20%: PURE ENERGY
   * 23%–40%: THE SNAP
   * 43%–60%: ZERO CRASH
   * 65%–85%: POP MATCHA
   * 85%–100%: stagnant
   */

  // PURE ENERGY
  const text1Opacity = useTransform(
    scrollYProgress,
    [0, 0.03, 0.17, 0.2],
    [0, 1, 1, 0]
  );
  const text1Y = useTransform(
    scrollYProgress,
    [0, 0.03, 0.17, 0.2],
    [30, 0, 0, -30]
  );

  // THE SNAP
  const text2Opacity = useTransform(
    scrollYProgress,
    [0.23, 0.26, 0.37, 0.4],
    [0, 1, 1, 0]
  );
  const text2Y = useTransform(
    scrollYProgress,
    [0.23, 0.26, 0.37, 0.4],
    [30, 0, 0, -30]
  );

  // ZERO CRASH
  const text3Opacity = useTransform(
    scrollYProgress,
    [0.43, 0.46, 0.57, 0.6],
    [0, 1, 1, 0]
  );
  const text3Y = useTransform(
    scrollYProgress,
    [0.43, 0.46, 0.57, 0.6],
    [30, 0, 0, -30]
  );

  // POP MATCHA
  const text4Opacity = useTransform(
    scrollYProgress,
    [0.65, 0.68, 0.85, 1],
    [0, 1, 1, 1]
  );
  const text4Y = useTransform(
    scrollYProgress,
    [0.65, 0.68, 0.85, 1],
    [30, 0, 0, 0]
  );

  /**
   * =========================
   * LOADER
   * =========================
   */
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]">
        <div className="relative mb-8">
          <div className="text-4xl font-black tracking-tighter text-white">
            POP <span className="text-[#98FF98]">MATCHA</span>
          </div>

          <motion.div
            className="absolute -bottom-2 left-0 h-0.5 bg-[#98FF98]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <div className="relative h-1 w-64 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-[#98FF98] shadow-[0_0_15px_rgba(152,255,152,0.5)]"
            animate={{ width: `${loadProgress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          />
        </div>

        <div className="mt-4 flex flex-col items-center space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Initializing Experience
          </div>
          <div className="font-mono text-xs font-bold text-[#98FF98]">
            {loadProgress}%
          </div>
        </div>
      </div>
    );
  }

  /**
   * =========================
   * MAIN HERO
   * =========================
   *
   * h-[650vh] gives:
   * - enough scroll space for frame animation
   * - enough stagnant hold after 85%
   */
  return (
    <div ref={containerRef} className="relative h-[650vh] bg-[#050505]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/15" />

        {/* TEXT OVERLAYS */}
        <div className="pointer-events-none absolute inset-0">
          {/* 0%–20%: PURE ENERGY */}
          <motion.div
            style={{ opacity: text1Opacity, y: text1Y }}
            className="absolute inset-0 flex items-center justify-center px-8 text-center"
          >
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_30px_rgba(0,0,0,1)] md:text-7xl lg:text-9xl">
              Pure <span className="text-[#98FF98]">Energy</span>
            </h2>
          </motion.div>

          {/* 23%–40%: THE SNAP */}
          <motion.div
            style={{ opacity: text2Opacity, y: text2Y }}
            className="absolute inset-0 flex items-center justify-center px-8 text-center"
          >
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_30px_rgba(0,0,0,1)] md:text-7xl lg:text-8xl">
              The <br />
              <span className="text-[#98FF98]">Snap</span>
            </h2>
          </motion.div>

          {/* 43%–60%: ZERO CRASH */}
          <motion.div
            style={{ opacity: text3Opacity, y: text3Y }}
            className="absolute inset-0 flex items-center justify-center px-8 text-center"
          >
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_30px_rgba(0,0,0,1)] md:text-7xl lg:text-8xl">
              Zero <br />
              <span className="text-[#98FF98]">Crash</span>
            </h2>
          </motion.div>

          {/* 65%–100%: POP MATCHA */}
          <motion.div
            style={{ opacity: text4Opacity, y: text4Y }}
            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
          >
            <h2 className="mb-8 text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_40px_rgba(0,0,0,1)] md:text-7xl lg:text-9xl">
              Pop <span className="text-[#98FF98]">Matcha</span>
            </h2>

            <button
              suppressHydrationWarning
              className="pointer-events-auto rounded-full bg-[#98FF98] px-10 py-5 text-lg font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_40px_rgba(152,255,152,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(152,255,152,0.5)] active:scale-95 md:text-xl"
            >
              Order Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}