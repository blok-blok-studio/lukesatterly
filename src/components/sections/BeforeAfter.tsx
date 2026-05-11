"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function BeforeAfter() {
  const ref = useRef(null);

  const transformations = [
    {
      before: "/transformation-before.webp",
      after: "/transformation-after.webp",
      name: "Luki",
      duration: "6 months",
      result: "Complete body recomposition",
    },
  ];

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
            Real Results
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 text-stone-900">
            The proof is in the <span className="gradient-text">progress</span>
          </h2>
          <p className="text-zinc-500 mt-6 max-w-xl mx-auto text-lg">
            Real clients, real transformations. No filters, no shortcuts, just consistent work and proper coaching.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {transformations.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ y: 50, scale: 0.8 }}
              whileInView={{ y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-200">
                  <Image
                    src={t.before}
                    alt={`${t.name} before training`}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[11px] font-medium text-white">
                    Before
                  </div>
                </div>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-200">
                  <Image
                    src={t.after}
                    alt={`${t.name} after training`}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-accent/80 backdrop-blur-sm text-[11px] font-medium text-white">
                    After
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-stone-800">{t.name}</p>
                <p className="text-sm text-zinc-500">{t.duration} &mdash; {t.result}</p>
              </div>
            </motion.div>
          ))}
        </div>

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
            Start Your Transformation
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
