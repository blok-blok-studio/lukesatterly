"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ─────────────────── TYPES ─────────────────── */
type FormData = {
  name: string;
  email: string;
  goals: string[];
  preference: string;
  timeline: string;
};

/* ─────────────────── NAVBAR ─────────────────── */
function FunnelNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0C0C0C]/80 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <Image src="/logo-icon-green.png" alt="Coach Luki logo" width={32} height={32} className="w-8 h-8" priority />
          <span className="text-xl font-bold tracking-tight font-[family-name:var(--font-display)]">
            <span className="gradient-text">COACH</span>{" "}
            <span className="text-white">LUKI</span>
          </span>
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
    goals: [],
    preference: "",
    timeline: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateStep = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = "Required";
      if (!formData.email.trim()) newErrors.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Invalid email";
    }
    if (step === 1) {
      if (formData.goals.length === 0) newErrors.goals = "Pick at least one goal";
      if (!formData.preference) newErrors.preference = "Pick one";
    }
    if (step === 2) {
      if (!formData.timeline) newErrors.timeline = "Pick one";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitToApi = async () => {
    try {
      setSubmitting(true);
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          goal: formData.goals.join(", "),
        }),
      });
    } catch {
      // Fail silently — don't block the user from getting the PDF
    } finally {
      setSubmitting(false);
    }
  };

  const advance = () => {
    if (!validateStep()) return;
    if (step === 2) {
      submitToApi();
      setStep(3);
    } else {
      setStep((s) => Math.min(s + 1, 3));
    }
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    advance();
  };

  const goals = ["Build Muscle", "Lose Weight", "Get Stronger", "Move Pain-Free", "General Fitness", "Better Nutrition", "Injury Recovery", "Flexibility", "Mental Health"];
  const preferences = ["In-Person in Berlin", "Online", "Both"];
  const timelines = ["Ready to start now", "In the next month", "Just exploring"];

  return (
    <div id="template-form" className="max-w-xl mx-auto scroll-mt-24">
      {step < 3 && <ProgressDots current={step} total={3} />}

      <div className="relative overflow-hidden rounded-2xl bg-surface border border-white/[0.06] p-5 sm:p-8 lg:p-10">
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
              <form onSubmit={handleFormSubmit}>
                <h3 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">
                  Let&apos;s get started
                </h3>
                <p className="text-zinc-400 text-sm mb-8">
                  Enter your details to grab your template.
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
                  type="submit"
                  className="w-full mt-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-light hover:shadow-[0_0_30px_rgba(0,102,51,0.3)] transition-all duration-300 text-lg cursor-pointer"
                >
                  Next &rarr;
                </button>

                <p className="text-zinc-600 text-xs text-center mt-4">
                  Your data is protected. No spam, ever.
                </p>
              </form>
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
                  <label className="block text-sm text-zinc-400 mb-3">Fitness Goals <span className="text-zinc-600">(select all that apply)</span></label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {goals.map((goal) => {
                      const isSelected = formData.goals.includes(goal);
                      return (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => {
                            const updated = isSelected
                              ? formData.goals.filter((g) => g !== goal)
                              : [...formData.goals, goal];
                            setFormData({ ...formData, goals: updated });
                            setErrors({ ...errors, goals: undefined });
                          }}
                          className={`px-3 py-3 rounded-xl border text-sm transition-colors duration-150 cursor-pointer text-center ${
                            isSelected
                              ? "border-accent/50 bg-accent/10 text-accent"
                              : "border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-zinc-300"
                          }`}
                        >
                          {goal}
                        </button>
                      );
                    })}
                  </div>
                  {errors.goals && <p className="text-red-400 text-xs mt-2">{errors.goals}</p>}
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
                        className={`w-full px-4 py-3.5 rounded-xl border text-sm transition-colors duration-150 cursor-pointer text-left flex items-center gap-3 ${
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
                  aria-label="Go back"
                  className="px-6 py-4 border border-white/10 text-zinc-400 rounded-xl hover:bg-white/5 transition-colors duration-150 cursor-pointer"
                >
                  &larr;
                </button>
                <button
                  onClick={advance}
                  className="flex-1 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-light hover:shadow-[0_0_30px_rgba(0,102,51,0.3)] transition-all duration-300 text-lg cursor-pointer"
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
                No pressure, just helps me know how to follow up.
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
                    className={`w-full px-5 py-4 rounded-xl border text-left transition-colors duration-150 cursor-pointer ${
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
                  aria-label="Go back"
                  className="px-6 py-4 border border-white/10 text-zinc-400 rounded-xl hover:bg-white/5 transition-colors duration-150 cursor-pointer"
                >
                  &larr;
                </button>
                <button
                  onClick={advance}
                  disabled={submitting}
                  className="flex-1 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-light hover:shadow-[0_0_30px_rgba(0,102,51,0.3)] transition-all duration-300 text-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting\u2026" : "Get My Template"}
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
            >
              {/* Small template download */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-6">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">Your template is ready</p>
                    <p className="text-zinc-500 text-xs">4-week workout program. Also sent to your email.</p>
                  </div>
                </div>
                <a
                  href="/coach-luki-training-guide.pdf"
                  download="Coach-Luki-Training-Guide.pdf"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-accent border border-accent/30 rounded-lg hover:bg-accent/10 transition-colors duration-150 cursor-pointer flex-shrink-0 w-full sm:w-auto"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download
                </a>
              </div>

              {/* Push to book a call */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">
                  Now let&apos;s talk about <span className="gradient-text">your goals</span>
                </h3>
                <p className="text-zinc-400 text-sm">
                  {formData.name.split(" ")[0]}, a template is a great start &mdash; but real results come from coaching tailored to you. Book a 15-min call and let&apos;s build your plan together.
                </p>
              </div>

              {/* Google Calendar Scheduler embed */}
              <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-white">
                <iframe
                  src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2v3xRsZStR2Wtk8dr_F8kwEq4WGWu0FM548fk45LXMHonM5FwIUFHmuTTp0Ph6eVpcM1ZeM2PC?gv=true"
                  style={{ border: 0 }}
                  width="100%"
                  height="600"
                  className="min-h-[500px] sm:min-h-[600px]"
                  title="Book a free consultation with Coach Luki"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────── BEFORE & AFTER ─────────────────── */
function BeforeAfter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-12 sm:py-20">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-accent text-sm font-medium uppercase tracking-widest">
            Real Results
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 font-[family-name:var(--font-display)]">
            The <span className="gradient-text">transformation</span> speaks for itself
          </h2>
          <p className="text-zinc-400 mt-4 max-w-lg mx-auto">
            Consistent training. Proper nutrition. Real coaching.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={isInView ? { y: 0, opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg mx-auto"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.08]">
              <Image
                src="/transformation-before.jpg"
                alt="Coach Luki client before training — starting point"
                fill
                sizes="(max-width: 768px) 50vw, 300px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-xs font-semibold text-white">
                Before
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-accent/20">
              <Image
                src="/transformation-after.jpg"
                alt="Coach Luki client after training — transformation results"
                fill
                sizes="(max-width: 768px) 50vw, 300px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-accent/80 backdrop-blur-sm text-xs font-semibold text-white">
                After
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: "Body Fat Lost", value: "12%" },
              { label: "Muscle Gained", value: "8kg" },
              { label: "Duration", value: "6 mo" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-xl bg-surface border border-white/[0.04]">
                <div className="text-lg font-bold text-accent">{stat.value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────── VIDEO SECTION ─────────────────── */
function VideoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-12 sm:py-20 radial-glow-green">
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-accent text-sm font-medium uppercase tracking-widest">
            Watch This First
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 font-[family-name:var(--font-display)]">
            60 seconds that could <span className="gradient-text">change everything</span>
          </h2>
          <p className="text-zinc-400 mt-4 max-w-lg mx-auto">
            Hear directly from me about what makes this program different and how I can help you reach your goals.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {/* Video embed placeholder — replace src with actual video URL */}
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/[0.08] bg-surface">
            {/* Placeholder — swap this div for an iframe or video element when ready */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent/40">
                <svg className="w-8 h-8 text-accent ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-zinc-500 text-sm">Video coming soon</p>
            </div>
            {/* When you have the video URL, uncomment and replace: */}
            {/* <iframe
              src="YOUR_VIDEO_EMBED_URL"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Coach Luki, 1 Minute Introduction"
            /> */}
          </div>

          {/* Quick CTA below video — scrolls DOWN to the form */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                const el = document.getElementById("template-form");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-light hover:shadow-[0_0_30px_rgba(0,102,51,0.3)] transition-all duration-300 cursor-pointer text-sm sm:text-base"
            >
              Get Your Template
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────── MAIN PAGE ─────────────────── */
export default function StartPage() {
  return (
    <>
      <FunnelNav />
      <div className="noise-overlay" />

      {/* Hero + Form */}
      <section className="relative overflow-hidden radial-glow-green">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/[0.05] rounded-full blur-[150px]"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Personal Training & Nutrition Coaching
            </span>
            <h1 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-black tracking-[-0.03em] leading-[1.1] font-[family-name:var(--font-display)]">
              Build the body you&apos;ve been<br />
              <span className="gradient-text">putting off for years</span>
            </h1>
            <p className="text-zinc-400 mt-4 sm:mt-6 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              I&apos;m Coach Luki. I help people in Berlin and online get stronger, leaner, and actually enjoy training again, with a plan built for your body and your life.
            </p>

            {/* Trust stats */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 mt-8 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
                100+ clients
              </div>
              <div className="w-px h-3 bg-white/10" />
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

      {/* 1-Minute Video */}
      <VideoSection />

      {/* Before & After Transformation */}
      <BeforeAfter />

      {/* Form */}
      <section className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)]">
              Ready? Grab your <span className="gradient-text">workout template</span>
            </h2>
            <p className="text-zinc-400 mt-4">
              Answer a few quick questions and download instantly.
            </p>
          </motion.div>
          <FunnelForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
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
