/* ─────────────────── EMAIL TEMPLATES ─────────────────── */
/* 5-email drip sequence for Coach Luki funnel subscribers.
 *
 * Each template returns { html, text } so Resend sends a multipart message.
 * Multipart (HTML + text) significantly improves deliverability.
 *
 * Every email includes:
 *  - Visible unsubscribe link in the footer (CAN-SPAM / GDPR)
 *  - Physical location (required for bulk senders)
 *  - "You're receiving this because..." reminder
 *
 * The API handler also sets List-Unsubscribe and List-Unsubscribe-Post
 * headers for RFC 8058 one-click unsubscribe (Gmail / Apple Mail).
 */

const BRAND_COLOR = "#006633";
const SITE_URL = "https://coachluki.com";
const CALENDAR_URL = "https://calendar.app.google/pascCaTPLUFBJspR6";
const BUSINESS_NAME = "Coach Luki, Personal Training & Nutrition";
const BUSINESS_LOCATION = "Berlin, Germany";

export type EmailContent = { html: string; text: string };

function layoutHtml(content: string, unsubscribeUrl: string) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0; padding:0; background:#f6f6f4;">
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #333; background:#ffffff;">
      ${content}
      <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
      <p style="color: #999; font-size: 12px; line-height: 1.6;">
        You signed up for Coach Luki's workout template at
        <a href="${SITE_URL}" style="color: #999;">coachluki.com</a>.
      </p>
      <p style="color: #999; font-size: 12px; line-height: 1.6;">
        <strong>${BUSINESS_NAME}</strong><br />
        ${BUSINESS_LOCATION}<br />
        <a href="${SITE_URL}" style="color: #999;">coachluki.com</a> ·
        <a href="https://instagram.com/coachluki" style="color: #999;">@coachluki</a>
      </p>
      <p style="color: #999; font-size: 12px; line-height: 1.6;">
        Don't want these emails?
        <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">Unsubscribe here</a>.
      </p>
    </div>
  </body>
</html>`;
}

function layoutText(content: string, unsubscribeUrl: string) {
  return `${content}

---
You signed up for Coach Luki's workout template at ${SITE_URL}.

${BUSINESS_NAME}
${BUSINESS_LOCATION}
${SITE_URL}

Don't want these emails? Unsubscribe here: ${unsubscribeUrl}
`;
}

function buttonHtml(text: string, href: string) {
  // Table-based button for reliable rendering across email clients.
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
      <tr>
        <td align="center" bgcolor="${BRAND_COLOR}" style="background:${BRAND_COLOR};border-radius:10px;">
          <a href="${href}"
             style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:16px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>`;
}

/* ── Email 1: Welcome + Template (sent immediately on signup) ── */
export function welcomeEmail(
  firstName: string,
  unsubscribeUrl: string,
  timeline?: string
): EmailContent {
  const extraHtml =
    timeline === "Ready to start now"
      ? `<p style="line-height: 1.7;">
          You mentioned you're ready to go. If you want hands-on coaching
          where I build everything around you specifically,
          <a href="${CALENDAR_URL}" style="color: ${BRAND_COLOR}; font-weight: 600;">let's talk</a>.
        </p>`
      : `<p style="line-height: 1.7;">
          I'll send you a few more tips over the next couple weeks. Just
          things I wish someone had told me when I started training.
        </p>`;

  const extraText =
    timeline === "Ready to start now"
      ? `You mentioned you're ready to go. If you want hands-on coaching where I build everything around you specifically, let's talk: ${CALENDAR_URL}`
      : `I'll send you a few more tips over the next couple weeks. Just things I wish someone had told me when I started training.`;

  const html = layoutHtml(
    `
    <h1 style="font-size: 24px; color: #1a1a1a;">Hey ${firstName},</h1>
    <p style="line-height: 1.7;">
      Thanks for grabbing the workout template. This is the same kind of
      programming I use with my 1-on-1 coaching clients. Real structure, real
      progressive overload, no fluff.
    </p>
    ${buttonHtml("Download your template", CALENDAR_URL)}
    <p style="line-height: 1.7;">
      Inside you'll find a 4-week program, exercise cues, a nutrition framework,
      and a progress tracking sheet. Give it a real go for at least 2 weeks
      before judging it.
    </p>
    ${extraHtml}
    <p style="line-height: 1.7;">Enjoy the progress,<br /><strong>Coach Luki</strong></p>
  `,
    unsubscribeUrl
  );

  const text = layoutText(
    `Hey ${firstName},

Thanks for grabbing the workout template. This is the same kind of programming I use with my 1-on-1 coaching clients. Real structure, real progressive overload, no fluff.

Download your template: ${CALENDAR_URL}

Inside you'll find a 4-week program, exercise cues, a nutrition framework, and a progress tracking sheet. Give it a real go for at least 2 weeks before judging it.

${extraText}

Enjoy the progress,
Coach Luki`,
    unsubscribeUrl
  );

  return { html, text };
}

/* ── Email 2: Training tip (Day 2) ── */
export function trainingTipEmail(firstName: string, unsubscribeUrl: string): EmailContent {
  const html = layoutHtml(
    `
    <h1 style="font-size: 24px; color: #1a1a1a;">Quick tip, ${firstName}</h1>
    <p style="line-height: 1.7;">
      One of the biggest mistakes I see with new clients is going too heavy too
      fast. Form falls apart and you stop making progress. Here's my rule:
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
      Try this with the exercises in your template this week and see how
      much harder they get with proper tempo.
    </p>
    <p style="line-height: 1.7;">Keep at it,<br /><strong>Coach Luki</strong></p>
  `,
    unsubscribeUrl
  );

  const text = layoutText(
    `Quick tip, ${firstName}

One of the biggest mistakes I see with new clients is going too heavy too fast. Form falls apart and you stop making progress. Here's my rule:

"If you can't control the weight on the way down, it's too heavy."

The eccentric (lowering) phase is where most of your muscle growth happens. Slow it down to a 3-second count on every rep. You'll feel the difference immediately.

Try this with the exercises in your template this week and see how much harder they get with proper tempo.

Keep at it,
Coach Luki`,
    unsubscribeUrl
  );

  return { html, text };
}

/* ── Email 3: Nutrition advice (Day 5) ── */
export function nutritionEmail(firstName: string, unsubscribeUrl: string): EmailContent {
  const html = layoutHtml(
    `
    <h1 style="font-size: 24px; color: #1a1a1a;">${firstName}, let's talk food</h1>
    <p style="line-height: 1.7;">
      Training is half the equation. The other half is what you eat. And it
      doesn't have to be complicated.
    </p>
    <p style="line-height: 1.7;">
      Here's the simplest nutrition framework I give my clients:
    </p>
    <ul style="line-height: 2; padding-left: 20px;">
      <li><strong>Protein at every meal.</strong> Aim for a palm-sized portion.</li>
      <li><strong>Eat vegetables you actually like.</strong> Don't force kale if you hate it.</li>
      <li><strong>Don't drink your calories.</strong> This one change makes a huge difference.</li>
      <li><strong>Eat enough.</strong> Undereating kills your progress just as much as overeating.</li>
    </ul>
    <p style="line-height: 1.7;">
      I'm a plant-based athlete myself, so if you're vegan or curious about
      plant-forward nutrition, that's something I specialize in.
    </p>
    <p style="line-height: 1.7;">
      The nutrition framework in your template goes deeper. Make sure you've
      checked it out.
    </p>
    <p style="line-height: 1.7;">Fuel up,<br /><strong>Coach Luki</strong></p>
  `,
    unsubscribeUrl
  );

  const text = layoutText(
    `${firstName}, let's talk food

Training is half the equation. The other half is what you eat. And it doesn't have to be complicated.

Here's the simplest nutrition framework I give my clients:

- Protein at every meal. Aim for a palm-sized portion.
- Eat vegetables you actually like. Don't force kale if you hate it.
- Don't drink your calories. This one change makes a huge difference.
- Eat enough. Undereating kills your progress just as much as overeating.

I'm a plant-based athlete myself, so if you're vegan or curious about plant-forward nutrition, that's something I specialize in.

The nutrition framework in your template goes deeper. Make sure you've checked it out.

Fuel up,
Coach Luki`,
    unsubscribeUrl
  );

  return { html, text };
}

/* ── Email 4: Client testimonial / social proof (Day 7) ── */
export function testimonialEmail(firstName: string, unsubscribeUrl: string): EmailContent {
  const html = layoutHtml(
    `
    <h1 style="font-size: 24px; color: #1a1a1a;">Real results, ${firstName}</h1>
    <p style="line-height: 1.7;">
      I wanted to share what some of my clients have experienced. Not to brag,
      but because their starting point might look a lot like yours.
    </p>
    <div style="background: #f8f8f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
      <p style="font-style: italic; margin: 0 0 8px 0; line-height: 1.6;">
        "Luke is what a personal trainer should be. He encourages, motivates
        and pushes you. He has extensive physiological knowledge and has not
        left a question unanswered. I can only recommend working with him!"
      </p>
      <p style="margin: 0; font-weight: 600; color: ${BRAND_COLOR};">Rasmus</p>
    </div>
    <div style="background: #f8f8f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
      <p style="font-style: italic; margin: 0 0 8px 0; line-height: 1.6;">
        "Starting my training journey with Luke as my PT a year ago has been
        the best investment I ever made for my health and fitness. He knows
        just when to push me harder and when to take a step back."
      </p>
      <p style="margin: 0; font-weight: 600; color: ${BRAND_COLOR};">Andreea</p>
    </div>
    <p style="line-height: 1.7;">
      Whether it's in-person at my Berlin gyms or online from anywhere, the
      coaching is the same quality. It's just about having someone in your corner.
    </p>
    <p style="line-height: 1.7;">Stay consistent,<br /><strong>Coach Luki</strong></p>
  `,
    unsubscribeUrl
  );

  const text = layoutText(
    `Real results, ${firstName}

I wanted to share what some of my clients have experienced. Not to brag, but because their starting point might look a lot like yours.

"Luke is what a personal trainer should be. He encourages, motivates and pushes you. He has extensive physiological knowledge and has not left a question unanswered. I can only recommend working with him!"
Rasmus

"Starting my training journey with Luke as my PT a year ago has been the best investment I ever made for my health and fitness. He knows just when to push me harder and when to take a step back."
Andreea

Whether it's in-person at my Berlin gyms or online from anywhere, the coaching is the same quality. It's just about having someone in your corner.

Stay consistent,
Coach Luki`,
    unsubscribeUrl
  );

  return { html, text };
}

/* ── Email 5: Coaching pitch with CTA (Day 14) ── */
export function coachingPitchEmail(firstName: string, unsubscribeUrl: string): EmailContent {
  const html = layoutHtml(
    `
    <h1 style="font-size: 24px; color: #1a1a1a;">${firstName}, ready for the next level?</h1>
    <p style="line-height: 1.7;">
      You've had the template for a couple weeks now. If you've been
      following it, you're probably starting to feel a difference. Stronger,
      more energized, more confident in the gym.
    </p>
    <p style="line-height: 1.7;">
      But here's the thing. A template can only take you so far. It doesn't
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
    ${buttonHtml("Book your consultation", CALENDAR_URL)}
    <p style="line-height: 1.7;">
      No pressure, no pitch. We just talk about your goals and I'll tell you
      honestly if I think I can help. If we're a good fit, we start. If not,
      you keep the template and my best advice.
    </p>
    <p style="line-height: 1.7;">Let's go,<br /><strong>Coach Luki</strong></p>
  `,
    unsubscribeUrl
  );

  const text = layoutText(
    `${firstName}, ready for the next level?

You've had the template for a couple weeks now. If you've been following it, you're probably starting to feel a difference. Stronger, more energized, more confident in the gym.

But here's the thing. A template can only take you so far. It doesn't know your body, your schedule, your weak points, or what you had for breakfast. That's where coaching comes in.

Here's what 1-on-1 coaching with me looks like:
- A training program built specifically around your body and goals
- Nutrition coaching that fits your lifestyle (not a diet you'll quit)
- Weekly check-ins and progress tracking
- Direct WhatsApp support between sessions
- In-person at John Reed Bötzow or EVO Spittelmarkt, or online

Book your consultation: ${CALENDAR_URL}

No pressure, no pitch. We just talk about your goals and I'll tell you honestly if I think I can help. If we're a good fit, we start. If not, you keep the template and my best advice.

Let's go,
Coach Luki`,
    unsubscribeUrl
  );

  return { html, text };
}

/* ── Contact form confirmation (main site, no drip sequence) ── */
export function contactConfirmationEmail(firstName: string): EmailContent {
  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0; padding:0; background:#f6f6f4;">
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #333; background:#ffffff;">
      <h1 style="font-size: 24px; color: #1a1a1a;">Hey ${firstName},</h1>
      <p style="line-height: 1.7;">
        Thanks for reaching out. I got your message and I'll get back to you
        within 24 hours.
      </p>
      <p style="line-height: 1.7;">
        If you want to skip the back and forth and book a call directly,
        pick a time that works for you here:
      </p>
      ${buttonHtml("Book a call", CALENDAR_URL)}
      <p style="line-height: 1.7;">
        Talk soon,<br /><strong>Coach Luki</strong>
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
      <p style="color: #999; font-size: 12px; line-height: 1.6;">
        <strong>${BUSINESS_NAME}</strong><br />
        ${BUSINESS_LOCATION}<br />
        <a href="${SITE_URL}" style="color: #999;">coachluki.com</a> ·
        <a href="https://instagram.com/coachluki" style="color: #999;">@coachluki</a>
      </p>
    </div>
  </body>
</html>`;

  const text = `Hey ${firstName},

Thanks for reaching out. I got your message and I'll get back to you within 24 hours.

If you want to skip the back and forth and book a call directly, pick a time here: ${CALENDAR_URL}

Talk soon,
Coach Luki

---
${BUSINESS_NAME}
${BUSINESS_LOCATION}
${SITE_URL}`;

  return { html, text };
}

/* ── Sequence config ── */
/* Subject lines avoid spam triggers: no "Free", no all-caps, no excessive punctuation. */
export const SEQUENCE = [
  { step: 1, delayDays: 0, subject: "Your workout template is ready", template: welcomeEmail },
  { step: 2, delayDays: 2, subject: "A training tip that changes everything", template: trainingTipEmail },
  { step: 3, delayDays: 5, subject: "The simplest nutrition framework that works", template: nutritionEmail },
  { step: 4, delayDays: 7, subject: "Real results from real people", template: testimonialEmail },
  { step: 5, delayDays: 14, subject: "Ready for the next level?", template: coachingPitchEmail },
] as const;
