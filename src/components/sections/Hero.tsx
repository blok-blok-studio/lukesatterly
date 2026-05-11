"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { CountUp } from "@/components/sections/CountUp";
import { smoothScrollTo } from "@/lib/scroll";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  // Parallax is desktop-only. On mobile the y transform makes the wrapper
  // a GPU compositor layer, which triggers an iOS WebKit paint bug on any
  // descendant using mask-image / mix-blend-mode / background-clip:text —
  // those elements render incorrectly until the first scroll forces a
  // repaint (visible as a dark box under CHAPTER on load). No ancestor
  // transform = no bug.
  const [enableParallax, setEnableParallax] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnableParallax(mq.matches && !reduce.matches);
    update();
    mq.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  const heroWords = [
    { text: "Your", className: "text-white", delay: 0.1 },
    { text: "strongest", className: "text-accent", delay: 0.3 },
    { text: "chapter", className: "gradient-text", delay: 0.5 },
  ];

  return (
    <section ref={ref} className="relative min-h-[100dvh] overflow-hidden bg-[#0C0C0C]">
      {/* Base gradient — deep forest-tinged dark */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0f1f18_0%,_#0a110d_40%,_#080807_100%)]" />

      {/* Aurora orbs — desktop only (heavy blur-3xl kills mobile scroll perf) */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.7, 0.55] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full bg-[radial-gradient(circle,_rgba(0,200,100,0.28)_0%,_rgba(0,102,51,0.10)_40%,_transparent_70%)] blur-3xl"
        />
        <motion.div
          animate={{ x: [-20, 30, -20], y: [-10, 20, -10] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(74,222,128,0.12)_0%,_transparent_70%)] blur-3xl"
        />
        <motion.div
          animate={{ x: [20, -30, 20], y: [10, -20, 10] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,_rgba(0,128,61,0.18)_0%,_transparent_70%)] blur-3xl"
        />
      </div>

      {/* Mobile-only static green wash */}
      <div className="md:hidden absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(0,128,61,0.18)_0%,_transparent_60%)]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,222,128,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, transparent 55%, black 85%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, transparent 55%, black 85%, transparent 100%)",
        }}
      />

      {/* Noise overlay for film-grain texture */}
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.6)_100%)] pointer-events-none" />

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent z-20 pointer-events-none" />

      {/* Desktop headline — outside the parallax transform to avoid iOS WebKit bug */}
      <h1 className="hidden sm:flex absolute inset-0 z-0 items-center justify-center pointer-events-none select-none">
        <span className="block w-full max-w-7xl mx-auto px-6 text-center text-[clamp(3rem,8.5vw,8rem)] font-black tracking-[-0.05em] leading-[0.88] uppercase font-[family-name:var(--font-display)]">
          {heroWords.map((word) => (
            <motion.span
              key={word.text}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: word.delay, ease: [0.16, 1, 0.3, 1] }}
              className={`${word.className} block`}
            >
              {word.text}
            </motion.span>
          ))}
        </span>
      </h1>

      <motion.div style={enableParallax ? { y } : undefined} className="relative z-30 max-w-7xl mx-auto px-6 pt-24 sm:pt-24 pb-10 min-h-[100dvh] flex flex-col justify-start sm:justify-center gap-0">
        <div className="relative flex items-center justify-center">
          {/* Mobile-only overlay headline — sits inside the parallax wrapper,
              uses text-accent-light instead of gradient-text to avoid the iOS
              background-clip:text paint bug on first load */}
          <h1 className="sm:hidden absolute left-1/2 top-[78%] -translate-x-1/2 -translate-y-1/2 z-30 w-full text-[clamp(1.75rem,7.5vw,5.5rem)] font-black tracking-[-0.04em] leading-[0.9] uppercase font-[family-name:var(--font-display)] text-center pointer-events-none select-none">
            {heroWords.map((word) => {
              const mobileClass =
                word.className === "gradient-text" ? "text-accent-light" : word.className;
              return (
                <motion.span
                  key={word.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: word.delay, ease: [0.16, 1, 0.3, 1] }}
                  className={`${mobileClass} block`}
                >
                  {word.text}
                </motion.span>
              );
            })}
          </h1>

          {/* Cutout wrapper — buttons positioned relative to it */}
          <div className="relative z-10 w-full max-w-[320px] sm:max-w-[340px] lg:max-w-[380px] aspect-[2/3] mx-auto">
            {/* Base cutout (z-10) — long fade from ~60% so legs dissolve gradually */}
            <Image
              src="/luke-cutout-full.webp"
              alt="Coach Luki training on gymnastic rings in Berlin"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain z-10"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 12%, black 55%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.25) 88%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 12%, black 55%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.25) 88%, transparent 100%)",
              }}
            />

            {/* Hands + rings overlay (z-30) — same image, masked to ONLY show
                the top portion so they appear IN FRONT of the buttons */}
            <Image
              src="/luke-cutout-full.webp"
              alt=""
              aria-hidden
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain z-30 pointer-events-none"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 10%, black 35%, transparent 48%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 10%, black 35%, transparent 48%)",
              }}
            />

            {/* Left liquid-glass CTA */}
            <motion.button
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => smoothScrollTo("contact")}
              className="absolute z-40 top-[8%] left-0 sm:-left-4 md:-left-24 lg:-left-36 xl:-left-44 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full cursor-pointer group overflow-hidden backdrop-blur-sm md:backdrop-blur-xl bg-accent/45 border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.2),0_8px_24px_rgba(0,102,51,0.35),0_2px_6px_rgba(0,0,0,0.3)]"
            >
              <span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 25%, transparent 55%)",
                }}
              />
              <span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 105%, rgba(0,180,90,0.35) 0%, transparent 50%)",
                }}
              />
              <span className="relative z-10 flex items-center justify-center w-full h-full text-white text-[0.7rem] sm:text-xs md:text-base lg:text-xl xl:text-xl font-semibold text-center leading-tight px-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
                Let&apos;s Get<br />Started
              </span>
            </motion.button>

            {/* Right liquid-glass CTA */}
            <motion.button
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => smoothScrollTo("about")}
              className="absolute z-40 top-[12%] right-0 sm:-right-4 md:-right-24 lg:-right-36 xl:-right-44 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full cursor-pointer group overflow-hidden backdrop-blur-sm md:backdrop-blur-xl bg-accent/30 border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2),0_8px_24px_rgba(0,102,51,0.3),0_2px_6px_rgba(0,0,0,0.3)]"
            >
              <span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 25%, transparent 55%)",
                }}
              />
              <span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 105%, rgba(0,180,90,0.3) 0%, transparent 50%)",
                }}
              />
              <span className="relative z-10 flex items-center justify-center w-full h-full text-white text-[0.7rem] sm:text-xs md:text-base lg:text-xl xl:text-xl font-semibold text-center leading-tight px-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">
                Learn<br />More
              </span>
            </motion.button>
          </div>
        </div>

        <p className="relative z-20 -mt-10 sm:-mt-16 text-center text-base sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-4 font-semibold" style={{ color: "#ffffff", textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.8)" }}>
          Get stronger, move better, enjoy the process. Training &amp; nutrition, online or in Berlin.
        </p>

        <motion.div
          initial={{ opacity: 1, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.1, ease: "easeOut" }}
          className="mt-5 sm:mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-16 pointer-events-auto"
        >
          <motion.div
            initial={{ opacity: 1, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.2, ease: "easeOut" }}
          >
            <div className="text-4xl md:text-5xl font-black" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
              <CountUp target={100} suffix="+" />
            </div>
            <div className="text-sm mt-1 font-semibold" style={{ color: "#ffffff", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Clients</div>
          </motion.div>
          <div className="w-px h-12 bg-white/20 hidden sm:block" />
          <motion.div
            initial={{ opacity: 1, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.35, ease: "easeOut" }}
          >
            <div className="text-4xl md:text-5xl font-black" style={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
              <CountUp target={5000} suffix="+" duration={2.5} />
            </div>
            <div className="text-sm mt-1 font-semibold" style={{ color: "#ffffff", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Hours Coached</div>
          </motion.div>
          <div className="w-px h-12 bg-white/20 hidden sm:block" />
          <motion.button
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => smoothScrollTo("about")}
            className="hidden sm:flex items-center gap-2 text-sm cursor-pointer transition-colors sm:ml-auto font-semibold"
            style={{ color: "#ffffff", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
            Scroll to explore
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
