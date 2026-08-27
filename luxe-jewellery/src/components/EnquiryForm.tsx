"use client";

import { useId, useRef, useState } from "react";

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "sending" | "sent" | "failed";

/**
 * A form that actually submits. Validation runs on the server and the errors it
 * returns are rendered against the right fields, so the client cannot be talked
 * out of them. Field errors are announced, the first invalid field takes focus,
 * and the submit state is exposed politely rather than only as a spinner.
 */
export default function EnquiryForm({ piece }: { piece?: string }) {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const fieldId = (n: string) => `${uid}-${n}`;
  const errId = (n: string) => `${uid}-${n}-error`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrors({});
    setFailure("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
      company: fd.get("company"),
      piece: piece ?? "",
    };

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus("sent");
        formRef.current?.reset();
        return;
      }

      if (data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        // move the user to the first thing that needs fixing
        const first = Object.keys(data.errors)[0];
        requestAnimationFrame(() => {
          document.getElementById(fieldId(first))?.focus();
        });
        return;
      }

      setStatus("failed");
      setFailure(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setStatus("failed");
      setFailure("We could not reach the atelier. Please check your connection.");
    }
  }

  const field =
    "w-full border-b border-champagne/30 bg-transparent py-3 text-[15px] text-ivory placeholder:text-ivory/40 focus:border-champagne focus:outline-none";
  const label = "block text-[11px] uppercase tracking-luxe text-champagne/85";
  const errCls = "mt-2 block text-[13px] text-[#ff9b8a]";

  if (status === "sent") {
    return (
      <div
        role="status"
        className="border border-champagne/30 p-8 text-center md:p-10"
      >
        <p className="font-display text-3xl text-champagne">Thank you.</p>
        <p className="mx-auto mt-4 max-w-sm text-[15px] font-light leading-relaxed text-ivory/70">
          Your enquiry is with us. Someone from the bench, not a salesperson,
          will reply within two working days.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-8 min-h-11 border-b border-champagne/45 text-[11px] uppercase tracking-luxe text-ivory/85 hover:text-champagne"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-7 text-left">
      <div>
        <label className={label} htmlFor={fieldId("name")}>
          Your name
        </label>
        <input
          id={fieldId("name")}
          name="name"
          type="text"
          autoComplete="name"
          className={field}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? errId("name") : undefined}
          placeholder="Ananya Rao"
        />
        {errors.name && (
          <span id={errId("name")} role="alert" className={errCls}>
            {errors.name}
          </span>
        )}
      </div>

      <div>
        <label className={label} htmlFor={fieldId("email")}>
          Email
        </label>
        <input
          id={fieldId("email")}
          name="email"
          type="email"
          autoComplete="email"
          className={field}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? errId("email") : undefined}
          placeholder="you@example.com"
        />
        {errors.email && (
          <span id={errId("email")} role="alert" className={errCls}>
            {errors.email}
          </span>
        )}
      </div>

      <div>
        <label className={label} htmlFor={fieldId("message")}>
          What are you looking for?
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={4}
          className={`${field} resize-y`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? errId("message") : undefined}
          placeholder="A bridal set for a December wedding, and I would like to see the kundan work in person."
        />
        {errors.message && (
          <span id={errId("message")} role="alert" className={errCls}>
            {errors.message}
          </span>
        )}
      </div>

      {/* honeypot: hidden from people, irresistible to bots */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={fieldId("company")}>Company</label>
        <input id={fieldId("company")} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="min-h-11 bg-champagne px-10 py-4 text-[11px] uppercase tracking-luxe text-obsidian transition-opacity hover:opacity-85 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Request an appointment"}
        </button>

        <p aria-live="polite" className="text-[13px] text-ivory/60">
          {status === "sending" && "Sending your enquiry…"}
          {status === "failed" && <span className="text-[#ff9b8a]">{failure}</span>}
        </p>
      </div>
    </form>
  );
}
