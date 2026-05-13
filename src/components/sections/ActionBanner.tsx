"use client";

import Image from "next/image";

export function ActionBanner() {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden rounded-[1.25rem] lg:rounded-[2rem] max-w-7xl mx-auto">
        <Image
          src="/luke-running-street.webp"
          alt="Coach Luki running through the streets of Berlin at night"
          fill
          unoptimized
          className="object-cover"
        />
      </div>
    </section>
  );
}
