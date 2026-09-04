import { NextRequest, NextResponse } from "next/server";

const MAX_LENGTH = 4000;
const ALLOWED_TYPES = new Set(["contact", "dealer"]);

function clean(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const type = clean(body?.type, 20);
    if (!ALLOWED_TYPES.has(type)) return NextResponse.json({ error: "Invalid submission type" }, { status: 400 });

    // Honeypot: silently accept bot submissions without forwarding them.
    if (clean(body?.companyWebsite, 200)) return NextResponse.json({ ok: true });

    const email = clean(body?.email, 320);
    const firstName = clean(body?.firstName, 100);
    const lastName = clean(body?.lastName, 100);
    const message = clean(body?.message, MAX_LENGTH);
    if (!email || !firstName || !lastName || !message) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
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

    const webhook = process.env.LEADS_WEBHOOK_URL;
    if (!webhook) {
      return NextResponse.json(
        { error: "This form is being connected for launch. Please try again after the production rollout." },
        { status: 503 },
      );
    }

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
  } catch {
    return NextResponse.json({ error: "Unable to process this submission." }, { status: 400 });
  }
}
