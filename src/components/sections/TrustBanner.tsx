"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const WHATSAPP_NUMBER = "4915129633927";

export function TrustBanner() {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto rounded-[1.25rem] lg:rounded-[2rem] overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[500px]">
          <div className="relative h-[400px] lg:h-auto">
            <Image
              src="/luke-urban.webp"
              alt="Coach Luki in Berlin — Personal Trainer ready to help you reach your goals"
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 lg:to-stone-900/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent lg:hidden" />
          </div>

          <div className="bg-stone-900 flex items-center px-8 sm:px-12 lg:px-16 py-16 lg:py-20">
            <div>
              <motion.p
                initial={{ y: 40, scale: 0.85 }}
                whileInView={{ y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-accent text-sm font-medium uppercase tracking-widest mb-4"
              >
                Let&apos;s work together
              </motion.p>
              <motion.h2
                initial={{ y: 40, scale: 0.85 }}
                whileInView={{ y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
              >
                The best time to start was yesterday. The next best time is{" "}
                <span className="gradient-text">right now.</span>
              </motion.h2>
              <motion.p
                initial={{ y: 40, scale: 0.85 }}
                whileInView={{ y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-zinc-400 mt-6 text-lg leading-relaxed"
              >
                A free consultation is all it takes. No commitment, no pressure, just an honest conversation about your goals and how I can help.
              </motion.p>
              <motion.div
                initial={{ y: 40, scale: 0.85 }}
                whileInView={{ y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-10 py-4 bg-accent text-white font-semibold rounded-full hover:bg-accent-light hover:shadow-[0_0_40px_rgba(0,102,51,0.3)] transition-all duration-300 text-lg cursor-pointer"
                >
                  Book Free Consultation
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-4 border border-white/10 text-white rounded-full hover:bg-white/5 transition-all duration-300 text-lg cursor-pointer text-center"
                >
                  WhatsApp Me
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
