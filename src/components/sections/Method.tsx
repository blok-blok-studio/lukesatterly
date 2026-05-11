"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

type MethodStepData = {
  step: string;
  title: string;
  description: string;
};

function MethodStep({ s }: { s: MethodStepData }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isActive = useInView(itemRef, { once: true, margin: "0px 0px -35% 0px" });

  return (
    <div ref={itemRef} className="relative flex gap-5 sm:gap-6 pb-8 sm:pb-10">
      <div className="shrink-0 z-10">
        <motion.div
          animate={isActive ? { scale: [1, 1.3, 0.9, 1.1, 1], rotate: [0, -5, 5, -3, 0] } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors duration-500 border ${
            isActive
              ? "bg-[#0C0C0C] border-accent/60 shadow-[0_0_20px_rgba(0,180,90,0.45)]"
              : "bg-white/10 border-white/20"
          }`}
        >
          <span className={`text-base sm:text-lg font-bold transition-colors duration-500 ${isActive ? "text-accent" : "text-white/50"}`}>
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
        <h3 className={`text-lg sm:text-xl font-semibold mb-2 transition-colors duration-500 [text-wrap:balance] ${isActive ? "text-white" : "text-white/60"}`}>
          {s.title}
        </h3>
        <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 [text-wrap:pretty] ${isActive ? "text-zinc-300" : "text-zinc-400"}`}>
          {s.description}
        </p>
      </motion.div>
    </div>
  );
}

export function Method() {
  const sectionRef = useRef(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 70%", "end 60%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const steps: MethodStepData[] = [
    {
      step: "01",
      title: "Assessment",
      description: "First, we sit down and talk. I want to know your goals, how you move, what your day looks like, and what you eat. This is where everything starts.",
    },
    {
      step: "02",
      title: "Custom Programming",
      description: "Based on what I learn about you, I put together a training and nutrition plan that makes sense for your body, your schedule, and where you want to go.",
    },
    {
      step: "03",
      title: "Train Together",
      description: "Whether we're in the gym together or working remotely, I'm coaching you through every rep. I'll fix your form, push you when you need it, and keep things fun.",
    },
    {
      step: "04",
      title: "Track & Adapt",
      description: "We check in every week, track your progress, and adjust the plan as you grow. Your body changes, so your program should too.",
    },
  ];

  return (
    <section id="method" className="relative py-8 sm:py-12 px-4 sm:px-6">
      <div ref={sectionRef} className="relative max-w-7xl mx-auto rounded-[1.25rem] lg:rounded-[2rem] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/luke-running.webp"
            alt=""
            fill
            aria-hidden
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#0C0C0C]/45" />
          <div className="absolute inset-0 bg-gradient-to-b from-accent-dark/20 via-[#0C0C0C]/25 to-[#0C0C0C]/70" />
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
              The Process
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 text-white">
              The Luki Method
            </h2>
            <p className="text-zinc-300 mt-6 max-w-lg mx-auto text-lg">
              Here&apos;s how we work together, step by step.
            </p>
          </motion.div>

          {/* Desktop: nodes row with connectors */}
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

          {/* Mobile / Tablet: single continuous timeline */}
          <div ref={timelineRef} className="lg:hidden relative max-w-md mx-auto">
            <div className="absolute left-[23px] sm:left-[27px] top-0 bottom-0 w-0.5 bg-white/15" />
            <motion.div
              style={{ height: lineHeight }}
              className="absolute left-[23px] sm:left-[27px] top-0 w-0.5 bg-gradient-to-b from-accent to-accent-light origin-top"
            />
            {steps.map((s) => (
              <MethodStep key={s.step} s={s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
