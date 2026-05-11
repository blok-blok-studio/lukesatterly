"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-8 sm:py-12 px-4 sm:px-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto light-container py-20 sm:py-28 px-6 sm:px-10 lg:px-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ x: -15 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100">
              <Image
                src="/luke-profile.webp"
                alt="Luke Satterly - Coach Luki, Personal Trainer in Berlin"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-4 -right-4 sm:right-4 bg-white rounded-xl px-5 py-4 shadow-xl border border-zinc-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="44" stroke="var(--accent)" strokeWidth="6" />
                    <path d="M30 30 Q32 55 50 78 Q68 55 70 30" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <path d="M58 38 C62 30 68 24 78 20 C74 30 68 36 62 42 Z" fill="var(--accent)" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-800">Vegan Athlete</div>
                  <div className="text-xs text-zinc-500">Plant-powered coaching</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ x: 15 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-stone-900">
              Hi, I&apos;m <span className="gradient-text">Luki</span>
            </h2>
            <div className="mt-8 space-y-5 text-zinc-600 leading-relaxed text-lg">
              <p>
                I&apos;m Luke Satterly, but most people call me Coach Luki. I coach in person at{" "}
                <strong className="text-stone-900">John Reed Bötzow</strong> in Prenzlauer Berg
                and at <strong className="text-stone-900">McFit</strong> locations across Berlin,
                plus online from anywhere.
              </p>
              <p>
                My focus is on helping people <strong className="text-stone-900">understand how
                to move better</strong>. That means teaching you <em>why</em> an exercise works,
                not just how to do it, so you train smarter, rebuild after pain or injury, and
                actually enjoy the process.
              </p>
              <p>
                With a background in <strong className="text-stone-900">rehabilitation</strong>{" "}
                and a degree in Prevention &amp; Health Management, I work with clients recovering
                from back and neck pain, returning from injury, or simply wanting to move without
                limits. Happiness is derived through progress. Enjoy the progress.
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {[
                "Certified Personal Trainer & Nutritionist",
                "Fluent in German and English",
                "Plant-based / vegan fitness specialist",
                "In-person & online coaching available",
                "Ring training & calisthenics focus",
              ].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ x: 10 }}
                  whileInView={{ x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease: "easeOut" }}
                  className="flex items-start gap-3 text-stone-700"
                >
                  <svg className="w-5 h-5 text-accent-dark mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
