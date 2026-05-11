"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

export function Locations() {
  const ref = useRef(null);

  const gyms = [
    {
      name: "John Reed Bötzow",
      type: "Home Base · Boutique Fitness Club",
      address: "Prenzlauer Berg, Berlin",
      description: "Where fitness meets music, art, and design. Great atmosphere and equipment for strength work, functional training, mobility, and ring sessions. This is where most of my in-person coaching happens.",
      featured: true,
    },
    {
      name: "McFit",
      type: "Flexible Locations",
      address: "Multiple Berlin locations",
      description: "Convenient spots across the city with everything you need for strength and conditioning work. Pick whichever is easiest for your schedule.",
      featured: false,
    },
  ];

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
            Locations
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
            Where I <span className="gradient-text">train</span>
          </h2>
          <p className="text-zinc-400 mt-6 max-w-lg mx-auto text-lg">
            I coach out of John Reed Bötzow in Prenzlauer Berg, plus McFit locations across Berlin.
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
                  Home Base
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
