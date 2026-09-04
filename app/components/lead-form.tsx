"use client";

import { FormEvent, useState } from "react";

type LeadType = "contact" | "dealer";

type Props = {
  type: LeadType;
};

export default function LeadForm({ type }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "Submission failed");
      form.reset();
      setStatus("success");
      setMessage(type === "dealer" ? "Application received. Our dealer team will review your information." : "Message received. Our team will be in touch.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit right now. Please try again shortly.");
    }
  }

  const field = "w-full rounded-md border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-[#4AC9D3]";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input className={field} name="firstName" placeholder="First name" autoComplete="given-name" required />
        <input className={field} name="lastName" placeholder="Last name" autoComplete="family-name" required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input className={field} name="email" type="email" placeholder="Email" autoComplete="email" required />
        <input className={field} name="phone" type="tel" placeholder="Phone" autoComplete="tel" />
      </div>

      {type === "dealer" && (
        <>
          <input className={field} name="business" placeholder="Business / dealership name" required />
          <div className="grid gap-4 md:grid-cols-2">
            <input className={field} name="website" type="url" placeholder="Website (optional)" />
            <input className={field} name="location" placeholder="City, State / Region" required />
          </div>
          <select className={field} name="businessType" required defaultValue="">
            <option value="" disabled className="bg-black">Business type</option>
            <option value="marine-dealer" className="bg-black">Marine dealer</option>
            <option value="marina" className="bg-black">Marina</option>
            <option value="boat-builder" className="bg-black">Boat builder / OEM</option>
            <option value="distributor" className="bg-black">Distributor</option>
            <option value="outdoor-powersports" className="bg-black">Outdoor / powersports retailer</option>
            <option value="other" className="bg-black">Other</option>
          </select>
        </>
      )}

      <textarea
        className={`${field} min-h-36 resize-y`}
        name="message"
        placeholder={type === "dealer" ? "Tell us about your locations, customer base, and what you want to carry." : "How can we help?"}
        required
      />

      <input name="companyWebsite" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-md bg-[#4AC9D3] px-6 py-3 font-semibold text-black transition hover:bg-[#6DD8E1] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : type === "dealer" ? "Submit Dealer Application" : "Send Message"}
      </button>

      {message && (
        <p role="status" className={status === "error" ? "text-sm text-red-300" : "text-sm text-[#4AC9D3]"}>{message}</p>
      )}
    </form>
  );
}
