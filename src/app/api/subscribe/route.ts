import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { welcomeEmail, welcomeEmailText } from "@/lib/emails";
import { unsubscribeUrl as buildUnsubscribeUrl } from "@/lib/unsubscribe";

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

    // Save to database
    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      update: { name, goal, preference, timeline },
      create: {
        email,
        name,
        goal,
        preference,
        timeline,
        sequenceStep: 0,
      },
    });

    // Send welcome email (sequence step 0 → 1)
    const resend = getResend();
    if (resend && subscriber.sequenceStep === 0) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      const firstName = name.split(" ")[0];
      const unsubUrl = buildUnsubscribeUrl(email);

      await resend.emails.send({
        from: `Coach Luki <${fromEmail}>`,
        replyTo: fromEmail,
        to: email,
        subject: "Your workout template is ready",
        html: welcomeEmail(firstName, unsubUrl, timeline),
        text: welcomeEmailText(firstName, unsubUrl, timeline),
        headers: {
          "List-Unsubscribe": `<${unsubUrl}>, <mailto:${fromEmail}?subject=unsubscribe>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });

      // Also add to Resend Audience if configured
      const audienceId = process.env.RESEND_AUDIENCE_ID;
      if (audienceId) {
        await resend.contacts.create({
          audienceId,
          email,
          firstName,
          lastName: name.split(" ").slice(1).join(" ") || undefined,
          unsubscribed: false,
        });
      }

      // Mark step 1 as sent
      await prisma.subscriber.update({
        where: { id: subscriber.id },
        data: { sequenceStep: 1, lastEmailAt: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
