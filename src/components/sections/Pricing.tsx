"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CheckIcon({ dark }: { dark: boolean }) {
  return (
    <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${dark ? "text-accent" : "text-accent-dark"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

export function Pricing() {
  const ref = useRef(null);
  const [tab, setTab] = useState<"online" | "personal" | "corporate">("personal");

  const onlinePlans = [
    {
      name: "Remote Program",
      price: "95",
      period: "/month",
      note: "Min. 6 months",
      description: "Structured online coaching with monthly guidance. Perfect if you want a solid plan and regular accountability.",
      features: ["Goal analysis", "Custom training plan", "Custom nutrition plan", "Monthly check-in & feedback", "Monthly workout updates & adjustments"],
      cta: "Get Started",
      href: "https://buy.stripe.com/test_28EfZi3lb8dZ6z62T94F205",
      popular: false,
      dark: false,
    },
    {
      name: "Advanced",
      price: "240",
      period: "/month",
      note: "Starter pack: €1,097 for 3 months (everything included)",
      description: "The full remote coaching experience. Weekly check-ins, WhatsApp access, and a video library to keep your form on point.",
      features: ["Goal analysis", "Custom training plan", "Custom nutrition plan", "Weekly check-in with technique feedback", "Ongoing WhatsApp support", "Access to exercise library"],
      cta: "Go Advanced",
      href: "https://buy.stripe.com/test_aFaeVe5tjcuf5v28dt4F204",
      popular: true,
      dark: true,
    },
    {
      name: "Elite",
      price: "480",
      period: "/month",
      note: null,
      description: "Everything from Advanced plus a weekly 1-on-1 coaching call. The closest thing to in-person training, from anywhere.",
      features: ["Everything from Advanced", "Weekly 60 min coaching call (consultation/training)"],
      cta: "Go Elite",
      href: "https://buy.stripe.com/test_4gM14odZP1PBf5CalB4F203",
      popular: false,
      dark: false,
    },
  ];

  const personalPlans = [
    {
      name: "Elevate",
      price: "390",
      period: "/month",
      note: "Min. 3 months",
      sessions: "4 sessions / month",
      description: "Once a week, in person. For people who want hands-on coaching with a plan built around them.",
      features: ["Goal analysis", "Custom training plan", "Custom nutrition plan", "Weekly check-in", "Ongoing WhatsApp support"],
      cta: "Get Started",
      href: "https://buy.stripe.com/test_4gM28s2h7am72iQalB4F207",
      popular: true,
      dark: true,
    },
    {
      name: "Intensive",
      price: "780",
      period: "/month",
      note: "Min. 3 months",
      sessions: "8 sessions / month",
      description: "Twice a week for serious results. The full coaching experience with maximum hands-on support.",
      features: ["Goal analysis", "Custom training plan", "Custom nutrition plan", "Weekly check-in", "Ongoing WhatsApp support"],
      cta: "Go Intensive",
      href: "https://buy.stripe.com/test_8x200kaND0Lx8HebpF4F206",
      popular: false,
      dark: false,
    },
  ];

  const packages = [
    { sessions: 6, price: "630", href: "https://buy.stripe.com/test_dRm6oIg7Xdyj9LictJ4F202" },
    { sessions: 12, price: "1,260", href: "https://buy.stripe.com/test_9B64gA6xn0Lx2iQ9hx4F201" },
    { sessions: 24, price: "2,260", href: "https://buy.stripe.com/test_8x25kEf3T1PBbTq9hx4F200" },
  ];

  return (
    <section id="pricing" className="py-8 sm:py-12 px-4 sm:px-6 scroll-mt-20">
      <div ref={ref} className="max-w-7xl mx-auto light-container py-20 sm:py-28 px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ y: 40, scale: 0.85 }}
          whileInView={{ y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-accent-dark text-sm font-medium uppercase tracking-widest">
            Services & Pricing
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold mt-4 text-stone-900">
            Find the right <span className="gradient-text">plan</span>
          </h2>
          <p className="text-zinc-500 mt-6 max-w-lg mx-auto text-lg">
            Whether we train in person or online, every plan is built around your goals.
          </p>
          <p className="text-zinc-500 mt-4 max-w-xl mx-auto text-sm">
            Every plan starts with a free consultation call.{" "}
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="text-accent-dark font-semibold underline underline-offset-2 hover:text-accent transition-colors cursor-pointer"
            >
              Book yours here
            </button>{" "}
            and we&apos;ll get you set up.
          </p>

          <div className="mt-10 inline-flex flex-wrap justify-center gap-2 rounded-full bg-stone-100 p-1.5 max-w-full">
            {(["personal", "online", "corporate"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer border ${
                  tab === t
                    ? "bg-accent text-white shadow-[0_4px_14px_rgba(0,102,51,0.25)] border-accent"
                    : "bg-white text-accent-dark border-accent/30 hover:bg-accent/5 hover:border-accent/60"
                }`}
              >
                {t === "personal" ? "Personal Training" : t === "online" ? "Online Coaching" : "Corporate Fitness"}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {tab === "corporate" ? (
            <motion.div key="corporate" initial={{ y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ y: 40, scale: 0.85 }}
                  whileInView={{ y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative rounded-2xl bg-stone-900 text-white p-8 sm:p-12"
                >
                  <div className="text-center">
                    <h3 className="text-2xl sm:text-3xl font-bold">Corporate Fitness Programs</h3>
                    <p className="mt-4 text-zinc-300 leading-relaxed max-w-xl mx-auto">
                      Invest in your team&apos;s health, performance, and morale. I design tailored fitness programs for companies of all sizes — from startups to established organizations.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-10">
                    {[
                      { title: "On-Site Group Training", desc: "Energizing team sessions at your office or a nearby gym, scheduled around your workday." },
                      { title: "Wellness Workshops", desc: "Interactive sessions on movement, nutrition, stress management, and recovery for your team." },
                      { title: "Ongoing Programs", desc: "Weekly or bi-weekly recurring sessions to build long-term health habits across your company." },
                      { title: "Team Challenges", desc: "Custom fitness challenges that bring your team together and boost engagement." },
                    ].map((item) => (
                      <div key={item.title} className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-5">
                        <h4 className="font-semibold text-white">{item.title}</h4>
                        <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 text-center">
                    <p className="text-sm text-zinc-400 mb-6">
                      Every program is customized to your team size, goals, and schedule. Get in touch and let&apos;s build something that works for your company.
                    </p>
                    <button
                      onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                      className="inline-block bg-accent text-white px-8 py-4 rounded-xl font-semibold hover:bg-accent-light hover:shadow-[0_0_30px_rgba(0,102,51,0.3)] transition-all duration-300 cursor-pointer"
                    >
                      Contact for More Info
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : tab === "online" ? (
            <motion.div key="online" initial={{ y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
                {onlinePlans.map((plan) => (
                  <motion.div
                    key={plan.name}
                    initial={{ y: 40, scale: 0.85 }}
                    whileInView={{ y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative rounded-2xl p-8 sm:p-10 transition-all duration-500 ${
                      plan.dark
                        ? "bg-stone-900 text-white ring-2 ring-accent/50 shadow-[0_0_60px_rgba(0,102,51,0.1)] lg:scale-[1.02]"
                        : "bg-[#F7F5F0] border border-stone-200 hover:border-stone-300 hover:shadow-lg"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-accent text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full whitespace-nowrap">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <h3 className={`text-xl font-bold ${plan.dark ? "text-white" : "text-stone-900"}`}>{plan.name}</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className={`text-5xl font-bold tracking-tight ${plan.dark ? "text-white" : "text-stone-900"}`}>&euro;{plan.price}</span>
                      <span className={`text-sm ${plan.dark ? "text-zinc-400" : "text-zinc-500"}`}>{plan.period}</span>
                    </div>
                    {plan.note && (
                      <p className={`mt-2 text-xs font-medium ${plan.dark ? "text-accent" : "text-accent-dark"}`}>{plan.note}</p>
                    )}
                    <p className={`mt-4 text-sm leading-relaxed ${plan.dark ? "text-zinc-300" : "text-zinc-500"}`}>{plan.description}</p>
                    <ul className="mt-8 space-y-3">
                      {plan.features.map((f) => (
                        <li key={f} className={`flex items-start gap-3 text-sm ${plan.dark ? "text-zinc-200" : "text-zinc-600"}`}>
                          <CheckIcon dark={plan.dark} />{f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={plan.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-8 block w-full py-4 rounded-xl text-center font-semibold transition-all duration-300 text-base cursor-pointer ${
                        plan.dark
                          ? "bg-accent text-white hover:bg-accent-light hover:shadow-[0_0_30px_rgba(0,102,51,0.3)]"
                          : "bg-stone-900 text-white hover:bg-stone-800"
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="personal" initial={{ y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">
                {personalPlans.map((plan) => (
                  <motion.div
                    key={plan.name}
                    initial={{ y: 40, scale: 0.85 }}
                    whileInView={{ y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative rounded-2xl p-8 sm:p-10 transition-all duration-500 ${
                      plan.dark
                        ? "bg-stone-900 text-white ring-2 ring-accent/50 shadow-[0_0_60px_rgba(0,102,51,0.1)] lg:scale-[1.02]"
                        : "bg-[#F7F5F0] border border-stone-200 hover:border-stone-300 hover:shadow-lg"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-accent text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full whitespace-nowrap">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <h3 className={`text-xl font-bold ${plan.dark ? "text-white" : "text-stone-900"}`}>{plan.name}</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className={`text-5xl font-bold tracking-tight ${plan.dark ? "text-white" : "text-stone-900"}`}>&euro;{plan.price}</span>
                      <span className={`text-sm ${plan.dark ? "text-zinc-400" : "text-zinc-500"}`}>{plan.period}</span>
                    </div>
                    <div className={`mt-2 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
                      plan.dark ? "bg-accent text-white" : "bg-accent-dark/10 text-accent-dark"
                    }`}>
                      {plan.sessions}
                    </div>
                    <p className={`mt-1 text-xs font-medium ${plan.dark ? "text-zinc-400" : "text-zinc-500"}`}>{plan.note}</p>
                    <p className={`mt-4 text-sm leading-relaxed ${plan.dark ? "text-zinc-300" : "text-zinc-500"}`}>{plan.description}</p>
                    <ul className="mt-8 space-y-3">
                      {plan.features.map((f) => (
                        <li key={f} className={`flex items-start gap-3 text-sm ${plan.dark ? "text-zinc-200" : "text-zinc-600"}`}>
                          <CheckIcon dark={plan.dark} />{f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={plan.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-8 block w-full py-4 rounded-xl text-center font-semibold transition-all duration-300 text-base cursor-pointer ${
                        plan.dark
                          ? "bg-accent text-white hover:bg-accent-light hover:shadow-[0_0_30px_rgba(0,102,51,0.3)]"
                          : "bg-stone-900 text-white hover:bg-stone-800"
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </motion.div>
                ))}
              </div>

              <div className="max-w-4xl mx-auto mt-8">
                <motion.div
                  initial={{ y: 40, scale: 0.85 }}
                  whileInView={{ y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl bg-[#F7F5F0] border border-stone-200 p-8 sm:p-10"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-stone-900">Flexible Packages</h3>
                      <p className="text-zinc-500 text-sm mt-1">No commitment. Buy sessions and use them at your own pace.</p>
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wider text-accent-dark bg-accent-dark/10 rounded-full px-4 py-1.5 self-start">
                      No minimum
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {packages.map((pkg) => (
                      <a
                        key={pkg.sessions}
                        href={pkg.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center rounded-xl border border-stone-200 bg-white p-6 hover:border-accent-dark/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      >
                        <span className="text-3xl font-bold text-stone-900 group-hover:text-accent-dark transition-colors">
                          &euro;{pkg.price}
                        </span>
                        <span className="mt-2 text-xs font-bold uppercase tracking-wider bg-stone-900 text-white rounded-full px-4 py-1.5">
                          {pkg.sessions} sessions
                        </span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-zinc-400 text-sm mt-10">
          Secure payments. All plans include a free initial consultation.
        </p>
      </div>
    </section>
  );
}
