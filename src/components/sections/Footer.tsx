"use client";

export function Footer() {
  return (
    <footer className="py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
        <p>&copy; {new Date().getFullYear()} Coach Luki. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="https://www.instagram.com/coachluki/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">
            Instagram
          </a>
          <a href="https://www.threads.com/@coachluki" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">
            Threads
          </a>
          <a href="https://linktr.ee/coachluki" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">
            Linktree
          </a>
          <a href="https://www.linkedin.com/in/coachluki/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
