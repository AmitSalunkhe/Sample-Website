import { NextResponse } from "next/server";

/**
 * Enquiry endpoint.
 *
 * This validates and accepts submissions for real. What it does NOT do is
 * deliver them anywhere: there is no mail provider or database wired up, so a
 * successful response means "accepted and logged on the server", not "the
 * atelier received it". See deliver() below for the one place to change.
 */

export const runtime = "nodejs";

type Payload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  piece?: unknown;
  company?: unknown; // honeypot
};

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

function validate(body: Payload): { errors: Errors; clean: Record<string, string> } {
  const name = str(body.name);
  const email = str(body.email);
  const message = str(body.message);
  const piece = str(body.piece).slice(0, 80);

  const errors: Errors = {};
  if (name.length < 2) errors.name = "Please tell us your name.";
  else if (name.length > 100) errors.name = "That name is too long.";

  if (!email) errors.email = "We need an email address to reply to.";
  else if (!EMAIL.test(email) || email.length > 200)
    errors.email = "That email address does not look right.";

  if (message.length < 10)
    errors.message = "A sentence or two about what you are looking for.";
  else if (message.length > 2000)
    errors.message = "Please keep this under 2000 characters.";

  return { errors, clean: { name, email, message, piece } };
}

/** Very small in-memory throttle. Resets on redeploy; good enough for a demo. */
const hits = new Map<string, { n: number; first: number }>();
const WINDOW = 60_000;
const MAX = 5;

function throttled(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.first > WINDOW) {
    hits.set(ip, { n: 1, first: now });
    return false;
  }
  rec.n += 1;
  return rec.n > MAX;
}

async function deliver(enquiry: Record<string, string>) {
  // TODO: wire a real destination here. Any of these is a small change:
  //   - Resend / Postmark / SendGrid: await resend.emails.send({ ... })
  //   - a database: await db.insert(enquiries).values(enquiry)
  //   - a CRM webhook: await fetch(process.env.CRM_WEBHOOK, { ... })
  // Until then this only reaches the server log.
  console.log("[enquiry]", JSON.stringify(enquiry));
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Bots fill every field they find; humans never see this one.
  if (str(body.company)) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (throttled(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries just now. Please try again shortly." },
      { status: 429 }
    );
  }

  const { errors, clean } = validate(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  await deliver({ ...clean, receivedAt: new Date().toISOString() });

  return NextResponse.json({ ok: true, delivered: false });
}
