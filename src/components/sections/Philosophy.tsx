"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

export function Philosophy() {
  const ref = useRef(null);

  const principles = [
    {
      number: "01",
      title: "Progressive Overload",
      description: "Every session builds on the last one. I track everything so your training keeps moving forward, not just spinning wheels.",
    },
    {
      number: "02",
      title: "Sustainable Nutrition",
      description: "I’m not going to put you on some crazy diet you’ll quit in two weeks. We build eating habits that work for your life and that you can keep up long term.",
    },
    {
      number: "03",
      title: "Pain-Free Movement",
      description: "The whole point of training is to make your life better, not to leave you broken. We focus on moving well so you feel good outside the gym too.",
    },
    {
      number: "04",
      title: "Enjoy the Progress",
      description: "Fitness isn’t a destination, it’s something you do every day. Celebrate the small wins, show up consistently, and trust the work you’re putting in.",
    },
  ];

  return (
    <section className="py-24 sm:py-32 relative">
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
            Philosophy
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
            How I <span className="gradient-text">train</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {principles.map((p) => (
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

        <motion.div
          initial={{ y: 40, scale: 0.85 }}
          whileInView={{ y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 text-center"
        >
          <div className="inline-block px-10 py-8 rounded-2xl bg-surface border border-accent/10 glow">
            <p className="text-2xl sm:text-3xl font-medium text-white italic">
              &ldquo;Enjoy the progress. Embrace the suck.&rdquo;
            </p>
            <p className="text-accent text-sm mt-4">Coach Luki</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
