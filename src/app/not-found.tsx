import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden radial-glow-green">
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
      <div className="relative text-center max-w-lg">
        <p className="text-accent text-sm font-medium uppercase tracking-widest mb-4">
          404
        </p>
        <h1 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-display)] leading-[1.1]">
          Page not <span className="gradient-text">found</span>
        </h1>
        <p className="text-zinc-400 mt-6 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get
          you back on track.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-accent text-white font-semibold rounded-full hover:bg-accent-light hover:shadow-[0_0_30px_rgba(0,102,51,0.3)] transition-all duration-300 text-base cursor-pointer"
          >
            Back to homepage
          </Link>
          <Link
            href="/start"
            className="px-8 py-4 border border-white/10 text-white rounded-full hover:bg-white/5 transition-all duration-300 text-base cursor-pointer"
          >
            Get free workout template
          </Link>
        </div>
      </div>
    </div>
  );
}
