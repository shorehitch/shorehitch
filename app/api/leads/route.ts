import { NextRequest, NextResponse } from "next/server";

const MAX_LENGTH = 4000;
const ALLOWED_TYPES = new Set(["contact", "dealer"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const type = clean(body?.type, 20);
    if (!ALLOWED_TYPES.has(type)) return NextResponse.json({ error: "Invalid submission type" }, { status: 400 });

    if (clean(body?.companyWebsite, 200)) return NextResponse.json({ ok: true });

    const email = clean(body?.email, 320).toLowerCase();
    const firstName = clean(body?.firstName, 100);
    const lastName = clean(body?.lastName, 100);
    const message = clean(body?.message, MAX_LENGTH);
    if (!email || !EMAIL_PATTERN.test(email) || !firstName || !lastName || !message) {
      return NextResponse.json({ error: "Please complete all required fields with a valid email address." }, { status: 400 });
    }

    const payload = {
      type,
      firstName,
      lastName,
      email,
      phone: clean(body?.phone, 80),
      business: clean(body?.business, 200),
      website: clean(body?.website, 500),
      location: clean(body?.location, 200),
      businessType: clean(body?.businessType, 100),
      message,
      source: "shorehitch-headless",
      submittedAt: new Date().toISOString(),
    };

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = type === "dealer" ? process.env.DEALER_TO_EMAIL : process.env.CONTACT_TO_EMAIL;

    if (resendApiKey && fromEmail && toEmail) {
      const subject = type === "dealer"
        ? `New ShoreHitch dealer application — ${firstName} ${lastName}`
        : `New ShoreHitch contact message — ${firstName} ${lastName}`;

      const details = [
        ["Name", `${firstName} ${lastName}`],
        ["Email", email],
        ["Phone", payload.phone],
        ["Business", payload.business],
        ["Website", payload.website],
        ["Location", payload.location],
        ["Business type", payload.businessType],
        ["Submitted", payload.submittedAt],
      ].filter(([, value]) => Boolean(value));

      const html = `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
          <h2>${type === "dealer" ? "Dealer Application" : "Contact Submission"}</h2>
          ${details.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`).join("")}
          <hr />
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
        </div>
      `;

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject,
          html,
          tags: [
            { name: "source", value: "shorehitch-headless" },
            { name: "lead_type", value: type },
          ],
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("Resend lead delivery failed", response.status, await response.text());
        return NextResponse.json({ error: "We could not deliver your message. Please try again shortly." }, { status: 502 });
      }

      return NextResponse.json({ ok: true });
    }

    const webhook = process.env.LEADS_WEBHOOK_URL;
    if (webhook) {
      const response = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.LEADS_WEBHOOK_BEARER ? { Authorization: `Bearer ${process.env.LEADS_WEBHOOK_BEARER}` } : {}),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (!response.ok) {
        return NextResponse.json({ error: "We could not deliver your message. Please try again shortly." }, { status: 502 });
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: "This form is being connected for launch. Please try again after the production rollout." },
      { status: 503 },
    );
  } catch {
    return NextResponse.json({ error: "Unable to process this submission." }, { status: 400 });
  }
}
