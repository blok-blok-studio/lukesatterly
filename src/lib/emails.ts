/* ─────────────────── EMAIL TEMPLATES ─────────────────── */
/* 5-email drip sequence for Coach Luki funnel subscribers */

const BRAND_COLOR = "#5A8A1A";
const SITE_URL = "https://coachluki.com";

function layout(content: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #333;">
      ${content}
      <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
      <p style="color: #999; font-size: 12px; line-height: 1.6;">
        Coach Luki — Personal Training & Nutrition, Berlin<br />
        <a href="${SITE_URL}" style="color: #999;">coachluki.com</a> |
        <a href="https://instagram.com/coachluki" style="color: #999;">@coachluki</a>
      </p>
    </div>
  `;
}

function button(text: string, href: string) {
  return `
    <a href="${href}"
       style="display: inline-block; background: ${BRAND_COLOR}; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; margin: 20px 0;">
      ${text}
    </a>
  `;
}

/* ── Email 1: Welcome + PDF (sent immediately on signup) ── */
export function welcomeEmail(firstName: string, timeline?: string) {
  return layout(`
    <h1 style="font-size: 24px; color: #1a1a1a;">Hey ${firstName},</h1>
    <p style="line-height: 1.7;">
      Thanks for grabbing the free workout template. This is the same kind of
      programming I use with my 1-on-1 coaching clients — real structure, real
      progressive overload, no fluff.
    </p>
    ${button("Download Your Template", "https://linktr.ee/coachluki")}
    <p style="line-height: 1.7;">
      Inside you'll find a 4-week program, exercise cues, a nutrition framework,
      and a progress tracking sheet. Give it a real go for at least 2 weeks
      before judging it.
    </p>
    ${
      timeline === "Ready to start now"
        ? `<p style="line-height: 1.7;">
            You mentioned you're ready to start — if you want hands-on coaching
            where I build everything around you specifically,
            <a href="${SITE_URL}/start" style="color: ${BRAND_COLOR}; font-weight: 600;">let's talk</a>.
          </p>`
        : `<p style="line-height: 1.7;">
            I'll send you a few more tips over the next couple weeks. No spam — just
            things I wish someone had told me when I started training.
          </p>`
    }
    <p style="line-height: 1.7;">Enjoy the progress,<br /><strong>Coach Luki</strong></p>
  `);
}

/* ── Email 2: Training tip (Day 2) ── */
export function trainingTipEmail(firstName: string) {
  return layout(`
    <h1 style="font-size: 24px; color: #1a1a1a;">Quick tip, ${firstName}</h1>
    <p style="line-height: 1.7;">
      One of the biggest mistakes I see with new clients: they go too heavy too
      fast and their form falls apart. Here's my rule:
    </p>
    <div style="background: #f8f8f6; border-left: 4px solid ${BRAND_COLOR}; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; font-weight: 600; color: #1a1a1a;">
        If you can't control the weight on the way down, it's too heavy.
      </p>
    </div>
    <p style="line-height: 1.7;">
      The eccentric (lowering) phase is where most of your muscle growth happens.
      Slow it down to a 3-second count on every rep. You'll feel the difference
      immediately.
    </p>
    <p style="line-height: 1.7;">
      Try this with the exercises in your free template this week and see how
      much harder they get with proper tempo.
    </p>
    <p style="line-height: 1.7;">Keep at it,<br /><strong>Coach Luki</strong></p>
  `);
}

/* ── Email 3: Nutrition advice (Day 5) ── */
export function nutritionEmail(firstName: string) {
  return layout(`
    <h1 style="font-size: 24px; color: #1a1a1a;">${firstName}, let's talk food</h1>
    <p style="line-height: 1.7;">
      Training is half the equation. The other half is what you eat — and it
      doesn't have to be complicated.
    </p>
    <p style="line-height: 1.7;">
      Here's the simplest nutrition framework I give my clients:
    </p>
    <ul style="line-height: 2; padding-left: 20px;">
      <li><strong>Protein at every meal</strong> — aim for a palm-sized portion</li>
      <li><strong>Eat vegetables you actually like</strong> — don't force kale if you hate it</li>
      <li><strong>Don't drink your calories</strong> — this one change makes a huge difference</li>
      <li><strong>Eat enough</strong> — undereating kills your progress just as much as overeating</li>
    </ul>
    <p style="line-height: 1.7;">
      I'm a plant-based athlete myself, so if you're vegan or curious about
      plant-forward nutrition, that's something I specialize in.
    </p>
    <p style="line-height: 1.7;">
      The nutrition framework in your template goes deeper — make sure you've
      checked it out.
    </p>
    <p style="line-height: 1.7;">Fuel up,<br /><strong>Coach Luki</strong></p>
  `);
}

/* ── Email 4: Client testimonial / social proof (Day 7) ── */
export function testimonialEmail(firstName: string) {
  return layout(`
    <h1 style="font-size: 24px; color: #1a1a1a;">Real results, ${firstName}</h1>
    <p style="line-height: 1.7;">
      I wanted to share what some of my clients have experienced — not to brag,
      but because their starting point might look a lot like yours.
    </p>
    <div style="background: #f8f8f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
      <p style="font-style: italic; margin: 0 0 8px 0; line-height: 1.6;">
        "I used to dread going to the gym. Now I actually look forward to it.
        Luke makes every session feel different and always checks in on how
        I'm doing that day."
      </p>
      <p style="margin: 0; font-weight: 600; color: ${BRAND_COLOR};">— Sarah M.</p>
    </div>
    <div style="background: #f8f8f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
      <p style="font-style: italic; margin: 0 0 8px 0; line-height: 1.6;">
        "Six months of online coaching and I'm in the best shape of my life.
        The weekly check-ins keep me on track even when motivation dips."
      </p>
      <p style="margin: 0; font-weight: 600; color: ${BRAND_COLOR};">— Anna K.</p>
    </div>
    <p style="line-height: 1.7;">
      Whether it's in-person at my Berlin gyms or online from anywhere — the
      coaching is the same quality. It's just about having someone in your corner.
    </p>
    <p style="line-height: 1.7;">Stay consistent,<br /><strong>Coach Luki</strong></p>
  `);
}

/* ── Email 5: Coaching pitch with CTA (Day 14) ── */
export function coachingPitchEmail(firstName: string) {
  return layout(`
    <h1 style="font-size: 24px; color: #1a1a1a;">${firstName}, ready for the next level?</h1>
    <p style="line-height: 1.7;">
      You've had the free template for a couple weeks now. If you've been
      following it, you're probably starting to feel a difference — stronger,
      more energized, more confident in the gym.
    </p>
    <p style="line-height: 1.7;">
      But here's the thing: a template can only take you so far. It doesn't
      know your body, your schedule, your weak points, or what you had for
      breakfast. That's where coaching comes in.
    </p>
    <p style="line-height: 1.7; font-weight: 600; color: #1a1a1a;">
      Here's what 1-on-1 coaching with me looks like:
    </p>
    <ul style="line-height: 2; padding-left: 20px;">
      <li>A training program built specifically around your body and goals</li>
      <li>Nutrition coaching that fits your lifestyle (not a diet you'll quit)</li>
      <li>Weekly check-ins and progress tracking</li>
      <li>Direct WhatsApp support between sessions</li>
      <li>In-person at John Reed Bötzow or EVO Spittelmarkt, or online</li>
    </ul>
    ${button("Book Your Free Consultation", SITE_URL + "/start")}
    <p style="line-height: 1.7;">
      No pressure, no pitch. We just talk about your goals and I'll tell you
      honestly if I think I can help. If we're a good fit, we start. If not,
      you keep the template and my best advice.
    </p>
    <p style="line-height: 1.7;">Let's go,<br /><strong>Coach Luki</strong></p>
  `);
}

/* ── Sequence config ── */
export const SEQUENCE = [
  { step: 1, delayDays: 0, subject: "Your Free Workout Template", template: welcomeEmail },
  { step: 2, delayDays: 2, subject: "Quick training tip that changes everything", template: trainingTipEmail },
  { step: 3, delayDays: 5, subject: "The simplest nutrition framework that works", template: nutritionEmail },
  { step: 4, delayDays: 7, subject: "Real results from real people", template: testimonialEmail },
  { step: 5, delayDays: 14, subject: "Ready for the next level?", template: coachingPitchEmail },
] as const;
