"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FAQ() {
  const ref = useRef(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is personal training right for me and my goals?",
      answer: "Personal training is right for you if you don't just want to \"work out\". You want a clear plan, structure, and measurable progress. Most people don't struggle because they're lazy, but because they're guessing. I remove that guesswork and give you a system tailored to your body, your schedule, and your goals. Whether you're just starting out, coming back from an injury, or looking to take your training to the next level, I meet you where you are and guide you forward.",
    },
    {
      question: "Is online coaching effective for achieving real results?",
      answer: "Yes, if it's done properly. Online coaching isn't just a PDF plan. It's ongoing guidance, structured programming, and regular adjustments based on your progress. You'll know exactly what to do, how to do it, and why you're doing it, with accountability and support along the way. For many clients, online coaching actually works better because it integrates into real life instead of depending on fixed appointments.",
    },
    {
      question: "Why should I work with a coach instead of training on my own?",
      answer: "Because results come from consistency and direction, not just effort. Most people train hard, but not effectively. They repeat the same workouts, lack progression, or don't adjust when something isn't working. A coach gives you structure, holds you accountable, and makes sure every session moves you closer to your goal. It's the difference between being busy and actually making progress.",
    },
    {
      question: "What makes you different from other personal trainers?",
      answer: "I don't just coach workouts. I build systems that fit into your life. My approach is focused on long-term results, not quick fixes. That means smart programming, honest feedback, and adapting everything to your reality, not forcing you into a one-size-fits-all plan. I also place a strong emphasis on technique, injury prevention, and sustainable habits, so you don't just see progress, you keep it. You're not just getting a trainer. You're getting a structured, thought-out process.",
    },
    {
      question: "How do you help me stay consistent and accountable?",
      answer: "Motivation comes and goes. Structure is what keeps you moving. I build your training in a way that fits your schedule and current lifestyle, so it's realistic to stick to. On top of that, you'll have regular check-ins, clear targets, and ongoing adjustments, so you always know where you stand and what's next. My role is to keep you on track, especially on the days you don't feel like it.",
    },
    {
      question: "I'm vegan. Can you work with that?",
      answer: "Absolutely. I'm vegan myself, so plant-based nutrition is kind of my thing. I'll help you hit your protein targets, optimize your meals, and make sure you're not just surviving on pasta and hummus.",
    },
    {
      question: "What gyms do you train at?",
      answer: "My home base is John Reed Bötzow in Prenzlauer Berg, where most of my in-person coaching happens. I can also train you at McFit locations across Berlin. Pick whichever is most convenient for your schedule.",
    },
  ];

  return (
    <section id="faq" className="py-8 sm:py-12 px-4 sm:px-6 scroll-mt-20">
      <div ref={ref} className="max-w-3xl mx-auto light-container py-20 sm:py-28 px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ y: 40, scale: 0.85 }}
          whileInView={{ y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-accent-dark text-sm font-medium uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 text-stone-900">
            Got questions?
          </h2>
          <p className="text-zinc-500 mt-6 text-lg">
            Here are the ones I get asked the most.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, scale: 0.85 }}
              whileInView={{ y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors text-left group cursor-pointer"
              >
                <span className="text-base font-semibold text-stone-900 group-hover:text-stone-700 transition-colors">
                  {faq.question}
                </span>
                <motion.svg
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-5 h-5 text-zinc-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 text-zinc-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
