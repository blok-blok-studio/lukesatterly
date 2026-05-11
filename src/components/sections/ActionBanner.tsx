"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export function ActionBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden rounded-[1.25rem] lg:rounded-[2rem] max-w-7xl mx-auto">
        <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
          <Image
            src="/luke-running-street.webp"
            alt="Coach Luki running through the streets of Berlin at night"
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
            Stop waiting. Start moving.
          </motion.p>
          <motion.h2
            initial={{ y: 40, scale: 0.85 }}
            whileInView={{ y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white max-w-3xl leading-tight"
          >
            Your body is capable of more than you think
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
              See Plans & Pricing
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
