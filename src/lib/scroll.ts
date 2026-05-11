export function smoothScrollTo(targetId: string) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const navHeight = 80;
  const targetY = el.getBoundingClientRect().top + window.scrollY - navHeight;
  const startY = window.scrollY;
  const distance = targetY - startY;
  const duration = Math.min(1400, Math.max(800, Math.abs(distance) * 0.5));
  let startTime: number | null = null;

  function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
