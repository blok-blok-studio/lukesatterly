"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

type ExperienceEntry = {
  company: string;
  period: string;
  role: string;
  description: string;
};

function ExperienceItem({ exp, index }: { exp: ExperienceEntry; index: number }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isActive = useInView(itemRef, { once: true, margin: "0px 0px -35% 0px" });

  return (
    <div ref={itemRef} className="relative mb-16 last:mb-0">
      {/* Mobile layout */}
      <div className="flex gap-5 sm:hidden">
        <div className="shrink-0 w-4 flex justify-center z-10">
          <motion.div
            animate={isActive ? { scale: [1, 1.5, 0.8, 1.2, 1], rotate: [0, -8, 8, -4, 0] } : {}}
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
          <h3 className={`text-xl font-bold mt-1 transition-colors duration-500 ${isActive ? "text-stone-900" : "text-stone-300"}`}>{exp.company}</h3>
          <p className={`font-medium text-sm mt-1 transition-colors duration-500 ${isActive ? "text-accent-dark" : "text-stone-300"}`}>{exp.role}</p>
          <p className={`mt-3 leading-relaxed transition-colors duration-500 ${isActive ? "text-zinc-500" : "text-zinc-300"}`}>{exp.description}</p>
        </motion.div>
      </div>

      {/* Desktop layout: alternating sides */}
      <div className="hidden sm:block relative min-h-[140px]">
        <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 10 }}
          animate={isActive ? { opacity: 1, x: 0, y: 0 } : { opacity: 0.25 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`w-[calc(50%-28px)] ${index % 2 === 0 ? "pr-2 text-right" : "ml-auto pl-2 text-left"}`}
        >
          <span className="text-zinc-400 text-sm">{exp.period}</span>
          <h3 className={`text-xl font-bold mt-1 transition-colors duration-500 ${isActive ? "text-stone-900" : "text-stone-300"}`}>{exp.company}</h3>
          <p className={`font-medium text-sm mt-1 transition-colors duration-500 ${isActive ? "text-accent-dark" : "text-stone-300"}`}>{exp.role}</p>
          <p className={`mt-3 leading-relaxed transition-colors duration-500 ${isActive ? "text-zinc-500" : "text-zinc-300"}`}>{exp.description}</p>
        </motion.div>

        <div className="absolute left-1/2 top-2 -translate-x-1/2 z-10">
          <motion.div
            animate={isActive ? { scale: [1, 1.5, 0.8, 1.2, 1], rotate: [0, -8, 8, -4, 0] } : {}}
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

export function Experience() {
  const ref = useRef(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 60%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const experiences: ExperienceEntry[] = [
    {
      company: "John Reed Bötzow & McFit, Berlin",
      period: "2023 - Present",
      role: "Personal Trainer",
      description: "One-on-one coaching focused on strength, mobility, rehab, and helping clients truly understand how to move better. In-person and online.",
    },
    {
      company: "Surf & Strength, Sri Lanka",
      period: "2025",
      role: "Strength Coach",
      description: "Led strength classes with surfers, combining functional training with an active outdoor lifestyle.",
    },
    {
      company: "TUI Cruises",
      period: "2022",
      role: "Personal Trainer Abroad",
      description: "Supported guests in staying active and healthy while traveling, delivering personal training sessions aboard cruise ships.",
    },
    {
      company: "Rehabilitation Center",
      period: "2019 - 2021",
      role: "Back & Neck Pain Therapist",
      description: "Helped clients reduce discomfort, improve mobility, and restore functional movement through targeted rehabilitation programs.",
    },
    {
      company: "Duale Hochschule für Prävention und Gesundheit",
      period: "2019 - 2023",
      role: "Degree in Prevention & Health",
      description: "Earned my degree in prevention and health management, building the scientific foundation behind my coaching approach.",
    },
  ];

  return (
    <section id="experience" className="py-8 sm:py-12 px-4 sm:px-6">
      <div ref={ref} className="max-w-7xl mx-auto light-container py-20 sm:py-28 px-6 sm:px-10 lg:px-16 shadow-[inset_0_0_120px_rgba(0,0,0,0.12)] [background:radial-gradient(ellipse_at_top_left,rgba(0,80,40,0.08)_0%,transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(0,80,40,0.08)_0%,transparent_55%),radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.05)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.05)_0%,transparent_50%),white]">
        <motion.div
          initial={{ y: 40, scale: 0.85 }}
          whileInView={{ y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-accent-dark text-sm font-medium uppercase tracking-widest">
            Background
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 text-stone-900">
            My Experience
          </h2>
        </motion.div>

        <div ref={timelineRef} className="relative max-w-3xl mx-auto">
          <div className="sm:hidden absolute left-[7px] top-0 bottom-0 w-0.5 bg-stone-200" />
          <motion.div
            style={{ height: lineHeight }}
            className="sm:hidden absolute left-[7px] top-0 w-0.5 bg-gradient-to-b from-accent to-accent-dark origin-top"
          />
          <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-stone-200 -translate-x-px" />
          <motion.div
            style={{ height: lineHeight }}
            className="hidden sm:block absolute left-1/2 top-0 w-0.5 bg-gradient-to-b from-accent to-accent-dark origin-top -translate-x-px"
          />

          {experiences.map((exp, i) => (
            <ExperienceItem key={exp.company} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
