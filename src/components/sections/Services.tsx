"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

export function Services() {
  const ref = useRef(null);

  const services = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: "1-on-1 Personal Training",
      description: "We train together at John Reed Bötzow in Prenzlauer Berg or at McFit locations across Berlin. Every session is built around your goals, your body, and what actually fits your life.",
      features: ["Custom workout plans", "Form correction", "Progressive overload tracking", "Flexible scheduling"],
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      title: "Nutrition Coaching",
      description: "Real food, real results. I help you build eating habits that actually stick, with a focus on plant-forward nutrition. No crash diets, no nonsense.",
      features: ["Personalized meal plans", "Macro optimization", "Vegan guidance", "Habit building"],
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      ),
      title: "Online Coaching",
      description: "Can’t make it to Berlin? No problem. I’ll write your programs, dial in your nutrition, and check in with you every week, wherever you are.",
      features: ["Remote training programs", "Video form checks", "Weekly check-ins", "App-based tracking"],
    },
  ];

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
            Services
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
            How I can <span className="gradient-text">help you</span>
          </h2>
          <p className="text-zinc-400 mt-6 max-w-xl mx-auto text-lg">
            Train with me in person at one of my Berlin gyms or work with me
            online from anywhere. Either way, everything is tailored to you.
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
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
