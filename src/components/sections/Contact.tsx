"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export function Contact() {
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
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-8 sm:py-12 px-4 sm:px-6 scroll-mt-20">
      <div ref={ref} className="max-w-5xl mx-auto dark-container py-20 sm:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden">
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
              Get Started
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
              Ready to <span className="gradient-text">transform</span>?
            </h2>
            <p className="text-zinc-400 mt-6 max-w-lg mx-auto text-lg">
              Whether you want to train in person here in Berlin or work with me online,
              just send me a message and we&apos;ll go from there.
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
                <h3 className="text-2xl font-bold text-white">Message sent!</h3>
                <p className="text-zinc-400 mt-2">Thanks for reaching out. I&apos;ll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setFormState({ name: "", email: "", message: "", goal: "" }); }}
                  className="mt-6 text-accent text-sm cursor-pointer hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-accent/50 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-accent/50 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">What&apos;s your goal?</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["Build Muscle", "Lose Weight", "Get Stronger", "Move Pain-Free"].map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setFormState({ ...formState, goal })}
                        className={`px-4 py-3 rounded-xl border text-sm transition-all duration-200 cursor-pointer ${
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
                  <label className="block text-sm text-zinc-400 mb-2">Message</label>
                  <textarea
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                    placeholder="Tell me about your fitness goals..."
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
                  {submitting ? "Sending..." : "Let's Work Together"}
                </button>
              </form>
            )}
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
            <a href="https://www.instagram.com/coachluki/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @coachluki
            </a>
            <span className="text-stone-700">|</span>
            <a href="https://linktr.ee/coachluki" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.511 5.853l4.005-4.117 2.325 2.381-4.201 4.005h5.909v3.305h-5.937l4.229 4.108-2.325 2.334-5.741-5.769-5.741 5.769-2.325-2.325 4.229-4.108H2V8.122h5.909L3.708 4.117l2.325-2.381 4.005 4.117V0h3.473v5.853zM10.038 16.16h3.473v7.84h-3.473v-7.84z" />
              </svg>
              Linktree
            </a>
            <span className="text-stone-700">|</span>
            <a href="https://www.linkedin.com/in/luke-satterly-9085011b5/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
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
              Berlin, Germany
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
