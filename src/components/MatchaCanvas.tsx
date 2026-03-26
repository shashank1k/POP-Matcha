"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const TOTAL_FRAMES = 176;

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

  /**
   * =========================
   * 🔥 CLAMP PROGRESS (HOLD EFFECT)
   * =========================
   */

  /**
   * =========================
   * PRELOAD IMAGES
   * =========================
   */

  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;

    const preloadImages = async () => {
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

          img.onerror = () => resolve(null);
        });
      });

      const results = await Promise.all(promises);

      if (!isMounted) return;

      const validImages = results.filter(
        (img): img is HTMLImageElement => img !== null,
      );

      setImages(validImages);
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

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, w, h);
      const freezePoint = 0.7; // same as text lock

      const clampedProgress = Math.min(progress, freezePoint);

      const animationEnd = 0.85;
      const normalized = Math.min(clampedProgress / animationEnd, 1);
      const frameIndex = Math.floor(normalized * (images.length - 1));
      const img = images[frameIndex];
      if (!img) return;

      const ratio = Math.max(w / img.width, h / img.height);
      const dw = img.width * ratio;
      const dh = img.height * ratio;

      const x = (w - dw) / 2;
      const y = (h - dh) / 2 + 100;

      ctx.drawImage(img, x, y, dw, dh);
    },
    [images],
  );
  useEffect(() => {
    if (images.length === 0 || isLoading) return;

    renderFrame(scrollYProgress.get());

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      renderFrame(latest);
    });

    const handleResize = () => {
      renderFrame(scrollYProgress.get());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [images, isLoading, scrollYProgress, renderFrame]);
  /**
   * TEXT TIMELINES (REAL FIX)
   */

  // PURE ENERGY
  const text1Opacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.14, 0.18],
    [0, 1, 1, 0],
  );

  const text1Y = useTransform(
    scrollYProgress,
    [0, 0.04, 0.14, 0.18],
    [30, 0, 0, -30],
  );

  // SNAP
  const text2Opacity = useTransform(
    scrollYProgress,
    [0.2, 0.24, 0.34, 0.38],
    [0, 1, 1, 0],
  );

  const text2Y = useTransform(
    scrollYProgress,
    [0.2, 0.24, 0.34, 0.38],
    [30, 0, 0, -30],
  );

  // ZERO CRASH
  const text3Opacity = useTransform(
    scrollYProgress,
    [0.4, 0.44, 0.54, 0.58],
    [0, 1, 1, 0],
  );

  const text3Y = useTransform(
    scrollYProgress,
    [0.4, 0.44, 0.54, 0.58],
    [30, 0, 0, -30],
  );

  // FINAL SECTION
  const text4Opacity = useTransform(scrollYProgress, (v) => {
    if (v < 0.6) return 0;
    if (v < 0.7) return (v - 0.6) / 0.1; // fade in

    return 1; // 🔥 LOCKED after 70%
  });

  /**
   * =========================
   * LOADER
   * =========================
   */
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black text-white">
        Loading {loadProgress}%
      </div>
    );
  }

  /**
   * =========================
   * MAIN UI (UNCHANGED)
   * =========================
   */
  return (
    <div ref={containerRef} className="relative h-[1150vh] bg-[#050505]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full z-0"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-black/15 z-10" />

        {/* TEXT */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {/* PURE ENERGY */}
          <motion.div
            style={{ opacity: text1Opacity, y: text1Y }}
            className="absolute inset-0 flex items-center justify-center px-8 text-center"
          >
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.9)] md:text-7xl lg:text-9xl">
              Pure{" "}
              <span className="text-[#98FF98] drop-shadow-[0_0_25px_rgba(152,255,152,0.7)]">
                Energy
              </span>
            </h2>
          </motion.div>

          {/* SNAP */}
          <motion.div
            style={{ opacity: text2Opacity, y: text2Y }}
            className="absolute inset-0 flex items-center justify-center px-8 text-center"
          >
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.9)] md:text-7xl lg:text-8xl">
              Crack - Sip
              <br />
              <span className="text-[#98FF98] drop-shadow-[0_0_25px_rgba(152,255,152,0.7)]">
                Boom
              </span>
            </h2>
          </motion.div>

          {/* ZERO CRASH */}
          <motion.div
            style={{ opacity: text3Opacity, y: text3Y }}
            className="absolute inset-0 flex items-center justify-center px-8 text-center"
          >
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.9)] md:text-7xl lg:text-8xl">
              No Crash
              <br />
              <span className="text-[#98FF98] drop-shadow-[0_0_25px_rgba(152,255,152,0.7)]">
                Just Flow
              </span>
            </h2>
          </motion.div>

          {/* FINAL (STATIC) */}
          <motion.div
            id="hero"
            style={{
              opacity: text4Opacity,
              transform: "translateY(0px)", // keep stagnant
            }}
            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
          >
            <h2 className="mb-8 text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[0_10px_50px_rgba(0,0,0,0.95)] md:text-7xl lg:text-9xl">
              Pop{" "}
              <span className="text-[#98FF98] drop-shadow-[0_0_30px_rgba(152,255,152,0.9)]">
                Matcha
              </span>
            </h2>

            <button className="pointer-events-auto rounded-full bg-[#98FF98] px-10 py-5 text-lg font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_30px_rgba(152,255,152,0.5)]">
              Order Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
