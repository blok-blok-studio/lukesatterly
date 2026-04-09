/* ─────────────────── EMAIL TEMPLATES ─────────────────── */
/* 5-email drip sequence for Coach Luki funnel subscribers */

const BRAND_COLOR = "#006633";
const SITE_URL = "https://coachluki.com";
const DOWNLOAD_URL = "https://linktr.ee/coachluki";
const BUSINESS_ADDRESS = "Coach Luki — Personal Training & Nutrition, Berlin, Germany";

function layout(content: string, unsubscribeUrl: string) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Coach Luki</title>
</head>
<body style="margin:0;padding:0;background:#f6f6f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f6f4;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border-radius:12px;">
          <tr>
            <td style="padding:40px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#333;font-size:16px;line-height:1.7;">
              ${content}
              <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
              <p style="color:#888;font-size:12px;line-height:1.6;margin:0 0 8px 0;">
                You're receiving this because you signed up for Coach Luki's
                workout template at <a href="${SITE_URL}" style="color:#888;">coachluki.com</a>.
              </p>
              <p style="color:#888;font-size:12px;line-height:1.6;margin:0 0 8px 0;">
                ${BUSINESS_ADDRESS}<br />
                <a href="${SITE_URL}" style="color:#888;">coachluki.com</a> &middot;
                <a href="https://instagram.com/coachluki" style="color:#888;">@coachluki</a>
              </p>
              <p style="color:#888;font-size:12px;line-height:1.6;margin:0;">
                Don't want these emails?
                <a href="${unsubscribeUrl}" style="color:#888;text-decoration:underline;">Unsubscribe</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(text: string, href: string) {
  // Table-based button — renders reliably in Apple Mail, Gmail, Outlook.
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
    </table>
  `;
}

function footerText(unsubscribeUrl: string) {
  return `\n\n---\nYou're receiving this because you signed up for Coach Luki's workout template at ${SITE_URL}.\n${BUSINESS_ADDRESS}\n${SITE_URL} · instagram.com/coachluki\n\nUnsubscribe: ${unsubscribeUrl}\n`;
}

/* ── Email 1: Welcome + PDF (sent immediately on signup) ── */
export function welcomeEmail(firstName: string, unsubscribeUrl: string, timeline?: string) {
  const followUp =
    timeline === "Ready to start now"
      ? `<p style="line-height:1.7;">
          You mentioned you're ready to start — if you want hands-on coaching
          where I build everything around you specifically,
          <a href="${SITE_URL}/start" style="color:${BRAND_COLOR};font-weight:600;">let's talk</a>.
        </p>`
      : `<p style="line-height:1.7;">
          I'll send you a few more tips over the next couple weeks — just things
          I wish someone had told me when I started training.
        </p>`;

  return layout(
    `
    <h1 style="font-size:24px;color:#1a1a1a;margin:0 0 16px 0;">Hey ${firstName},</h1>
    <p style="line-height:1.7;">
      Thanks for grabbing the workout template. This is the same kind of
      programming I use with my 1-on-1 coaching clients — real structure, real
      progressive overload, no fluff.
    </p>
    ${button("Download your template", DOWNLOAD_URL)}
    <p style="line-height:1.7;">
      Inside you'll find a 4-week program, exercise cues, a nutrition framework,
      and a progress tracking sheet. Give it a real go for at least 2 weeks
      before judging it.
    </p>
    ${followUp}
    <p style="line-height:1.7;">Enjoy the progress,<br /><strong>Coach Luki</strong></p>
  `,
    unsubscribeUrl
  );
}

export function welcomeEmailText(firstName: string, unsubscribeUrl: string, timeline?: string) {
  const followUp =
    timeline === "Ready to start now"
      ? `You mentioned you're ready to start — if you want hands-on coaching where I build everything around you specifically, book a call: ${SITE_URL}/start`
      : `I'll send you a few more tips over the next couple weeks — just things I wish someone had told me when I started training.`;

  return `Hey ${firstName},

Thanks for grabbing the workout template. This is the same kind of programming I use with my 1-on-1 coaching clients — real structure, real progressive overload, no fluff.

Download your template: ${DOWNLOAD_URL}

Inside you'll find a 4-week program, exercise cues, a nutrition framework, and a progress tracking sheet. Give it a real go for at least 2 weeks before judging it.

${followUp}

Enjoy the progress,
Coach Luki${footerText(unsubscribeUrl)}`;
}

/* ── Email 2: Training tip (Day 2) ── */
export function trainingTipEmail(firstName: string, unsubscribeUrl: string) {
  return layout(
    `
    <h1 style="font-size:24px;color:#1a1a1a;margin:0 0 16px 0;">Quick tip, ${firstName}</h1>
    <p style="line-height:1.7;">
      One of the biggest mistakes I see with new clients: they go too heavy too
      fast and their form falls apart. Here's my rule:
    </p>
    <div style="background:#f8f8f6;border-left:4px solid ${BRAND_COLOR};padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0;">
      <p style="margin:0;font-weight:600;color:#1a1a1a;">
        If you can't control the weight on the way down, it's too heavy.
      </p>
    </div>
    <p style="line-height:1.7;">
      The eccentric (lowering) phase is where most of your muscle growth happens.
      Slow it down to a 3-second count on every rep. You'll feel the difference
      immediately.
    </p>
    <p style="line-height:1.7;">
      Try this with the exercises in your template this week and see how much
      harder they get with proper tempo.
    </p>
    <p style="line-height:1.7;">Keep at it,<br /><strong>Coach Luki</strong></p>
  `,
    unsubscribeUrl
  );
}

export function trainingTipEmailText(firstName: string, unsubscribeUrl: string) {
  return `Quick tip, ${firstName}

One of the biggest mistakes I see with new clients: they go too heavy too fast and their form falls apart. Here's my rule:

  "If you can't control the weight on the way down, it's too heavy."

The eccentric (lowering) phase is where most of your muscle growth happens. Slow it down to a 3-second count on every rep. You'll feel the difference immediately.

Try this with the exercises in your template this week and see how much harder they get with proper tempo.

Keep at it,
Coach Luki${footerText(unsubscribeUrl)}`;
}

/* ── Email 3: Nutrition advice (Day 5) ── */
export function nutritionEmail(firstName: string, unsubscribeUrl: string) {
  return layout(
    `
    <h1 style="font-size:24px;color:#1a1a1a;margin:0 0 16px 0;">${firstName}, let's talk food</h1>
    <p style="line-height:1.7;">
      Training is half the equation. The other half is what you eat — and it
      doesn't have to be complicated.
    </p>
    <p style="line-height:1.7;">
      Here's the simplest nutrition framework I give my clients:
    </p>
    <ul style="line-height:2;padding-left:20px;">
      <li><strong>Protein at every meal</strong> — aim for a palm-sized portion</li>
      <li><strong>Eat vegetables you actually like</strong> — don't force kale if you hate it</li>
      <li><strong>Don't drink your calories</strong> — this one change makes a huge difference</li>
      <li><strong>Eat enough</strong> — undereating kills your progress just as much as overeating</li>
    </ul>
    <p style="line-height:1.7;">
      I'm a plant-based athlete myself, so if you're vegan or curious about
      plant-forward nutrition, that's something I specialize in.
    </p>
    <p style="line-height:1.7;">
      The nutrition framework in your template goes deeper — make sure you've
      checked it out.
    </p>
    <p style="line-height:1.7;">Fuel up,<br /><strong>Coach Luki</strong></p>
  `,
    unsubscribeUrl
  );
}

export function nutritionEmailText(firstName: string, unsubscribeUrl: string) {
  return `${firstName}, let's talk food

Training is half the equation. The other half is what you eat — and it doesn't have to be complicated.

Here's the simplest nutrition framework I give my clients:

- Protein at every meal — aim for a palm-sized portion
- Eat vegetables you actually like — don't force kale if you hate it
- Don't drink your calories — this one change makes a huge difference
- Eat enough — undereating kills your progress just as much as overeating

I'm a plant-based athlete myself, so if you're vegan or curious about plant-forward nutrition, that's something I specialize in.

The nutrition framework in your template goes deeper — make sure you've checked it out.

Fuel up,
Coach Luki${footerText(unsubscribeUrl)}`;
}

/* ── Email 4: Client testimonial / social proof (Day 7) ── */
export function testimonialEmail(firstName: string, unsubscribeUrl: string) {
  return layout(
    `
    <h1 style="font-size:24px;color:#1a1a1a;margin:0 0 16px 0;">Real results, ${firstName}</h1>
    <p style="line-height:1.7;">
      I wanted to share what some of my clients have experienced — not to brag,
      but because their starting point might look a lot like yours.
    </p>
    <div style="background:#f8f8f6;padding:20px;border-radius:12px;margin:20px 0;">
      <p style="font-style:italic;margin:0 0 8px 0;line-height:1.6;">
        "Luke is what a personal trainer should be. He encourages, motivates
        and pushes you. He has extensive physiological knowledge and has not
        left a question unanswered. I can only recommend working with him!"
      </p>
      <p style="margin:0;font-weight:600;color:${BRAND_COLOR};">— Rasmus</p>
    </div>
    <div style="background:#f8f8f6;padding:20px;border-radius:12px;margin:20px 0;">
      <p style="font-style:italic;margin:0 0 8px 0;line-height:1.6;">
        "Starting my training journey with Luke as my PT a year ago has been
        the best investment I ever made for my health and fitness. He knows
        just when to push me harder and when to take a step back."
      </p>
      <p style="margin:0;font-weight:600;color:${BRAND_COLOR};">— Andreea</p>
    </div>
    <p style="line-height:1.7;">
      Whether it's in-person at my Berlin gyms or online from anywhere — the
      coaching is the same quality. It's just about having someone in your corner.
    </p>
    <p style="line-height:1.7;">Stay consistent,<br /><strong>Coach Luki</strong></p>
  `,
    unsubscribeUrl
  );
}

export function testimonialEmailText(firstName: string, unsubscribeUrl: string) {
  return `Real results, ${firstName}

I wanted to share what some of my clients have experienced — not to brag, but because their starting point might look a lot like yours.

"Luke is what a personal trainer should be. He encourages, motivates and pushes you. He has extensive physiological knowledge and has not left a question unanswered. I can only recommend working with him!"
— Rasmus

"Starting my training journey with Luke as my PT a year ago has been the best investment I ever made for my health and fitness. He knows just when to push me harder and when to take a step back."
— Andreea

Whether it's in-person at my Berlin gyms or online from anywhere — the coaching is the same quality. It's just about having someone in your corner.

Stay consistent,
Coach Luki${footerText(unsubscribeUrl)}`;
}

/* ── Email 5: Coaching pitch with CTA (Day 14) ── */
export function coachingPitchEmail(firstName: string, unsubscribeUrl: string) {
  return layout(
    `
    <h1 style="font-size:24px;color:#1a1a1a;margin:0 0 16px 0;">${firstName}, ready for the next level?</h1>
    <p style="line-height:1.7;">
      You've had the template for a couple weeks now. If you've been following
      it, you're probably starting to feel a difference — stronger, more
      energized, more confident in the gym.
    </p>
    <p style="line-height:1.7;">
      But here's the thing: a template can only take you so far. It doesn't
      know your body, your schedule, your weak points, or what you had for
      breakfast. That's where coaching comes in.
    </p>
    <p style="line-height:1.7;font-weight:600;color:#1a1a1a;">
      Here's what 1-on-1 coaching with me looks like:
    </p>
    <ul style="line-height:2;padding-left:20px;">
      <li>A training program built specifically around your body and goals</li>
      <li>Nutrition coaching that fits your lifestyle (not a diet you'll quit)</li>
      <li>Weekly check-ins and progress tracking</li>
      <li>Direct WhatsApp support between sessions</li>
      <li>In-person at John Reed Bötzow or EVO Spittelmarkt, or online</li>
    </ul>
    ${button("Book your consultation", SITE_URL + "/start")}
    <p style="line-height:1.7;">
      No pressure, no pitch. We just talk about your goals and I'll tell you
      honestly if I think I can help. If we're a good fit, we start. If not,
      you keep the template and my best advice.
    </p>
    <p style="line-height:1.7;">Let's go,<br /><strong>Coach Luki</strong></p>
  `,
    unsubscribeUrl
  );
}

export function coachingPitchEmailText(firstName: string, unsubscribeUrl: string) {
  return `${firstName}, ready for the next level?

You've had the template for a couple weeks now. If you've been following it, you're probably starting to feel a difference — stronger, more energized, more confident in the gym.

But here's the thing: a template can only take you so far. It doesn't know your body, your schedule, your weak points, or what you had for breakfast. That's where coaching comes in.

Here's what 1-on-1 coaching with me looks like:
- A training program built specifically around your body and goals
- Nutrition coaching that fits your lifestyle (not a diet you'll quit)
- Weekly check-ins and progress tracking
- Direct WhatsApp support between sessions
- In-person at John Reed Bötzow or EVO Spittelmarkt, or online

Book your consultation: ${SITE_URL}/start

No pressure, no pitch. We just talk about your goals and I'll tell you honestly if I think I can help. If we're a good fit, we start. If not, you keep the template and my best advice.

Let's go,
Coach Luki${footerText(unsubscribeUrl)}`;
}

/* ── Sequence config ── */
/* Subject lines avoid spam triggers: no "Free", no all-caps, no excessive punctuation. */
export const SEQUENCE = [
  {
    step: 1,
    delayDays: 0,
    subject: "Your workout template is ready",
    template: welcomeEmail,
    text: welcomeEmailText,
  },
  {
    step: 2,
    delayDays: 2,
    subject: "A training tip that changes everything",
    template: trainingTipEmail,
    text: trainingTipEmailText,
  },
  {
    step: 3,
    delayDays: 5,
    subject: "The simplest nutrition framework that works",
    template: nutritionEmail,
    text: nutritionEmailText,
  },
  {
    step: 4,
    delayDays: 7,
    subject: "Real results from real people",
    template: testimonialEmail,
    text: testimonialEmailText,
  },
  {
    step: 5,
    delayDays: 14,
    subject: "Ready for the next level?",
    template: coachingPitchEmail,
    text: coachingPitchEmailText,
  },
] as const;
