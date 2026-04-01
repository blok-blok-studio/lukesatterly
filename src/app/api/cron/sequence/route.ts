import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SEQUENCE } from "@/lib/emails";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resend = getResend();
  if (!resend) {
    return NextResponse.json({ error: "Resend not configured" }, { status: 500 });
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const now = new Date();
  let sent = 0;
  let errors = 0;

  // Find subscribers who need their next email
  // Step 1 is sent on signup, so we process steps 2-5 here
  for (const seq of SEQUENCE) {
    if (seq.step <= 1) continue; // Step 1 is sent on signup

    // Find subscribers at the previous step whose delay has elapsed
    const delayMs = seq.delayDays * 24 * 60 * 60 * 1000;
    const cutoff = new Date(now.getTime() - delayMs);

    const subscribers = await prisma.subscriber.findMany({
      where: {
        sequenceStep: seq.step - 1,
        subscribedAt: { lte: cutoff },
        unsubscribed: false,
      },
      take: 50, // Process in batches to avoid timeouts
    });

    for (const sub of subscribers) {
      try {
        const firstName = sub.name.split(" ")[0];

        await resend.emails.send({
          from: `Coach Luki <${fromEmail}>`,
          replyTo: fromEmail,
          to: sub.email,
          subject: seq.subject,
          html: seq.template(firstName),
        });

        await prisma.subscriber.update({
          where: { id: sub.id },
          data: {
            sequenceStep: seq.step,
            lastEmailAt: now,
          },
        });

        sent++;
      } catch (error) {
        console.error(`Failed to send step ${seq.step} to ${sub.email}:`, error);
        errors++;
      }
    }
  }

  return NextResponse.json({
    success: true,
    sent,
    errors,
    timestamp: now.toISOString(),
  });
}
