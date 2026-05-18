"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden radial-glow-green">
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
      <div className="relative text-center max-w-lg">
        <p className="text-accent text-sm font-medium uppercase tracking-widest mb-4">
          Something went wrong
        </p>
        <h1 className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-display)] leading-[1.1]">
          We hit a <span className="gradient-text">snag</span>
        </h1>
        <p className="text-zinc-400 mt-6 leading-relaxed">
          An unexpected error came up loading this page. Try again, or head
          back to the homepage and pick up where you left off.
        </p>
        {error.digest && (
          <p className="text-zinc-600 text-xs mt-4 font-mono">
            ref: {error.digest}
          </p>
        )}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-4 bg-accent text-white font-semibold rounded-full hover:bg-accent-light hover:shadow-[0_0_30px_rgba(0,102,51,0.3)] transition-all duration-300 text-base cursor-pointer"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-8 py-4 border border-white/10 text-white rounded-full hover:bg-white/5 transition-all duration-300 text-base cursor-pointer"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
