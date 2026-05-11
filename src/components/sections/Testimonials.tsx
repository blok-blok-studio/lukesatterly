"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

function TestimonialCard({ t, className = "" }: { t: { name: string; text: string }; className?: string }) {
  return (
    <div className={`flex-shrink-0 flex flex-col h-full bg-surface border border-white/[0.06] rounded-2xl p-8 hover:border-accent/20 transition-all duration-500 ${className}`}>
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, j) => (
          <svg key={j} className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-zinc-300 leading-relaxed italic mb-6">
        &ldquo;{t.text}&rdquo;
      </p>
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
          <span className="text-accent font-semibold text-sm">{t.name[0]}</span>
        </div>
        <span className="font-semibold text-white">{t.name}</span>
      </div>
    </div>
  );
}

const testimonials = [
  { name: "Rasmus", text: "Luke is what a personal trainer should be. He encourages, motivates and pushes you. He pushes you when you need it, and pushes you more when you don't know you need it. He has extensive physiological knowledge and has not left a question unanswered. I can only recommend working with him!" },
  { name: "Ali", text: "I worked with Luke in private coaching sessions. He was very curious about my goals and tailored a great coaching program for me where I started seeing results quickly. He provided great advice and helped me commit to my program and motivated me to keep going." },
  { name: "Marion", text: "Luke hat mein Selbstvertrauen gestärkt, indem er mich herausfordert und mich bei meinem Wunsch, trotz Arthrose fit und beweglich zu bleiben, durch gezielte Übungen unterstützt. Er zeigt mir, dass ich Kraft habe und diese auch steigern kann. Deshalb fühle ich mich gut aufgehoben bei ihm." },
  { name: "Andreea", text: "Starting my training journey with Luke as my PT a year ago has been the best investment I ever made for my health and fitness. He knows just when to push me harder and when to take a step back. Our sessions are more than just workouts. They're a time where I can laugh, let out a bit of frustration, and achieve things I never thought I could." },
  { name: "Adriano", text: "Luke Satterly ist ein wahnsinnig netter, aufmerksamer und amüsanter Mensch und Trainer. Sein Repertoire und sein Fachwissen sind gewaltig. Vor allem aber kriegt Luke es hin, dass ich jedes Mal besser gelaunt vom Training komme als ich hingegangen bin. Das ist die ganz große Kunst." },
  { name: "Øystein", text: "I've worked with Luke periodically for over 8 months now, and it's been a great experience. He's very knowledgeable on both the practical and theoretical side of things, and always positive and friendly, while pushing me to do my best. The value of continuing working with Luke exceeded my expectations." },
  { name: "Jim", text: "Luke takes the time to tailor my workouts to my goals, and changes it up to keep me interested and motivated. I really appreciate how he pushes me beyond my limits, to get the best results. I always leave our sessions feeling better than when I walked into the gym. He's great!" },
  { name: "Andrius", text: "Working with Luke was a game-changer. His challenging workouts push you beyond what you thought you were capable of, all while being enjoyable and motivating. Highly recommended!" },
  { name: "Ellen", text: "Luke hebt sich als Trainer vor allem durch seine klare, präzise Art zu erklären hervor. Er schafft es, nicht nur Technik zu vermitteln, sondern auch das Verständnis dafür, warum etwas auf eine bestimmte Weise ausgeführt werden sollte. Das führt dazu, dass man bewusster trainiert und die Übungen deutlich besser umsetzt. Darüber hinaus ist Luke auch menschlich eine echte Bereicherung: aufmerksam, angenehm im Umgang und sehr motivierend." },
  { name: "Lena", text: "Im Training mit Luke geht es nicht nur um meine körperliche Fitness, sondern vielmehr um ein ganzheitliches Verständnis über den eigenen Körper und die richtigen Bewegungsabläufe. Seit wir mein Training umgestellt haben, habe ich im Alltag keine Rückenschmerzen und fühle mich insgesamt fitter und gesünder! Luke schafft es auch, mich für eine Session morgens um 7 zu motivieren und so das Training in meine volle Arbeitswoche einzubauen. Das einzige Manko: Der heftige Muskelkater am Tag danach…" },
  { name: "Emil", text: "Was mir an Luki am meisten gefällt: Er hört richtig zu und passt alles 100 % auf mich an. Dank ihm bin ich jetzt stärker, fitter und selbstbewusster, und das ganz ohne Verletzungen oder Burnout. Der beste Coach, den ich in Berlin finden konnte." },
  { name: "Johanna", text: "Ich war anfangs skeptisch gegenüber Personal Training, weil ich dachte, es geht vor allem um Motivation, doch bei Luki habe ich gelernt, wie man Übungen wirklich versteht und effektiv ausführt. Sein präzises Verständnis und seine Fähigkeit, dieses Wissen zu vermitteln, machen Training zu einer Kombination aus Körper und Kopf. Dank ihm trainiere ich nicht nur effektiver, sondern auch mit deutlich mehr Selbstvertrauen und Freude." },
];

const DESKTOP_CARD_STEP = 444;

export function Testimonials() {
  const ref = useRef(null);
  const desktopX = useMotionValue(0);
  const [desktopIndex, setDesktopIndex] = useState(0);

  const goToDesktop = (idx: number) => {
    const bounded = Math.max(0, Math.min(idx, testimonials.length - 1));
    setDesktopIndex(bounded);
    animate(desktopX, -bounded * DESKTOP_CARD_STEP, { type: "spring", stiffness: 220, damping: 30 });
  };

  return (
    <section id="testimonials" className="py-24 sm:py-32 relative scroll-mt-20">
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div ref={ref} className="relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ y: 40, scale: 0.85 }}
            whileInView={{ y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20"
          >
            <span className="text-accent text-sm font-medium uppercase tracking-widest">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
              What clients <span className="gradient-text">say</span>
            </h2>
            <p className="text-zinc-400 mt-6 max-w-lg mx-auto text-lg">
              Real people, real results. Here&apos;s what they have to say.
            </p>
          </motion.div>
        </div>

        {/* Desktop: draggable carousel with arrow controls */}
        <div className="hidden md:block relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 lg:w-40 bg-gradient-to-r from-[#0C0C0C] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 lg:w-40 bg-gradient-to-l from-[#0C0C0C] to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex items-stretch gap-6 px-6 cursor-grab active:cursor-grabbing"
            style={{ x: desktopX, touchAction: "pan-y" }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: -(testimonials.length - 1) * DESKTOP_CARD_STEP, right: 0 }}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
            onDragEnd={() => {
              const x = desktopX.get();
              const idx = Math.round(-x / DESKTOP_CARD_STEP);
              goToDesktop(idx);
            }}
          >
            {testimonials.map((t) => (
              <TestimonialCard key={`desktop-${t.name}`} t={t} className="w-[380px] lg:w-[420px]" />
            ))}
          </motion.div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              aria-label="Previous testimonial"
              onClick={() => goToDesktop(desktopIndex - 1)}
              disabled={desktopIndex === 0}
              className="w-11 h-11 rounded-full border border-white/15 bg-white/5 backdrop-blur hover:bg-accent hover:border-accent transition-colors duration-200 text-white flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span className="text-zinc-400 text-xs uppercase tracking-wider tabular-nums">
              {desktopIndex + 1} / {testimonials.length}
            </span>
            <button
              aria-label="Next testimonial"
              onClick={() => goToDesktop(desktopIndex + 1)}
              disabled={desktopIndex >= testimonials.length - 1}
              className="w-11 h-11 rounded-full border border-white/15 bg-white/5 backdrop-blur hover:bg-accent hover:border-accent transition-colors duration-200 text-white flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile: swipeable carousel */}
        <div className="md:hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0C0C0C] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0C0C0C] to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex items-stretch gap-4 px-6 cursor-grab active:cursor-grabbing"
            style={{ touchAction: "pan-y" }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: -(testimonials.length - 1) * 290, right: 0 }}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
          >
            {testimonials.map((t, i) => (
              <TestimonialCard key={`mobile-${t.name}-${i}`} t={t} className="w-[280px]" />
            ))}
          </motion.div>

          <p className="text-center text-zinc-600 text-xs mt-6 uppercase tracking-wider">
            Swipe to see more
          </p>
        </div>
      </div>
    </section>
  );
}
