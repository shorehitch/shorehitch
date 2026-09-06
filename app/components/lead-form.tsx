"use client";

import { FormEvent, useState } from "react";

type LeadType = "contact" | "dealer";
type Props = { type: LeadType };

export default function LeadForm({ type }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending"); setMessage("");
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const data = type === "dealer"
      ? { ...raw, firstName: raw.contactName, lastName: raw.business, message: raw.message || "Dealer info sheet submission" }
      : raw;
    try {
      const response = await fetch("/api/leads", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ ...data, type }) });
      const result=await response.json(); if(!response.ok) throw new Error(result?.error||"Submission failed");
      form.reset(); setStatus("success");
      setMessage(type==="dealer"?"Info sheet received. Our dealer team will review your information and follow up.":"Message received. Our team will be in touch.");
    } catch(error) { setStatus("error"); setMessage(error instanceof Error?error.message:"Unable to submit right now. Please try again shortly."); }
  }

  const field="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3.5 text-white outline-none transition placeholder:text-white/30 focus:border-[#4AC9D3] focus:ring-1 focus:ring-[#4AC9D3]/30";
  const label="mb-2 block text-xs font-bold uppercase tracking-[.14em] text-white/70";

  if(type === "dealer") return <form onSubmit={submit} className="space-y-5">
    <div className="grid gap-5 md:grid-cols-2">
      <label><span className={label}>Contact Name *</span><input className={field} name="contactName" placeholder="Your full name" autoComplete="name" required/></label>
      <label><span className={label}>Business Name *</span><input className={field} name="business" placeholder="Business name" autoComplete="organization" required/></label>
    </div>
    <label><span className={label}>Business Type *</span><select className={field} name="businessType" required defaultValue=""><option value="" disabled className="bg-black">Select business type</option><option className="bg-black">Marina or Boat Club</option><option className="bg-black">Marine Retailer</option><option className="bg-black">Boat Dealer</option><option className="bg-black">Watersports Shop</option><option className="bg-black">Outdoor & Lifestyle Retailer</option><option className="bg-black">Gift & Specialty</option><option className="bg-black">Tournament / Event Sponsor</option><option className="bg-black">International Partner</option><option className="bg-black">Other</option></select></label>
    <label><span className={label}>Location *</span><input className={field} name="location" placeholder="City, State / Region / Country" autoComplete="address-level2" required/></label>
    <div className="grid gap-5 md:grid-cols-2">
      <label><span className={label}>Email *</span><input className={field} name="email" type="email" placeholder="you@business.com" autoComplete="email" required/></label>
      <label><span className={label}>Phone</span><input className={field} name="phone" type="tel" placeholder="Phone number" autoComplete="tel"/></label>
    </div>
    <label><span className={label}>Notes &amp; Questions</span><textarea className={`${field} min-h-36 resize-y`} name="message" placeholder="Tell us anything else you'd like us to know."/></label>
    <input name="companyWebsite" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
    <button type="submit" disabled={status==="sending"} className="w-full rounded-xl bg-[#4AC9D3] px-6 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:bg-[#6DD8E1] disabled:cursor-not-allowed disabled:opacity-60">{status==="sending"?"Sending…":"Submit My Dealer Info Sheet"}</button>
    {message&&<p role="status" className={status==="error"?"text-sm text-red-300":"text-sm text-[#4AC9D3]"}>{message}</p>}
  </form>;

  return <form onSubmit={submit} className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2"><input className={field} name="firstName" placeholder="First name" autoComplete="given-name" required/><input className={field} name="lastName" placeholder="Last name" autoComplete="family-name" required/></div>
    <div className="grid gap-4 md:grid-cols-2"><input className={field} name="email" type="email" placeholder="Email" autoComplete="email" required/><input className={field} name="phone" type="tel" placeholder="Phone" autoComplete="tel" required/></div>
    <textarea className={`${field} min-h-36 resize-y`} name="message" placeholder="How can we help?" required/>
    <input name="companyWebsite" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
    <button type="submit" disabled={status==="sending"} className="w-full rounded-md bg-[#4AC9D3] px-6 py-3 font-semibold text-black transition hover:bg-[#6DD8E1] disabled:cursor-not-allowed disabled:opacity-60">{status==="sending"?"Sending…":"Send Message"}</button>
    {message&&<p role="status" className={status==="error"?"text-sm text-red-300":"text-sm text-[#4AC9D3]"}>{message}</p>}
  </form>;
}
