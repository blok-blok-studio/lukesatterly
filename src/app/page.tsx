"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

/* ─────────────────── ANIMATED COUNTER ─────────────────── */
function CountUp({ target, suffix = "", duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;
    const startTime = performance.now();
    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─────────────────── SCROLL-DRIVEN ZOOM WRAPPER ─────────────────── */
/**
 * Wraps a section with a scroll-driven scale + fade-in animation.
 * Disabled on mobile (< 768px) and when `prefers-reduced-motion` is set
 * to avoid jank and respect user preferences. On those configurations
 * the children render as a plain block with no motion hooks attached.
 */
function ScrollZoom({ children, className = "", intensity = 0.75 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }
  return <ScrollZoomInner className={className} intensity={intensity}>{children}</ScrollZoomInner>;
}

function ScrollZoomInner({ children, className, intensity }: { children: React.ReactNode; className: string; intensity: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.3"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [intensity, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80 * (1 - intensity), 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ scale, y, opacity }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/* ─────────────────── LEGACY WRAPPER (passthrough) ─────────────────── */
function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <ScrollZoom className={className}>
      {children}
    </ScrollZoom>
  );
}

/* ─────────────────── SMOOTH SCROLL HELPER ─────────────────── */
function smoothScrollTo(targetId: string) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const navHeight = 80;
  const targetY = el.getBoundingClientRect().top + window.scrollY - navHeight;
  const startY = window.scrollY;
  const distance = targetY - startY;
  const duration = Math.min(1400, Math.max(800, Math.abs(distance) * 0.5));
  let startTime: number | null = null;

  function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ─────────────────── NAV ─────────────────── */
function Navbar() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: t.nav.about, href: "about" },
    { label: t.nav.services, href: "services" },
    { label: t.nav.pricing, href: "pricing" },
    { label: t.nav.locations, href: "locations" },
    { label: t.nav.faq, href: "faq" },
  ];

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    smoothScrollTo(targetId);
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0C0C0C]/90 backdrop-blur-md md:backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <Image src="/logo-icon-green.svg" alt="Coach Luki — Personal Trainer Berlin logo" width={32} height={32} className="w-8 h-8" priority />
          <span className="text-xl font-bold tracking-tight font-[family-name:var(--font-display)]">
            <span className="gradient-text">COACH</span>{" "}
            <span className="text-white">LUKI</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 tracking-wide uppercase cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={(e) => handleNavClick(e, "contact")}
            className="bg-accent text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-accent-light hover:shadow-[0_0_30px_rgba(0,102,51,0.3)] transition-all duration-300 cursor-pointer"
          >
            {t.nav.applyNow}
          </button>
          <LanguageSwitcher />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher compact />
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 p-2"
          aria-label={t.a11y.toggleMenu}
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-0.5 bg-white"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white"
          />
        </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0C0C0C]/98 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map((link) => (
                <button
                  key={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-lg text-zinc-300 hover:text-white transition-colors py-2 text-left cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={(e) => handleNavClick(e, "contact")}
                className="bg-accent text-white px-5 py-3 rounded-full text-center font-semibold mt-2 cursor-pointer"
              >
                {t.nav.applyNow}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ─────────────────── HERO ─────────────────── */
function Hero() {
  const t = useT();
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
    { text: t.hero.word1, className: "text-white", delay: 0.1 },
    { text: t.hero.word2, className: "text-transparent [-webkit-text-stroke:2px_var(--accent)]", delay: 0.3 },
    { text: t.hero.word3, className: "gradient-text", delay: 0.5 },
  ];

  return (
    <section ref={ref} className="relative min-h-[100dvh] overflow-hidden bg-[#0C0C0C]">
      {/* Background: layered atmosphere — deep base, green radial glows, grid, noise, vignette */}
      {/* Base gradient — deep forest-tinged dark */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0f1f18_0%,_#0a110d_40%,_#080807_100%)]" />

      {/* Aurora orbs — desktop only (heavy blur-3xl kills mobile scroll perf).
          Mobile gets a single static green wash below to keep the vibe. */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        {/* Large green aurora glow — behind Luke */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.7, 0.55] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full bg-[radial-gradient(circle,_rgba(0,200,100,0.28)_0%,_rgba(0,102,51,0.10)_40%,_transparent_70%)] blur-3xl"
        />
        {/* Secondary side accents */}
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

      {/* Mobile-only static green wash — cheap, no blur, no animation */}
      <div className="md:hidden absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(0,128,61,0.18)_0%,_transparent_60%)]" />

      {/* Subtle grid pattern — pushed well beyond the headline area so it
          doesn't show as boxes behind or inside the text. Transparent center
          extends past the hero copy; grid only hints at the far edges. */}
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

      {/* Vignette — darkens edges so center/content pops */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.6)_100%)] pointer-events-none" />

      {/* Bottom fade into next section — taller + smoother for clean transition */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent z-20 pointer-events-none" />

      {/* Desktop headline — constrained to the SAME max-w-7xl container as the nav
          so the text aligns with the logo (left) and Apply Now (right). */}
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
        {/* Image + overlaid headline + buttons */}
        <div className="relative flex items-center justify-center">
          {/* Mobile-only overlay headline — sits on Luke's chest */}
          <h1 className="sm:hidden absolute left-1/2 top-[78%] -translate-x-1/2 -translate-y-1/2 z-30 w-full text-[clamp(1.75rem,7.5vw,5.5rem)] font-black tracking-[-0.04em] leading-[0.9] uppercase font-[family-name:var(--font-display)] text-center pointer-events-none select-none">
            {heroWords.map((word) => {
              // On mobile the headline lives inside a parallaxing motion.div
              // (transform ancestor), which trips an iOS Safari bug where
              // background-clip:text (used by .gradient-text) fails on first
              // paint and renders a black box around the word until a scroll
              // forces a repaint. Swap the chapter gradient for a solid
              // accent-light on mobile only — desktop h1 is outside the
              // transform and keeps the gradient.
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
              src="/coach-luki-personal-trainer-berlin-rings.webp"
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
                the top portion (rings + hands + forearms) so they appear IN FRONT
                of the buttons. The mask fades out below the rings so nothing else
                doubles up. */}
            <Image
              src="/coach-luki-personal-trainer-berlin-rings.webp"
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

            {/* Left liquid-glass CTA — green tinted */}
            <motion.button
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => smoothScrollTo("contact")}
              className="absolute z-40 top-[8%] left-0 sm:-left-4 md:-left-24 lg:-left-36 xl:-left-44 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full cursor-pointer group overflow-hidden backdrop-blur-sm md:backdrop-blur-xl bg-accent/45 border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.2),0_8px_24px_rgba(0,102,51,0.35),0_2px_6px_rgba(0,0,0,0.3)]"
            >
              {/* Radial glossy highlight — soft sphere-like shading, no hard edges */}
              <span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 25%, transparent 55%)",
                }}
              />
              {/* Bottom edge glow */}
              <span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 105%, rgba(0,180,90,0.35) 0%, transparent 50%)",
                }}
              />
              <span className="relative z-10 flex items-center justify-center w-full h-full text-white text-[0.7rem] sm:text-xs md:text-base lg:text-xl xl:text-xl font-semibold text-center leading-tight px-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] whitespace-pre-line">
                {t.hero.ctaPrimary}
              </span>
            </motion.button>

            {/* Right liquid-glass CTA — green tinted to match brand */}
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
              <span className="relative z-10 flex items-center justify-center w-full h-full text-white text-[0.7rem] sm:text-xs md:text-base lg:text-xl xl:text-xl font-semibold text-center leading-tight px-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] whitespace-pre-line">
                {t.hero.ctaSecondary}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Subtitle — sits just below the headline on mobile, normal on desktop */}
        <p className="relative z-20 -mt-10 sm:-mt-16 text-center text-base sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-4 font-semibold" style={{ color: "#ffffff", textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.8)" }}>
          {t.hero.subtitle}
        </p>

        {/* Bottom stats row */}
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
            <div className="text-sm mt-1 font-semibold" style={{ color: "#ffffff", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{t.hero.statClients}</div>
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
            <div className="text-sm mt-1 font-semibold" style={{ color: "#ffffff", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{t.hero.statHours}</div>
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
            {t.hero.scrollExplore}
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}


/* ─────────────────── ABOUT (light bg) ─────────────────── */
function About() {
  const t = useT();
  const ref = useRef(null);

  return (
    <section id="about" className="py-8 sm:py-12 px-4 sm:px-6 scroll-mt-20">
      {/* Light container on dark page */}
      <div ref={ref} className="max-w-7xl mx-auto light-container py-20 sm:py-28 px-6 sm:px-10 lg:px-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ x: -15 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100">
              <Image
                src="/coach-luki-trainer-berlin-portrait.webp"
                alt="Luke Satterly (Coach Luki) — certified personal trainer and nutritionist in Berlin"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-4 -right-4 sm:right-4 bg-white rounded-xl px-5 py-4 shadow-xl border border-zinc-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="44" stroke="var(--accent)" strokeWidth="6" />
                    <path d="M30 30 Q32 55 50 78 Q68 55 70 30" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <path d="M58 38 C62 30 68 24 78 20 C74 30 68 36 62 42 Z" fill="var(--accent)" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-800">{t.about.badge}</div>
                  <div className="text-xs text-zinc-500">{t.about.badgeSubtitle}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ x: 15 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-stone-900">
              {t.about.headingPrefix} <span className="gradient-text">{t.about.headingName}</span>
            </h2>
            <div className="mt-8 space-y-5 text-zinc-600 leading-relaxed text-lg">
              <p>
                {t.about.paragraph1Pre}
                <strong className="text-stone-900">{t.about.paragraph1Gym1}</strong>
                {t.about.paragraph1Mid}
                <strong className="text-stone-900">{t.about.paragraph1Gym2}</strong>
                {t.about.paragraph1Post}
              </p>
              <p>
                {t.about.paragraph2Pre}
                <strong className="text-stone-900">{t.about.paragraph2Strong}</strong>
                {t.about.paragraph2Mid}
                <em>{t.about.paragraph2Em}</em>
                {t.about.paragraph2Post}
              </p>
              <p>
                {t.about.paragraph3Pre}
                <strong className="text-stone-900">{t.about.paragraph3Strong}</strong>
                {t.about.paragraph3Post}
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {t.about.bullets.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ x: 10 }}
                  whileInView={{ x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease: "easeOut" }}
                  className="flex items-start gap-3 text-stone-700"
                >
                  <svg className="w-5 h-5 text-accent-dark mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── SERVICES (dark container) ─────────────────── */
function Services() {
  const t = useT();
  const ref = useRef(null);

  const serviceIcons = [
    <svg key="i0" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>,
    <svg key="i1" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>,
    <svg key="i2" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>,
  ];
  const services = t.services.items.map((item, i) => ({ ...item, icon: serviceIcons[i] }));

  return (
    <section id="services" className="py-24 sm:py-32 radial-glow-green scroll-mt-20">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ y: 40, scale: 0.85 }}
          whileInView={{ y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-accent text-sm font-medium uppercase tracking-widest">
            {t.services.eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
            {t.services.headingPrefix} <span className="gradient-text">{t.services.headingAccent}</span>
          </h2>
          <p className="text-zinc-400 mt-6 max-w-xl mx-auto text-lg">
            {t.services.intro}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ y: 50, scale: 0.8 }}
              whileInView={{ y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative bg-surface border border-white/[0.04] rounded-2xl p-8 hover:border-accent/20 transition-shadow duration-500 hover:shadow-[0_0_50px_rgba(0,102,51,0.06)]"
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent/20 transition-colors cursor-pointer"
              >
                {service.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">{service.description}</p>
              <ul className="space-y-2.5">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-zinc-500">
                    <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              {/* Bottom glow on hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── BEFORE & AFTER ─────────────────── */
function BeforeAfter() {
  const t = useT();
  const ref = useRef(null);

  const beforeAfterImages = [
    { before: "/hayley-fitness-transformation-before.webp", after: "/hayley-fitness-transformation-after.webp" },
    { before: "/diren-fitness-transformation-before.webp", after: "/diren-fitness-transformation-after.webp" },
    { before: "/james-fitness-transformation-before.webp", after: "/james-fitness-transformation-after.webp" },
  ];
  const transformations = t.beforeAfter.transformations.map((tr, i) => ({
    ...tr,
    before: beforeAfterImages[i].before,
    after: beforeAfterImages[i].after,
  }));

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 scroll-mt-20">
      <div ref={ref} className="max-w-7xl mx-auto light-container py-20 sm:py-28 px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ y: 40, scale: 0.85 }}
          whileInView={{ y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-accent-dark text-sm font-medium uppercase tracking-widest">
            {t.beforeAfter.eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 text-stone-900">
            {t.beforeAfter.headingPrefix} <span className="gradient-text">{t.beforeAfter.headingAccent}</span>
          </h2>
          <p className="text-zinc-500 mt-6 max-w-xl mx-auto text-lg">
            {t.beforeAfter.intro}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {transformations.map((tr, i) => (
            <motion.div
              key={tr.name}
              initial={{ y: 50, scale: 0.8 }}
              whileInView={{ y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-200">
                  <Image
                    src={tr.before}
                    alt={`${tr.name} fitness transformation before — starting point of ${tr.duration} personal training with Coach Luki`}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[11px] font-medium text-white">
                    {t.beforeAfter.beforeLabel}
                  </div>
                </div>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-200">
                  <Image
                    src={tr.after}
                    alt={`${tr.name} fitness transformation after ${tr.duration} of personal training with Coach Luki — ${tr.result}`}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-accent/80 backdrop-blur-sm text-[11px] font-medium text-white">
                    {t.beforeAfter.afterLabel}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-stone-800">{tr.name}</p>
                <p className="text-sm text-zinc-500">{tr.duration} &mdash; {tr.result}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ y: 40, scale: 0.85 }}

          whileInView={{ y: 0, scale: 1 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-12"
        >
          <button
            onClick={() => {
              const el = document.getElementById("contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-full hover:bg-accent-light hover:shadow-[0_0_30px_rgba(0,102,51,0.3)] transition-all duration-300 cursor-pointer"
          >
            {t.beforeAfter.cta}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────── PRICING ─────────────────── */
function Pricing() {
  const t = useT();
  const ref = useRef(null);
  const [tab, setTab] = useState<"online" | "personal" | "corporate">("personal");

  const onlinePlans = [
    {
      name: t.pricing.online.remote.name,
      price: "95",
      period: t.pricing.perMonth,
      note: t.pricing.minMonths6,
      description: t.pricing.online.remote.description,
      features: t.pricing.online.remote.features,
      cta: t.pricing.online.remote.cta,
      href: "https://buy.stripe.com/test_28EfZi3lb8dZ6z62T94F205",
      popular: false,
      dark: false,
    },
    {
      name: t.pricing.online.advanced.name,
      price: "240",
      period: t.pricing.perMonth,
      note: t.pricing.online.advanced.note,
      description: t.pricing.online.advanced.description,
      features: t.pricing.online.advanced.features,
      cta: t.pricing.online.advanced.cta,
      href: "https://buy.stripe.com/test_aFaeVe5tjcuf5v28dt4F204",
      popular: true,
      dark: true,
    },
    {
      name: t.pricing.online.elite.name,
      price: "480",
      period: t.pricing.perMonth,
      note: null as string | null,
      description: t.pricing.online.elite.description,
      features: t.pricing.online.elite.features,
      cta: t.pricing.online.elite.cta,
      href: "https://buy.stripe.com/test_4gM14odZP1PBf5CalB4F203",
      popular: false,
      dark: false,
    },
  ];

  const personalPlans = [
    {
      name: t.pricing.personal.elevate.name,
      price: "390",
      period: t.pricing.perMonth,
      note: t.pricing.minMonths3,
      sessions: t.pricing.sessionsPerMonth4,
      description: t.pricing.personal.elevate.description,
      features: t.pricing.personal.elevate.features,
      cta: t.pricing.personal.elevate.cta,
      href: "https://buy.stripe.com/test_4gM28s2h7am72iQalB4F207",
      popular: true,
      dark: true,
    },
    {
      name: t.pricing.personal.intensive.name,
      price: "780",
      period: t.pricing.perMonth,
      note: t.pricing.minMonths3,
      sessions: t.pricing.sessionsPerMonth8,
      description: t.pricing.personal.intensive.description,
      features: t.pricing.personal.intensive.features,
      cta: t.pricing.personal.intensive.cta,
      href: "https://buy.stripe.com/test_8x200kaND0Lx8HebpF4F206",
      popular: false,
      dark: false,
    },
  ];

  const packages = [
    { sessions: 6, price: "630", href: "https://buy.stripe.com/test_dRm6oIg7Xdyj9LictJ4F202", popular: false },
    { sessions: 12, price: "1,260", href: "https://buy.stripe.com/test_9B64gA6xn0Lx2iQ9hx4F201", popular: true },
    { sessions: 24, price: "2,260", href: "https://buy.stripe.com/test_8x25kEf3T1PBbTq9hx4F200", popular: false },
  ];

  const CheckIcon = ({ dark }: { dark: boolean }) => (
    <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${dark ? "text-accent" : "text-accent-dark"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );

  return (
    <section id="pricing" className="py-8 sm:py-12 px-4 sm:px-6 scroll-mt-20">
      <div ref={ref} className="max-w-7xl mx-auto light-container py-20 sm:py-28 px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ y: 40, scale: 0.85 }}

          whileInView={{ y: 0, scale: 1 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-accent-dark text-sm font-medium uppercase tracking-widest">
            {t.pricing.eyebrow}
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold mt-4 text-stone-900">
            {t.pricing.headingPrefix} <span className="gradient-text">{t.pricing.headingAccent}</span>
          </h2>
          <p className="text-zinc-500 mt-6 max-w-lg mx-auto text-lg">
            {t.pricing.intro}
          </p>
          <p className="text-zinc-500 mt-4 max-w-xl mx-auto text-sm">
            {t.pricing.consultPre}{" "}
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="text-accent-dark font-semibold underline underline-offset-2 hover:text-accent transition-colors cursor-pointer"
            >
              {t.pricing.consultLink}
            </button>{" "}
            {t.pricing.consultPost}
          </p>

          {/* Tab toggle — flex on mobile wraps, all three tabs high-contrast so none get missed */}
          <div className="mt-10 inline-flex flex-wrap justify-center gap-2 rounded-full bg-stone-100 p-1.5 max-w-full">
            <button
              onClick={() => setTab("personal")}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer border ${
                tab === "personal"
                  ? "bg-accent text-white shadow-[0_4px_14px_rgba(0,102,51,0.25)] border-accent"
                  : "bg-white text-accent-dark border-accent/30 hover:bg-accent/5 hover:border-accent/60"
              }`}
            >
              {t.pricing.tabPersonal}
            </button>
            <button
              onClick={() => setTab("online")}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer border ${
                tab === "online"
                  ? "bg-accent text-white shadow-[0_4px_14px_rgba(0,102,51,0.25)] border-accent"
                  : "bg-white text-accent-dark border-accent/30 hover:bg-accent/5 hover:border-accent/60"
              }`}
            >
              {t.pricing.tabOnline}
            </button>
            <button
              onClick={() => setTab("corporate")}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer border ${
                tab === "corporate"
                  ? "bg-accent text-white shadow-[0_4px_14px_rgba(0,102,51,0.25)] border-accent"
                  : "bg-white text-accent-dark border-accent/30 hover:bg-accent/5 hover:border-accent/60"
              }`}
            >
              {t.pricing.tabCorporate}
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {tab === "corporate" ? (
            <motion.div
              key="corporate"
              initial={{ y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ y: 40, scale: 0.85 }}
                  whileInView={{ y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative rounded-2xl bg-stone-900 text-white p-8 sm:p-12"
                >
                  <div className="text-center">
                    <h3 className="text-2xl sm:text-3xl font-bold">
                      {t.pricing.corporate.heading}
                    </h3>
                    <p className="mt-4 text-zinc-300 leading-relaxed max-w-xl mx-auto">
                      {t.pricing.corporate.intro}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-10">
                    {t.pricing.corporate.cards.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-5"
                      >
                        <h4 className="font-semibold text-white">{item.title}</h4>
                        <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 text-center">
                    <p className="text-sm text-zinc-400 mb-6">
                      {t.pricing.corporate.footer}
                    </p>
                    <button
                      onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                      className="inline-block bg-accent text-white px-8 py-4 rounded-xl font-semibold hover:bg-accent-light hover:shadow-[0_0_30px_rgba(0,102,51,0.3)] transition-all duration-300 cursor-pointer"
                    >
                      {t.pricing.corporate.cta}
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : tab === "online" ? (
            <motion.div
              key="online"
              initial={{ y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
                {onlinePlans.map((plan, i) => (
                  <motion.div
                    key={plan.name}
                    initial={{ y: 40, scale: 0.85 }}

                    whileInView={{ y: 0, scale: 1 }}

                    viewport={{ once: true }}

                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative rounded-2xl p-8 sm:p-10 transition-all duration-500 ${
                      plan.dark
                        ? "bg-stone-900 text-white ring-2 ring-accent/50 shadow-[0_0_60px_rgba(0,102,51,0.1)] lg:scale-[1.02]"
                        : "bg-[#F7F5F0] border border-stone-200 hover:border-stone-300 hover:shadow-lg"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-accent text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full whitespace-nowrap">
                          {t.pricing.mostPopular}
                        </span>
                      </div>
                    )}
                    <h3 className={`text-xl font-bold ${plan.dark ? "text-white" : "text-stone-900"}`}>
                      {plan.name}
                    </h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className={`text-5xl font-bold tracking-tight ${plan.dark ? "text-white" : "text-stone-900"}`}>
                        &euro;{plan.price}
                      </span>
                      <span className={`text-sm ${plan.dark ? "text-zinc-400" : "text-zinc-500"}`}>
                        {plan.period}
                      </span>
                    </div>
                    {plan.note && (
                      <p className={`mt-2 text-xs font-medium ${plan.dark ? "text-accent" : "text-accent-dark"}`}>
                        {plan.note}
                      </p>
                    )}
                    <p className={`mt-4 text-sm leading-relaxed ${plan.dark ? "text-zinc-300" : "text-zinc-500"}`}>
                      {plan.description}
                    </p>
                    <ul className="mt-8 space-y-3">
                      {plan.features.map((f) => (
                        <li key={f} className={`flex items-start gap-3 text-sm ${plan.dark ? "text-zinc-200" : "text-zinc-600"}`}>
                          <CheckIcon dark={plan.dark} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={plan.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-8 block w-full py-4 rounded-xl text-center font-semibold transition-all duration-300 text-base cursor-pointer ${
                        plan.dark
                          ? "bg-accent text-white hover:bg-accent-light hover:shadow-[0_0_30px_rgba(0,102,51,0.3)]"
                          : "bg-stone-900 text-white hover:bg-stone-800"
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="personal"
              initial={{ y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Monthly plans */}
              <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
                {personalPlans.map((plan, i) => (
                  <motion.div
                    key={plan.name}
                    initial={{ y: 40, scale: 0.85 }}

                    whileInView={{ y: 0, scale: 1 }}

                    viewport={{ once: true }}

                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative rounded-2xl p-8 sm:p-10 transition-all duration-500 ${
                      plan.dark
                        ? "bg-stone-900 text-white ring-2 ring-accent/50 shadow-[0_0_60px_rgba(0,102,51,0.1)] lg:scale-[1.02]"
                        : "bg-[#F7F5F0] border border-stone-200 hover:border-stone-300 hover:shadow-lg"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-accent text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full whitespace-nowrap">
                          {t.pricing.mostPopular}
                        </span>
                      </div>
                    )}
                    <h3 className={`text-xl font-bold ${plan.dark ? "text-white" : "text-stone-900"}`}>
                      {plan.name}
                    </h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className={`text-5xl font-bold tracking-tight ${plan.dark ? "text-white" : "text-stone-900"}`}>
                        &euro;{plan.price}
                      </span>
                      <span className={`text-sm ${plan.dark ? "text-zinc-400" : "text-zinc-500"}`}>
                        {plan.period}
                      </span>
                    </div>
                    <div className={`mt-2 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
                      plan.dark ? "bg-accent text-white" : "bg-accent-dark/10 text-accent-dark"
                    }`}>
                      {plan.sessions}
                    </div>
                    <p className={`mt-1 text-xs font-medium ${plan.dark ? "text-zinc-400" : "text-zinc-500"}`}>
                      {plan.note}
                    </p>
                    <p className={`mt-4 text-sm leading-relaxed ${plan.dark ? "text-zinc-300" : "text-zinc-500"}`}>
                      {plan.description}
                    </p>
                    <ul className="mt-8 space-y-3">
                      {plan.features.map((f) => (
                        <li key={f} className={`flex items-start gap-3 text-sm ${plan.dark ? "text-zinc-200" : "text-zinc-600"}`}>
                          <CheckIcon dark={plan.dark} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={plan.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-8 block w-full py-4 rounded-xl text-center font-semibold transition-all duration-300 text-base cursor-pointer ${
                        plan.dark
                          ? "bg-accent text-white hover:bg-accent-light hover:shadow-[0_0_30px_rgba(0,102,51,0.3)]"
                          : "bg-stone-900 text-white hover:bg-stone-800"
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </motion.div>
                ))}
              </div>

              {/* Flexible packages */}
              <div className="max-w-4xl mx-auto mt-8">
                <motion.div
                  initial={{ y: 40, scale: 0.85 }}

                  whileInView={{ y: 0, scale: 1 }}

                  viewport={{ once: true }}

                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl bg-[#F7F5F0] border border-stone-200 p-8 sm:p-10"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-stone-900">{t.pricing.packages.heading}</h3>
                      <p className="text-zinc-500 text-sm mt-1">{t.pricing.packages.subheading}</p>
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wider text-accent-dark bg-accent-dark/10 rounded-full px-4 py-1.5 self-start">
                      {t.pricing.packages.noMinimum}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {packages.map((pkg) => (
                      <a
                        key={pkg.sessions}
                        href={pkg.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative flex flex-col items-center rounded-xl p-6 transition-all duration-300 cursor-pointer ${
                          pkg.popular
                            ? "border-2 border-accent-dark bg-white shadow-lg sm:scale-[1.04] hover:shadow-xl"
                            : "border border-stone-200 bg-white hover:border-accent-dark/30 hover:shadow-lg"
                        }`}
                      >
                        {pkg.popular && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-accent-dark text-white rounded-full px-3 py-1 shadow-md">
                            {t.pricing.mostPopular}
                          </span>
                        )}
                        <span
                          className={`text-3xl font-bold transition-colors ${
                            pkg.popular
                              ? "text-accent-dark"
                              : "text-stone-900 group-hover:text-accent-dark"
                          }`}
                        >
                          &euro;{pkg.price}
                        </span>
                        <span
                          className={`mt-2 text-xs font-bold uppercase tracking-wider rounded-full px-4 py-1.5 ${
                            pkg.popular
                              ? "bg-accent-dark text-white"
                              : "bg-stone-900 text-white"
                          }`}
                        >
                          {pkg.sessions} {t.pricing.packages.sessionsLabel}
                        </span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-zinc-400 text-sm mt-10">
          {t.pricing.secureNote}
        </p>
      </div>
    </section>
  );
}

/* ─────────────────── THE LUKI METHOD (light section) ─────────────────── */

/* Hook: returns true once scroll progress passes a threshold, stays true */
function useScrollThreshold(progress: ReturnType<typeof useTransform<number, number>>, threshold: number) {
  const [reached, setReached] = useState(false);
  useEffect(() => {
    const unsubscribe = progress.on("change", (v: number) => {
      if (v >= threshold && !reached) setReached(true);
    });
    return unsubscribe;
  }, [progress, threshold, reached]);
  return reached;
}

/* Single mobile Method step — activates when its node enters the viewport */
function MethodStep({
  s,
  isLast,
}: {
  s: { step: string; title: string; description: string };
  isLast: boolean;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  /* Activate as soon as the node crosses ~35% down from the top of the viewport
     (so items light up when they're comfortably in view, not when they bottom-out) */
  const isActive = useInView(itemRef, { once: true, margin: "0px 0px -35% 0px" });

  return (
    <div ref={itemRef} className={`relative flex gap-5 sm:gap-6 ${isLast ? "" : "pb-8 sm:pb-10"}`}>
      {/* Connector — absolute so it bridges through the pb padding to the
          next item's dot (flex-1 would be capped to the content box). */}
      {!isLast && (
        <div
          aria-hidden
          className={`absolute left-[23px] sm:left-[27px] top-14 sm:top-16 bottom-0 w-0.5 -translate-x-px transition-colors duration-700 ${
            isActive ? "bg-gradient-to-b from-accent to-accent-light" : "bg-white/15"
          }`}
        />
      )}

      <div className="shrink-0 z-10">
        <motion.div
          animate={
            isActive
              ? { scale: [1, 1.3, 0.9, 1.1, 1], rotate: [0, -5, 5, -3, 0] }
              : {}
          }
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors duration-500 border ${
            isActive
              ? "bg-[#0C0C0C] border-accent/60 shadow-[0_0_20px_rgba(0,180,90,0.45)]"
              : "bg-white/10 border-white/20"
          }`}
        >
          <span
            className={`text-base sm:text-lg font-bold transition-colors duration-500 ${
              isActive ? "text-accent" : "text-white/50"
            }`}
          >
            {s.step}
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 10 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 pt-1"
      >
        <h3
          className={`text-lg sm:text-xl font-semibold mb-2 transition-colors duration-500 [text-wrap:balance] ${
            isActive ? "text-white" : "text-white/60"
          }`}
        >
          {s.title}
        </h3>
        <p
          className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 [text-wrap:pretty] ${
            isActive ? "text-zinc-300" : "text-zinc-400"
          }`}
        >
          {s.description}
        </p>
      </motion.div>
    </div>
  );
}

function Method() {
  const t = useT();
  const sectionRef = useRef(null);

  const steps = t.method.steps;

  return (
    <section id="method" className="relative py-8 sm:py-12 px-4 sm:px-6">
      <div ref={sectionRef} className="relative max-w-7xl mx-auto rounded-[1.25rem] lg:rounded-[2rem] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 overflow-hidden">
        {/* Running-pic backdrop, visible but not distracting with green hue */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/coach-luki-conditioning-running-berlin.webp"
            alt=""
            aria-hidden="true"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Lighter black overlay so the image shows through */}
          <div className="absolute inset-0 bg-[#0C0C0C]/45" />
          {/* Subtle green tint for brand hue */}
          <div className="absolute inset-0 bg-gradient-to-b from-accent-dark/20 via-[#0C0C0C]/25 to-[#0C0C0C]/70" />
          {/* Gentle vignette toward edges so center content reads clean */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(12,12,12,0.5)_100%)]" />
        </div>

        <div className="relative z-10">
        <motion.div
          initial={{ y: 40, scale: 0.85 }}
          whileInView={{ y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="text-accent text-sm font-medium uppercase tracking-widest">
            {t.method.eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 text-white">
            {t.method.heading}
          </h2>
          <p className="text-zinc-300 mt-6 max-w-lg mx-auto text-lg">
            {t.method.intro}
          </p>
        </motion.div>

        {/* ── Desktop: nodes row with connectors, then text below ── */}
        <div className="hidden lg:block">
          <div className="relative flex items-center justify-between max-w-3xl mx-auto mb-12">
            <div className="absolute top-1/2 left-[10px] right-[10px] h-0.5 -translate-y-1/2 bg-white/15 rounded-full" />
            <div className="absolute top-1/2 left-[10px] right-[10px] h-0.5 -translate-y-1/2 bg-gradient-to-r from-accent via-accent-light to-accent rounded-full shadow-[0_0_8px_rgba(0,180,90,0.5)]" />
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-20 h-20 rounded-2xl bg-[#0C0C0C] flex items-center justify-center shadow-[0_0_25px_rgba(0,180,90,0.35)] border border-accent/40"
              >
                <span className="text-2xl font-bold text-accent">{s.step}</span>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <h3 className="text-xl font-semibold text-white mb-3 [text-wrap:balance]">{s.title}</h3>
                <p className="text-zinc-300 leading-relaxed [text-wrap:pretty]">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Mobile / Tablet: per-step connector lines so the timeline
            starts at the first dot and terminates at the last dot. No
            spanning absolute line / scroll tracker — activation colors
            each connector via its step's useInView. ── */}
        <div className="lg:hidden relative max-w-md mx-auto">
          {steps.map((s, i) => (
            <MethodStep key={s.step} s={s} isLast={i === steps.length - 1} />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── PHILOSOPHY (dark, layered) ─────────────────── */
function Philosophy() {
  const t = useT();
  const ref = useRef(null);

  const principles = t.philosophy.principles;

  return (
    <section className="py-24 sm:py-32 relative">
      {/* Layered bg */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 radial-glow-bottom" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ y: 40, scale: 0.85 }}

          whileInView={{ y: 0, scale: 1 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-medium uppercase tracking-widest">
            {t.philosophy.eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
            {t.philosophy.headingPrefix} <span className="gradient-text">{t.philosophy.headingAccent}</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {principles.map((p, i) => (
            <motion.div
              key={p.number}
              initial={{ y: 40, scale: 0.85 }}

              whileInView={{ y: 0, scale: 1 }}

              viewport={{ once: true }}

              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-8 sm:p-10 rounded-2xl border border-white/[0.04] bg-surface/80 hover:border-accent/20 transition-all duration-500"
            >
              <span className="text-6xl font-bold text-accent/[0.07] absolute top-6 right-8 group-hover:text-accent/15 transition-colors">
                {p.number}
              </span>
              <h3 className="text-xl font-semibold text-white mb-3">{p.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ y: 40, scale: 0.85 }}

          whileInView={{ y: 0, scale: 1 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 text-center"
        >
          <div className="inline-block px-10 py-8 rounded-2xl bg-surface border border-accent/10 glow">
            <p className="text-2xl sm:text-3xl font-medium text-white italic">
              &ldquo;{t.philosophy.quote}&rdquo;
            </p>
            <p className="text-accent text-sm mt-4">{t.philosophy.quoteAuthor}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


/* ─────────────────── EXPERIENCE TIMELINE (light) ─────────────────── */
/* Single timeline entry — activates when its dot enters the viewport */
function ExperienceItem({
  exp,
  index,
  isLast,
}: {
  exp: { company: string; period: string; role: string; description: string };
  index: number;
  isLast: boolean;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isActive = useInView(itemRef, { once: true, margin: "0px 0px -35% 0px" });

  return (
    <div ref={itemRef} className="relative">
      {/* ── Mobile layout ── */}
      <div className={`relative flex gap-5 sm:hidden ${isLast ? "" : "pb-12"}`}>
        {/* Connector — absolute so it bridges the padding down to the next
            item's dot. Dot column is w-4 centered → line at 7px. */}
        {!isLast && (
          <div
            aria-hidden
            className={`absolute left-[7px] top-7 bottom-0 w-0.5 transition-colors duration-700 ${
              isActive ? "bg-gradient-to-b from-accent to-accent-dark" : "bg-stone-200"
            }`}
          />
        )}
        <div className="shrink-0 w-4 flex justify-center z-10">
          <motion.div
            animate={
              isActive
                ? { scale: [1, 1.5, 0.8, 1.2, 1], rotate: [0, -8, 8, -4, 0] }
                : {}
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`w-4 h-4 rounded-full mt-1 transition-colors duration-500 ${
              isActive
                ? "bg-stone-900 border-[3px] border-accent shadow-[0_0_12px_rgba(0,102,51,0.4)]"
                : "bg-white border-[3px] border-stone-300"
            }`}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.25, y: 10 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1"
        >
          <span className="text-zinc-400 text-sm">{exp.period}</span>
          <h3 className={`text-xl font-bold mt-1 transition-colors duration-500 ${
            isActive ? "text-stone-900" : "text-stone-300"
          }`}>{exp.company}</h3>
          <p className={`font-medium text-sm mt-1 transition-colors duration-500 ${
            isActive ? "text-accent-dark" : "text-stone-300"
          }`}>{exp.role}</p>
          <p className={`mt-3 leading-relaxed transition-colors duration-500 ${
            isActive ? "text-zinc-500" : "text-zinc-300"
          }`}>{exp.description}</p>
        </motion.div>
      </div>

      {/* ── Desktop layout: alternating sides, dot absolutely centered on line ── */}
      <div className={`hidden sm:block relative min-h-[140px] ${isLast ? "" : "pb-16"}`}>
        <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 10 }}
          animate={isActive ? { opacity: 1, x: 0, y: 0 } : { opacity: 0.25 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`w-[calc(50%-28px)] ${
            index % 2 === 0 ? "pr-2 text-right" : "ml-auto pl-2 text-left"
          }`}
        >
          <span className="text-zinc-400 text-sm">{exp.period}</span>
          <h3 className={`text-xl font-bold mt-1 transition-colors duration-500 ${
            isActive ? "text-stone-900" : "text-stone-300"
          }`}>{exp.company}</h3>
          <p className={`font-medium text-sm mt-1 transition-colors duration-500 ${
            isActive ? "text-accent-dark" : "text-stone-300"
          }`}>{exp.role}</p>
          <p className={`mt-3 leading-relaxed transition-colors duration-500 ${
            isActive ? "text-zinc-500" : "text-zinc-300"
          }`}>{exp.description}</p>
        </motion.div>

        {/* Per-item connector line — sits below the dot and extends to the
            bottom of the item. Skipped on the last item so the timeline
            terminates at the final dot. */}
        {!isLast && (
          <div
            className={`absolute left-1/2 top-[28px] bottom-0 w-0.5 -translate-x-px transition-colors duration-700 ${
              isActive ? "bg-gradient-to-b from-accent to-accent-dark" : "bg-stone-200"
            }`}
          />
        )}

        {/* Dot — absolute, centered on the timeline */}
        <div className="absolute left-1/2 top-2 -translate-x-1/2 z-10">
          <motion.div
            animate={
              isActive
                ? { scale: [1, 1.5, 0.8, 1.2, 1], rotate: [0, -8, 8, -4, 0] }
                : {}
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`w-4 h-4 rounded-full transition-colors duration-500 ${
              isActive
                ? "bg-stone-900 border-[3px] border-accent shadow-[0_0_12px_rgba(0,102,51,0.4)]"
                : "bg-white border-[3px] border-stone-300"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

function Experience() {
  const t = useT();
  const ref = useRef(null);

  const experiences = t.experience.items;

  return (
    <section id="experience" className="py-8 sm:py-12 px-4 sm:px-6">
      <div ref={ref} className="max-w-7xl mx-auto light-container py-20 sm:py-28 px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ y: 40, scale: 0.85 }}
          whileInView={{ y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-accent-dark text-sm font-medium uppercase tracking-widest">
            {t.experience.eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 text-stone-900">
            {t.experience.heading}
          </h2>
        </motion.div>

        {/* Timeline — per-item connectors start at the first dot and
            terminate at the last dot (no leading/trailing stub line). */}
        <div className="relative max-w-3xl mx-auto">
          {experiences.map((exp, i) => (
            <ExperienceItem
              key={exp.company}
              exp={exp}
              index={i}
              isLast={i === experiences.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── TESTIMONIAL CARD ─────────────────── */
function TestimonialCard({ t, className = "" }: { t: { name: string; text: string }; className?: string }) {
  return (
    <div className={`flex-shrink-0 flex flex-col bg-surface border border-white/[0.06] rounded-2xl p-8 hover:border-accent/20 transition-all duration-500 ${className}`}>
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, j) => (
          <svg key={j} className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-zinc-300 leading-relaxed italic mb-6">
        &ldquo;{t.text}&rdquo;
      </p>
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
          <span className="text-accent font-semibold text-sm">{t.name[0]}</span>
        </div>
        <span className="font-semibold text-white">{t.name}</span>
      </div>
    </div>
  );
}

/* ─────────────────── TESTIMONIALS (dark, tilted cards) ─────────────────── */
function Testimonials() {
  const dict = useT();
  const ref = useRef(null);
  const nudgeRef = useRef<HTMLDivElement>(null);
  const desktopX = useMotionValue(0);
  const mobileX = useMotionValue(0);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const DESKTOP_CARD_STEP = 444; // card width 420 + gap 24
  const MOBILE_CARD_STEP = 296; // card width 280 + gap 16

  /* Animate desktop carousel to a given index */
  const goToDesktop = (idx: number, total: number) => {
    const bounded = Math.max(0, Math.min(idx, total - 1));
    setDesktopIndex(bounded);
    animate(desktopX, -bounded * DESKTOP_CARD_STEP, { type: "spring", stiffness: 220, damping: 30 });
  };

  /* Snap mobile carousel to the nearest card on drag end so it never rests
     mid-card (which reads as 'glitchy' swipe). */
  const snapMobile = (total: number) => {
    const x = mobileX.get();
    const idx = Math.max(0, Math.min(Math.round(-x / MOBILE_CARD_STEP), total - 1));
    animate(mobileX, -idx * MOBILE_CARD_STEP, { type: "spring", stiffness: 260, damping: 32 });
  };

  /* One-time "this is interactive" nudge when the section first enters view.
     Slides each carousel ~24px left, then back, so users see the row move
     and realize it's swipeable. Skipped under prefers-reduced-motion. */
  const inView = useInView(nudgeRef, { once: true, margin: "0px 0px -20% 0px" });
  useEffect(() => {
    if (!inView) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nudge = (mv: ReturnType<typeof useMotionValue<number>>) => {
      animate(mv, -24, { duration: 0.55, ease: [0.22, 1, 0.36, 1] }).then(() => {
        animate(mv, 0, { duration: 0.7, ease: [0.22, 1, 0.36, 1] });
      });
    };
    const t = setTimeout(() => {
      nudge(desktopX);
      nudge(mobileX);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const testimonials = dict.testimonials.items;

  return (
    <section id="testimonials" className="py-24 sm:py-32 relative scroll-mt-20">
      {/* Layered background */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div ref={ref} className="relative">
        <div ref={nudgeRef} className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ y: 40, scale: 0.85 }}

            whileInView={{ y: 0, scale: 1 }}

            viewport={{ once: true }}

            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20"
          >
            <span className="text-accent text-sm font-medium uppercase tracking-widest">
              {dict.testimonials.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
              {dict.testimonials.headingPrefix} <span className="gradient-text">{dict.testimonials.headingAccent}</span>
            </h2>
            <p className="text-zinc-400 mt-6 max-w-lg mx-auto text-lg">
              {dict.testimonials.intro}
            </p>
          </motion.div>
        </div>

        {/* Desktop: swipeable/draggable carousel with arrow controls */}
        <div className="hidden md:block relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 lg:w-40 bg-gradient-to-r from-[#0C0C0C] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 lg:w-40 bg-gradient-to-l from-[#0C0C0C] to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex items-stretch gap-6 px-6 cursor-grab active:cursor-grabbing"
            style={{ x: desktopX, touchAction: "pan-y" }}
            drag="x"
            dragDirectionLock
            dragConstraints={{
              left: -(testimonials.length - 1) * DESKTOP_CARD_STEP,
              right: 0,
            }}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
            onDragEnd={() => {
              const x = desktopX.get();
              const idx = Math.round(-x / DESKTOP_CARD_STEP);
              goToDesktop(idx, testimonials.length);
            }}
          >
            {testimonials.map((t) => (
              <TestimonialCard key={`desktop-${t.name}`} t={t} className="w-[380px] lg:w-[420px]" />
            ))}
          </motion.div>

          {/* Arrow controls + dot indicator */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              aria-label={dict.a11y.prevTestimonial}
              onClick={() => goToDesktop(desktopIndex - 1, testimonials.length)}
              disabled={desktopIndex === 0}
              className="w-11 h-11 rounded-full border border-white/15 bg-white/5 backdrop-blur hover:bg-accent hover:border-accent transition-colors duration-200 text-white flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span className="text-zinc-400 text-xs uppercase tracking-wider tabular-nums">
              {desktopIndex + 1} / {testimonials.length}
            </span>
            <button
              aria-label={dict.a11y.nextTestimonial}
              onClick={() => goToDesktop(desktopIndex + 1, testimonials.length)}
              disabled={desktopIndex >= testimonials.length - 1}
              className="w-11 h-11 rounded-full border border-white/15 bg-white/5 backdrop-blur hover:bg-accent hover:border-accent transition-colors duration-200 text-white flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile: swipeable carousel */}
        <div className="md:hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0C0C0C] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0C0C0C] to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex items-stretch gap-4 px-6 cursor-grab active:cursor-grabbing"
            style={{ x: mobileX, touchAction: "pan-y" }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: -(testimonials.length - 1) * MOBILE_CARD_STEP, right: 0 }}
            dragElastic={0.08}
            dragMomentum={false}
            onDragEnd={() => snapMobile(testimonials.length)}
          >
            {testimonials.map((t, i) => (
              <TestimonialCard key={`mobile-${t.name}-${i}`} t={t} className="w-[280px]" />
            ))}
          </motion.div>

          <p className="text-center text-zinc-600 text-xs mt-6 uppercase tracking-wider">
            {dict.testimonials.swipeHint}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── SOCIAL CTA ─────────────────── */
function SocialCTA() {
  const t = useT();
  const ref = useRef(null);

  const socials = [
    {
      platform: "Instagram",
      handle: "@coachluki",
      description: t.socialCta.instagramDescription,
      url: "https://www.instagram.com/coachluki/",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      platform: "Threads",
      handle: "@coachluki",
      description: t.socialCta.threadsDescription,
      url: "https://www.threads.com/@coachluki",
      icon: (
        <svg className="w-8 h-8 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
          <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div ref={ref} className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ y: 40, scale: 0.85 }}

          whileInView={{ y: 0, scale: 1 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-medium uppercase tracking-widest">
            {t.socialCta.eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
            {t.socialCta.headingPrefix} <span className="gradient-text">{t.socialCta.headingAccent}</span>
          </h2>
          <p className="text-zinc-400 mt-6 max-w-lg mx-auto text-lg">
            {t.socialCta.intro}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {socials.map((social, i) => (
            <motion.a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 40, scale: 0.85 }}

              whileInView={{ y: 0, scale: 1 }}

              viewport={{ once: true }}

              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-8 sm:p-10 rounded-2xl bg-surface border border-white/[0.04] hover:border-accent/20 transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,102,51,0.06)]"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                  {social.icon}
                </div>
                <svg className="w-5 h-5 text-zinc-600 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">{social.platform}</h3>
              <p className="text-accent text-sm mb-3">{social.handle}</p>
              <p className="text-zinc-400 leading-relaxed">{social.description}</p>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── FAQ ─────────────────── */
function FAQ() {
  const t = useT();
  const ref = useRef(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = t.faq.items;

  return (
    <section id="faq" className="py-8 sm:py-12 px-4 sm:px-6 scroll-mt-20">
      <div ref={ref} className="max-w-3xl mx-auto light-container py-20 sm:py-28 px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ y: 40, scale: 0.85 }}

          whileInView={{ y: 0, scale: 1 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-accent-dark text-sm font-medium uppercase tracking-widest">
            {t.faq.eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 text-stone-900">
            {t.faq.heading}
          </h2>
          <p className="text-zinc-500 mt-6 text-lg">
            {t.faq.intro}
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, scale: 0.85 }}

              whileInView={{ y: 0, scale: 1 }}

              viewport={{ once: true }}

              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors text-left group cursor-pointer"
              >
                <span className="text-base font-semibold text-stone-900 group-hover:text-stone-700 transition-colors">
                  {faq.question}
                </span>
                <motion.svg
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-5 h-5 text-zinc-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 text-zinc-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── WHATSAPP FLOATING BUTTON ─────────────────── */
function WhatsAppButton() {
  const t = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="https://wa.me/4915129633927"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_30px_rgba(37,211,102,0.6)] hover:scale-110 transition-all duration-300"
          aria-label={t.a11y.chatWhatsApp}
        >
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────── CONTACT CTA (dark container on dark bg) ─────────────────── */
function Contact() {
  const t = useT();
  const ref = useRef(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
    goal: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          goal: formState.goal || "General inquiry",
          message: formState.message || "",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t.contact.errorGeneric);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.contact.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-8 sm:py-12 px-4 sm:px-6 scroll-mt-20">
      <div ref={ref} className="max-w-5xl mx-auto dark-container py-20 sm:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden">
        {/* Background layers inside container */}
        <div className="absolute inset-0 bg-grid opacity-30 rounded-[2rem]" />
        <div className="absolute inset-0 radial-glow-green rounded-[2rem]" />

        <div className="relative">
          <motion.div
            initial={{ y: 40, scale: 0.85 }}

            whileInView={{ y: 0, scale: 1 }}

            viewport={{ once: true }}

            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <span className="text-accent text-sm font-medium uppercase tracking-widest">
              {t.contact.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
              {t.contact.headingPrefix} <span className="gradient-text">{t.contact.headingAccent}</span>{t.contact.headingSuffix}
            </h2>
            <p className="text-zinc-400 mt-6 max-w-lg mx-auto text-lg">
              {t.contact.intro}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 40, scale: 0.85 }}

            whileInView={{ y: 0, scale: 1 }}

            viewport={{ once: true }}

            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">{t.contact.successTitle}</h3>
                <p className="text-zinc-400 mt-2">{t.contact.successBody}</p>
                <button onClick={() => { setSubmitted(false); setFormState({ name: "", email: "", message: "", goal: "" }); }} className="mt-6 text-accent text-sm cursor-pointer hover:underline">
                  {t.contact.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">{t.contact.nameLabel}</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-accent/50 transition-colors"
                      placeholder={t.contact.namePlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">{t.contact.emailLabel}</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-accent/50 transition-colors"
                      placeholder={t.contact.emailPlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">{t.contact.goalLabel}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {t.contact.goals.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setFormState({ ...formState, goal })}
                        className={`px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
                          formState.goal === goal
                            ? "border-accent/50 bg-accent/10 text-accent"
                            : "border-white/[0.08] text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">{t.contact.messageLabel}</label>
                  <textarea
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                    placeholder={t.contact.messagePlaceholder}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400 text-center" role="alert">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-light hover:shadow-[0_0_40px_rgba(0,102,51,0.3)] transition-all duration-300 text-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? t.contact.submitting : t.contact.submit}
                </button>
              </form>
            )}
          </motion.div>

          {/* Social links */}
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500"
          >
            <a href="https://www.instagram.com/coachluki/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @coachluki
            </a>
            <span className="text-stone-700">|</span>
            <a href="https://www.threads.com/@coachluki" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161" />
              </svg>
              Threads
            </a>
            <span className="text-stone-700">|</span>
            <a href="https://linktr.ee/coachluki" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.511 5.853l4.005-4.117 2.325 2.381-4.201 4.005h5.909v3.305h-5.937l4.229 4.108-2.325 2.334-5.741-5.769-5.741 5.769-2.325-2.325 4.229-4.108H2V8.122h5.909L3.708 4.117l2.325-2.381 4.005 4.117V0h3.473v5.853zM10.038 16.16h3.473v7.84h-3.473v-7.84z" />
              </svg>
              Linktree
            </a>
            <span className="text-stone-700">|</span>
            <a href="https://www.linkedin.com/in/coachluki/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <span className="text-stone-700">|</span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {t.contact.location}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── FOOTER ─────────────────── */
function Footer() {
  const t = useT();
  return (
    <footer className="py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
        <p>&copy; {new Date().getFullYear()} Coach Luki. {t.footer.rights}</p>
        <div className="flex items-center gap-6">
          <a href="https://www.instagram.com/coachluki/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">
            Instagram
          </a>
          <a href="https://www.threads.com/@coachluki" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">
            Threads
          </a>
          <a href="https://linktr.ee/coachluki" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">
            Linktree
          </a>
          <a href="https://www.linkedin.com/in/coachluki/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────── LOCATIONS ─────────────────── */
function Locations() {
  const t = useT();
  const ref = useRef(null);

  const featured = [true, false];
  const gyms = t.locations.items.map((g, i) => ({ ...g, featured: featured[i] }));

  return (
    <section id="locations" className="py-24 sm:py-32 relative scroll-mt-20">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div ref={ref} className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ y: 40, scale: 0.85 }}

          whileInView={{ y: 0, scale: 1 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-medium uppercase tracking-widest">
            {t.locations.eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
            {t.locations.headingPrefix} <span className="gradient-text">{t.locations.headingAccent}</span>
          </h2>
          <p className="text-zinc-400 mt-6 max-w-lg mx-auto text-lg">
            {t.locations.intro}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {gyms.map((gym) => (
            <motion.div
              key={gym.name}
              initial={{ y: 40, scale: 0.85 }}

              whileInView={{ y: 0, scale: 1 }}

              viewport={{ once: true }}

              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`relative group p-8 sm:p-10 rounded-2xl bg-surface transition-all duration-500 ${
                gym.featured
                  ? "border-2 border-accent/60 shadow-[0_0_40px_rgba(0,102,51,0.15)]"
                  : "border border-white/[0.04] hover:border-accent/20"
              }`}
            >
              {gym.featured && (
                <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold uppercase tracking-wider">
                  {t.locations.homeBase}
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">{gym.name}</h3>
              <p className="text-accent text-sm font-medium mt-1">{gym.type}</p>
              <p className="text-zinc-500 text-sm mt-1">{gym.address}</p>
              <p className="text-zinc-400 mt-4 leading-relaxed">{gym.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── ACTION BANNER (conversion CTA) ─────────────────── */
function ActionBanner() {
  const t = useT();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden rounded-[1.25rem] lg:rounded-[2rem] max-w-7xl mx-auto">
      {/* Parallax background image */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
        <Image
          src="/coach-luki-running-berlin-streets-night.webp"
          alt="Coach Luki running through the streets of Berlin at night — outdoor conditioning with personal trainer"
          fill
          className="object-cover object-center blur-[5px]"
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.3)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ y: 40, scale: 0.85 }}

          whileInView={{ y: 0, scale: 1 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-accent text-sm font-medium uppercase tracking-widest mb-4"
        >
          {t.actionBanner.eyebrow}
        </motion.p>
        <motion.h2
          initial={{ y: 40, scale: 0.85 }}

          whileInView={{ y: 0, scale: 1 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white max-w-3xl leading-tight"
        >
          {t.actionBanner.heading}
        </motion.h2>
        <motion.div
          initial={{ y: 40, scale: 0.85 }}

          whileInView={{ y: 0, scale: 1 }}

          viewport={{ once: true }}

          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-8 px-10 py-4 bg-accent text-white font-semibold rounded-full hover:bg-accent-light hover:shadow-[0_0_40px_rgba(0,102,51,0.3)] transition-all duration-300 text-lg cursor-pointer"
          >
            {t.actionBanner.cta}
          </button>
        </motion.div>
      </div>
      </div>
    </section>
  );
}

/* ─────────────────── TRUST BANNER (final push before contact) ─────────────────── */
function TrustBanner() {
  const t = useT();
  const ref = useRef(null);

  return (
    <section ref={ref} className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto rounded-[1.25rem] lg:rounded-[2rem] overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[500px]">
          {/* Image side */}
          <div className="relative h-[400px] lg:h-auto">
            <Image
              src="/coach-luki-personal-trainer-prenzlauer-berg.webp"
              alt="Coach Luki in urban Berlin — book a personal training session in Prenzlauer Berg or Mitte"
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 lg:to-stone-900/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent lg:hidden" />
          </div>

          {/* Text side */}
          <div className="bg-stone-900 flex items-center px-8 sm:px-12 lg:px-16 py-16 lg:py-20">
            <div>
              <motion.p
                initial={{ y: 40, scale: 0.85 }}

                whileInView={{ y: 0, scale: 1 }}

                viewport={{ once: true }}

                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-accent text-sm font-medium uppercase tracking-widest mb-4"
              >
                {t.trustBanner.eyebrow}
              </motion.p>
              <motion.h2
                initial={{ y: 40, scale: 0.85 }}

                whileInView={{ y: 0, scale: 1 }}

                viewport={{ once: true }}

                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
              >
                {t.trustBanner.headingPre}{" "}
                <span className="gradient-text">{t.trustBanner.headingAccent}</span>
              </motion.h2>
              <motion.p
                initial={{ y: 40, scale: 0.85 }}

                whileInView={{ y: 0, scale: 1 }}

                viewport={{ once: true }}

                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-zinc-400 mt-6 text-lg leading-relaxed"
              >
                {t.trustBanner.intro}
              </motion.p>
              <motion.div
                initial={{ y: 40, scale: 0.85 }}

                whileInView={{ y: 0, scale: 1 }}

                viewport={{ once: true }}

                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-10 py-4 bg-accent text-white font-semibold rounded-full hover:bg-accent-light hover:shadow-[0_0_40px_rgba(0,102,51,0.3)] transition-all duration-300 text-lg cursor-pointer"
                >
                  {t.trustBanner.ctaPrimary}
                </button>
                <a
                  href="https://wa.me/4915129633927"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-4 border border-white/10 text-white rounded-full hover:bg-white/5 transition-all duration-300 text-lg cursor-pointer text-center"
                >
                  {t.trustBanner.ctaWhatsApp}
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── MAIN PAGE ─────────────────── */
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FadeInSection><About /></FadeInSection>
      <FadeInSection><Services /></FadeInSection>
      <FadeInSection><BeforeAfter /></FadeInSection>
      <ActionBanner />
      <FadeInSection><Pricing /></FadeInSection>
      <FadeInSection><Method /></FadeInSection>
      <FadeInSection><Philosophy /></FadeInSection>

      <FadeInSection><Experience /></FadeInSection>
      <FadeInSection><Locations /></FadeInSection>
      <FadeInSection><Testimonials /></FadeInSection>
      <TrustBanner />
      <FadeInSection><FAQ /></FadeInSection>
      <FadeInSection><SocialCTA /></FadeInSection>
      <FadeInSection><Contact /></FadeInSection>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
