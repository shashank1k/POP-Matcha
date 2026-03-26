"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function MatchaCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const totalFrames = 176;

  // =========================
  // 📜 SCROLL
  // =========================
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    mass: 0.3,
  });

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // =========================
  // 🎬 TEXT ANIMATIONS (WITH HOLD)
  // =========================

  // TEXT 1 (HOLD longer)
  const text1Opacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.3, 0.4],
    [1, 1, 0.8, 0],
  );
  const text1Y = useTransform(
    smoothProgress,
    [0, 0.4],
    [0, isMobile ? -40 : -80],
  );
  const text1Blur = useTransform(
    text1Opacity,
    (o) => `blur(${(1 - o) * 10}px)`,
  );

  // TEXT 2
  const text2Opacity = useTransform(
    smoothProgress,
    [0.25, 0.4, 0.55, 0.65],
    [0, 1, 1, 0],
  );
  const text2Y = useTransform(
    smoothProgress,
    [0.25, 0.65],
    [isMobile ? 40 : 80, isMobile ? -40 : -80],
  );
  const text2Blur = useTransform(
    text2Opacity,
    (o) => `blur(${(1 - o) * 10}px)`,
  );

  // TEXT 3
  const text3Opacity = useTransform(
    smoothProgress,
    [0.5, 0.65, 0.8, 0.9],
    [0, 1, 1, 0],
  );
  const text3Y = useTransform(
    smoothProgress,
    [0.5, 0.9],
    [isMobile ? 40 : 80, isMobile ? -40 : -80],
  );
  const text3Blur = useTransform(
    text3Opacity,
    (o) => `blur(${(1 - o) * 10}px)`,
  );

  // FINAL TEXT
  const text4Opacity = useTransform(smoothProgress, [0.8, 0.95], [0, 1]);

  // =========================
  // 🎥 FRAME CANVAS
  // =========================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frame = String(i).padStart(3, "0");
      img.src = `/Frames/ezgif-frame-${frame}.jpg`;
      images.push(img);
    }

    const drawImage = (img: HTMLImageElement) => {
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      let drawWidth, drawHeight;

      if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
      } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
      }

      const x = (canvas.width - drawWidth) / 2;
      const y = (canvas.height - drawHeight) / 2 + 100;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
    };

    // first frame
    images[0].onload = () => drawImage(images[0]);

    const unsubscribe = smoothProgress.on("change", (v) => {
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(v * (totalFrames - 1)),
      );

      const img = images[frameIndex];
      if (img && img.complete) {
        drawImage(img);
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", resize);
    };
  }, [smoothProgress]);

  // =========================
  // 🧱 UI
  // =========================
  return (
    <div
      ref={containerRef}
      className="relative h-[400vh] md:h-[500vh] bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full z-0"
        />

        <div className="absolute inset-0 bg-black/30 z-10" />

        <div className="pointer-events-none absolute inset-0 z-20">
          {/* TEXT 1 */}
          <motion.div
            style={{ opacity: text1Opacity, y: text1Y, filter: text1Blur }}
            className="absolute inset-0 flex items-center justify-center text-center"
          >
            <h2 className="text-5xl md:text-9xl font-black text-white">
              Pure <span className="text-[#98FF98]">Energy</span>
            </h2>
          </motion.div>

          {/* TEXT 2 */}
          <motion.div
            style={{ opacity: text2Opacity, y: text2Y, filter: text2Blur }}
            className="absolute inset-0 flex items-center justify-center text-center"
          >
            <h2 className="text-5xl md:text-8xl font-black text-white">
              Crack - Sip
              <br />
              <span className="text-[#98FF98]">Boom</span>
            </h2>
          </motion.div>

          {/* TEXT 3 */}
          <motion.div
            style={{ opacity: text3Opacity, y: text3Y, filter: text3Blur }}
            className="absolute inset-0 flex items-center justify-center text-center"
          >
            <h2 className="text-5xl md:text-8xl font-black text-white">
              No Crash
              <br />
              <span className="text-[#98FF98]">Just Flow</span>
            </h2>
          </motion.div>

          {/* FINAL */}
          <motion.div
            id="hero"
            style={{ opacity: text4Opacity }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <h2 className="text-6xl md:text-9xl font-black text-white mb-6">
              Pop <span className="text-[#98FF98]">Matcha</span>
            </h2>

            <button className="pointer-events-auto bg-[#98FF98] text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition">
              Order Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
