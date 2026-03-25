import { Resend } from "resend";
import { NextResponse } from "next/server";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, goal, preference, timeline } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const resend = getResend();
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!resend || !audienceId) {
      console.warn("Resend not configured — skipping contact creation");
      return NextResponse.json({ success: true, skipped: true });
    }

    // Add contact to Resend Audience
    await resend.contacts.create({
      audienceId,
      email,
      firstName: name.split(" ")[0],
      lastName: name.split(" ").slice(1).join(" ") || undefined,
      unsubscribed: false,
    });

    // Send confirmation email to the lead
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    await resend.emails.send({
      from: `Coach Luki <${fromEmail}>`,
      to: email,
      subject: "Your Free Workout Template",
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; color: #1a1a1a;">Hey ${name.split(" ")[0]},</h1>
          <p style="color: #555; line-height: 1.7;">
            Thanks for grabbing the free workout template! Here's your download link:
          </p>
          <a href="https://linktr.ee/coachluki"
             style="display: inline-block; background: #5A8A1A; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; margin: 20px 0;">
            Download Your Template
          </a>
          <p style="color: #555; line-height: 1.7;">
            A few details about you:
          </p>
          <ul style="color: #555; line-height: 1.7;">
            <li><strong>Goal:</strong> ${goal || "Not specified"}</li>
            <li><strong>Preference:</strong> ${preference || "Not specified"}</li>
            <li><strong>Timeline:</strong> ${timeline || "Not specified"}</li>
          </ul>
          ${
            timeline === "Ready to start now"
              ? `<p style="color: #555; line-height: 1.7;">
                  You mentioned you're ready to start — I'd love to chat about your goals.
                  <a href="https://coachluki.com" style="color: #5A8A1A; font-weight: 600;">Book a free consultation</a>
                  and let's get to work.
                </p>`
              : `<p style="color: #555; line-height: 1.7;">
                  When you're ready for hands-on coaching, I'm here. Follow me on
                  <a href="https://instagram.com/coachluki" style="color: #5A8A1A;">Instagram</a>
                  for daily tips in the meantime.
                </p>`
          }
          <p style="color: #999; font-size: 12px; margin-top: 40px;">
            Coach Luki — Personal Training & Nutrition, Berlin
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
