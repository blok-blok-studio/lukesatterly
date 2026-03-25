"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────── TYPES ─────────────────── */
type FormData = {
  name: string;
  email: string;
  goal: string;
  preference: string;
  timeline: string;
};

/* ─────────────────── NAVBAR ─────────────────── */
function FunnelNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0C0C0C]/80 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight font-[family-name:var(--font-display)] cursor-pointer"
        >
          <span className="gradient-text">COACH</span>{" "}
          <span className="text-white">LUKI</span>
        </Link>
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to site
        </Link>
      </div>
    </nav>
  );
}

/* ─────────────────── PROGRESS INDICATOR ─────────────────── */
function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3 justify-center mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <motion.div
            animate={{
              backgroundColor: i <= current ? "var(--accent)" : "rgba(255,255,255,0.1)",
              scale: i === current ? 1.2 : 1,
            }}
            className="w-3 h-3 rounded-full"
          />
          {i < total - 1 && (
            <div
              className={`w-8 h-px transition-colors duration-300 ${
                i < current ? "bg-accent" : "bg-white/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────── STEP ANIMATIONS ─────────────────── */
const stepVariants = {
  enter: { x: 60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
};

/* ─────────────────── MULTI-STEP FORM ─────────────────── */
function FunnelForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    goal: "",
    preference: "",
    timeline: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateStep = () => {
    const newErrors: Partial<FormData> = {};
    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = "Required";
      if (!formData.email.trim()) newErrors.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Invalid email";
    }
    if (step === 1) {
      if (!formData.goal) newErrors.goal = "Pick a goal";
      if (!formData.preference) newErrors.preference = "Pick one";
    }
    if (step === 2) {
      if (!formData.timeline) newErrors.timeline = "Pick one";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 3));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const goals = ["Build Muscle", "Lose Weight", "Get Stronger", "Move Pain-Free", "General Fitness"];
  const preferences = ["In-Person in Berlin", "Online", "Both"];
  const timelines = ["Ready to start now", "In the next month", "Just exploring"];

  /* ── Conditional CTA logic ── */
  const isHighIntent =
    formData.timeline === "Ready to start now" &&
    (formData.preference === "In-Person in Berlin" || formData.preference === "Both");
  const isOnlineReady =
    formData.timeline === "Ready to start now" && formData.preference === "Online";
  const isExploring = formData.timeline === "Just exploring";
  const isMidIntent = formData.timeline === "In the next month";

  return (
    <div className="max-w-xl mx-auto">
      {step < 3 && <ProgressDots current={step} total={3} />}

      <div className="relative overflow-hidden rounded-2xl bg-surface border border-white/[0.06] p-8 sm:p-10">
        <AnimatePresence mode="wait">
          {/* ── STEP 1: Name + Email ── */}
          {step === 0 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">
                Let&apos;s get started
              </h3>
              <p className="text-zinc-400 text-sm mb-8">
                Enter your details to grab the free template.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className={`w-full px-4 py-3.5 bg-white/[0.04] border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-accent/50 transition-colors ${
                      errors.name ? "border-red-500/50" : "border-white/[0.08]"
                    }`}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3.5 bg-white/[0.04] border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-accent/50 transition-colors ${
                      errors.email ? "border-red-500/50" : "border-white/[0.08]"
                    }`}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <button
                onClick={next}
                className="w-full mt-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-light hover:shadow-[0_0_30px_rgba(90,138,26,0.3)] transition-all duration-300 text-lg cursor-pointer"
              >
                Next &rarr;
              </button>

              <p className="text-zinc-600 text-xs text-center mt-4">
                Your data is protected. No spam, ever.
              </p>
            </motion.div>
          )}

          {/* ── STEP 2: Goal + Preference ── */}
          {step === 1 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">
                What are you working toward?
              </h3>
              <p className="text-zinc-400 text-sm mb-8">
                This helps me tailor recommendations for you.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-3">Fitness Goal</label>
                  <div className="grid grid-cols-2 gap-3">
                    {goals.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, goal });
                          setErrors({ ...errors, goal: undefined });
                        }}
                        className={`px-4 py-3 rounded-xl border text-sm transition-all duration-200 cursor-pointer text-left ${
                          formData.goal === goal
                            ? "border-accent/50 bg-accent/10 text-accent"
                            : "border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-zinc-300"
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                  {errors.goal && <p className="text-red-400 text-xs mt-2">{errors.goal}</p>}
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-3">How do you want to train?</label>
                  <div className="space-y-2">
                    {preferences.map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, preference: pref });
                          setErrors({ ...errors, preference: undefined });
                        }}
                        className={`w-full px-4 py-3.5 rounded-xl border text-sm transition-all duration-200 cursor-pointer text-left flex items-center gap-3 ${
                          formData.preference === pref
                            ? "border-accent/50 bg-accent/10 text-accent"
                            : "border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-zinc-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            formData.preference === pref ? "border-accent" : "border-zinc-600"
                          }`}
                        >
                          {formData.preference === pref && (
                            <div className="w-2 h-2 rounded-full bg-accent" />
                          )}
                        </div>
                        {pref}
                      </button>
                    ))}
                  </div>
                  {errors.preference && <p className="text-red-400 text-xs mt-2">{errors.preference}</p>}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={back}
                  className="px-6 py-4 border border-white/10 text-zinc-400 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
                >
                  &larr;
                </button>
                <button
                  onClick={next}
                  className="flex-1 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-light hover:shadow-[0_0_30px_rgba(90,138,26,0.3)] transition-all duration-300 text-lg cursor-pointer"
                >
                  Almost there &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Timeline ── */}
          {step === 2 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">
                How soon are you looking to start?
              </h3>
              <p className="text-zinc-400 text-sm mb-8">
                No pressure — just helps me know how to follow up.
              </p>

              <div className="space-y-3">
                {timelines.map((tl) => (
                  <button
                    key={tl}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, timeline: tl });
                      setErrors({ ...errors, timeline: undefined });
                    }}
                    className={`w-full px-5 py-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      formData.timeline === tl
                        ? "border-accent/50 bg-accent/10 text-accent"
                        : "border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-zinc-300"
                    }`}
                  >
                    <span className="font-medium">{tl}</span>
                  </button>
                ))}
              </div>
              {errors.timeline && <p className="text-red-400 text-xs mt-2">{errors.timeline}</p>}

              <div className="flex gap-3 mt-8">
                <button
                  onClick={back}
                  className="px-6 py-4 border border-white/10 text-zinc-400 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
                >
                  &larr;
                </button>
                <button
                  onClick={next}
                  className="flex-1 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-light hover:shadow-[0_0_30px_rgba(90,138,26,0.3)] transition-all duration-300 text-lg cursor-pointer"
                >
                  Get My Free Template
                </button>
              </div>
            </motion.div>
          )}

          {/* ── RESULTS SCREEN ── */}
          {step === 3 && (
            <motion.div
              key="results"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              {/* Success icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">
                You&apos;re in, {formData.name.split(" ")[0]}!
              </h3>
              <p className="text-zinc-400 mb-8">
                Your free workout template is ready to download.
              </p>

              {/* PDF Download — always shown */}
              <a
                href="https://linktr.ee/coachluki"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-light hover:shadow-[0_0_30px_rgba(90,138,26,0.3)] transition-all duration-300 text-lg cursor-pointer mb-6"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Free Template
              </a>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-surface px-4 text-zinc-500 text-sm">Want more?</span>
                </div>
              </div>

              {/* Conditional CTA based on qualification */}
              {isHighIntent && (
                <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 text-left">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">You&apos;re a great fit for 1-on-1 coaching</h4>
                      <p className="text-zinc-400 text-sm mt-1 mb-4">
                        You&apos;re ready to start, and I train clients just like you in Berlin every week. Let&apos;s talk about your goals.
                      </p>
                      <a
                        href="#"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 font-semibold rounded-xl hover:bg-zinc-100 transition-all duration-300 cursor-pointer"
                      >
                        Book Your Free Consultation
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {isOnlineReady && (
                <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 text-left">
                  <h4 className="font-bold text-white text-lg">Want personalized coaching online?</h4>
                  <p className="text-zinc-400 text-sm mt-1 mb-4">
                    I work with clients across Europe remotely. Same quality coaching, same results. Let&apos;s chat about your goals.
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 font-semibold rounded-xl hover:bg-zinc-100 transition-all duration-300 cursor-pointer"
                  >
                    Book a Quick Call
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              )}

              {isMidIntent && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-left">
                  <h4 className="font-bold text-white text-lg">When you&apos;re ready, I&apos;m here</h4>
                  <p className="text-zinc-400 text-sm mt-1 mb-4">
                    Start with the template and see how you feel. When you want hands-on coaching, book a free consultation.
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 text-white rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
                  >
                    Book a Call When Ready
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              )}

              {isExploring && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-left">
                  <h4 className="font-bold text-white">No rush at all</h4>
                  <p className="text-zinc-400 text-sm mt-1 mb-4">
                    Follow me for daily training tips and nutrition advice. When you&apos;re ready to level up, I&apos;m one message away.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://www.instagram.com/coachluki/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 text-zinc-300 rounded-xl hover:bg-white/5 transition-all text-sm cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      Follow on Instagram
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 text-zinc-300 rounded-xl hover:bg-white/5 transition-all text-sm cursor-pointer"
                    >
                      Book a Call Later
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────── MAIN PAGE ─────────────────── */
export default function StartPage() {
  return (
    <>
      <FunnelNav />
      <div className="noise-overlay" />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/[0.05] rounded-full blur-[150px]"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
              Free Download
            </span>
            <h1 className="text-[clamp(2rem,5vw,4rem)] font-black tracking-[-0.03em] leading-[1.1] font-[family-name:var(--font-display)]">
              Get Your Free<br />
              <span className="gradient-text">Workout Template</span>
            </h1>
            <p className="text-zinc-400 mt-6 text-lg max-w-lg mx-auto leading-relaxed">
              The same programming I use with my 1-on-1 coaching clients. Grab it free — no strings attached.
            </p>

            {/* Trust stats */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 mt-8 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
                100+ clients
              </div>
              <div className="w-px h-4 bg-zinc-700" />
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                5,000+ hours coached
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-center mb-12 font-[family-name:var(--font-display)]"
          >
            What&apos;s inside the template
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5", title: "4-Week Progressive Program" },
              { icon: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12", title: "Exercise Demos & Form Cues" },
              { icon: "M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12", title: "Nutrition Framework" },
              { icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z", title: "Progress Tracking Sheet" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-surface border border-white/[0.04] text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-white text-sm">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: "Sarah M.", text: "I used to dread going to the gym. Now I actually look forward to it." },
              { name: "Marco T.", text: "The nutrition tips alone changed how I feel day to day." },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-surface border border-white/[0.04]"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-zinc-300 text-sm italic mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-accent font-semibold text-xs">{t.name[0]}</span>
                  </div>
                  <span className="font-medium text-white text-sm">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="form" className="py-16 sm:py-24 radial-glow-green">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)]">
              Grab your <span className="gradient-text">free template</span>
            </h2>
            <p className="text-zinc-400 mt-4 max-w-md mx-auto">
              Answer a few quick questions and download instantly.
            </p>
          </motion.div>

          <FunnelForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
          <p>&copy; {new Date().getFullYear()} Coach Luki. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition-colors cursor-pointer">Home</Link>
            <a href="https://www.instagram.com/coachluki/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href="https://www.threads.com/@coachluki" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Threads</a>
          </div>
        </div>
      </footer>
    </>
  );
}
