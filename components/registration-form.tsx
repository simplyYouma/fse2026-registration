"use client";

import { useMemo, useState } from "react";
import {
  REGISTRATION_TYPES, COUNTRIES, REGIONS, DIETARY_OPTIONS, BIRTH_YEAR_OPTIONS,
  ETHNIC_ORIGIN_OPTIONS, RACE_OPTIONS, REGISTRATION_ITEMS, ADD_ONS,
  ONE_DAY_EVENTS, CO_LOCATED_CONFERENCES,
} from "@/lib/form-options";

type FormState = {
  // step 1
  firstName: string; lastName: string; email: string; registrationType: string;
  // step 2
  address1: string; address2: string; country: string; city: string;
  state: string; zipCode: string;
  gender: string; genderOther: string; region: string;
  certificateOfAttendance: boolean; vatNumber: string;
  // step 3
  studentProofFileName: string; hasDisability: string;
  dietaryRestrictions: string[];
  // step 4
  cvOptIn: string; cvFileName: string; visaSupportLetter: string;
  postalMailOptOut: boolean; emailOptOut: string; virtualConsent: boolean;
  // step 5
  ukEea: string; genderIdentity: string; birthYear: string;
  ethnicOrigin: string; ethnicOriginDetails: string[];
  race: string; raceDetails: string[];
  acmDisability: string; currentCountry: string;
  // step 6
  mainItem: string; banquet: string; mentoringSymposium: string;
  paperAuthor: string; reroutedPresentations: string;
  // step 7
  addOns: string[];
  oneDayEvent: string[]; coLocatedConference: string[];
};

const initialState: FormState = {
  firstName: "", lastName: "", email: "", registrationType: "",
  address1: "", address2: "", country: "", city: "", state: "", zipCode: "",
  gender: "", genderOther: "", region: "",
  certificateOfAttendance: false, vatNumber: "",
  studentProofFileName: "", hasDisability: "",
  dietaryRestrictions: [],
  cvOptIn: "", cvFileName: "", visaSupportLetter: "",
  postalMailOptOut: false, emailOptOut: "", virtualConsent: false,
  ukEea: "", genderIdentity: "", birthYear: "",
  ethnicOrigin: "", ethnicOriginDetails: [],
  race: "", raceDetails: [],
  acmDisability: "", currentCountry: "",
  mainItem: "", banquet: "", mentoringSymposium: "",
  paperAuthor: "", reroutedPresentations: "",
  addOns: [],
  oneDayEvent: [], coLocatedConference: [],
};

const STEPS = [
  "Personal",
  "Address",
  "Registration Questions",
  "Sponsors & Communications",
  "ACM Demographics",
  "Registration Items",
  "Add-Ons & Co-located",
  "Review",
];

export default function RegistrationForm() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ id: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = useMemo(() => {
    let sum = 0;
    const main = REGISTRATION_ITEMS.find(i => i.id === data.mainItem);
    if (main) sum += main.price;
    for (const id of data.addOns) {
      const a = ADD_ONS.find(x => x.id === id);
      if (a) sum += a.price;
    }
    return sum;
  }, [data.mainItem, data.addOns]);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setData(d => ({ ...d, [k]: v }));
  }

  function toggle<K extends keyof FormState>(k: K, value: string) {
    setData(d => {
      const arr = (d[k] as unknown as string[]) ?? [];
      const next = arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value];
      return { ...d, [k]: next as unknown as FormState[K] };
    });
  }

  function validateStep(): boolean {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!data.firstName.trim()) e.firstName = "Required";
      if (!data.lastName.trim()) e.lastName = "Required";
      if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Valid email required";
      if (!data.registrationType) e.registrationType = "Required";
    }
    if (step === 1) {
      if (!data.address1.trim()) e.address1 = "Required";
      if (!data.country) e.country = "Required";
      if (!data.city.trim()) e.city = "Required";
      if (!data.state.trim()) e.state = "Required";
      if (!data.zipCode.trim()) e.zipCode = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        dietaryRestrictions: data.dietaryRestrictions.join(", "),
        ethnicOriginDetails: data.ethnicOriginDetails.join(", "),
        raceDetails: data.raceDetails.join(", "),
        addOns: data.addOns.join(", "),
        oneDayEvent: data.oneDayEvent.join(", "),
        coLocatedConference: data.coLocatedConference.join(", "),
        totalAmount: total,
      };
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Submission failed");
      const json = await res.json();
      setSuccess({ id: json.id });
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="fse-card text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Submitted!</h2>
        <p className="text-slate-600 mb-1">Thank you for registering for ESEC/FSE &apos;26.</p>
        <p className="text-sm text-slate-500 mb-6 break-all">Confirmation ID: <span className="font-mono">{success.id}</span></p>
        <p className="text-slate-600">A confirmation email will be sent to <span className="font-medium">{data.email}</span>.</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 0%, transparent 40%), radial-gradient(circle at 80% 80%, white 0%, transparent 40%)" }} />
          <div className="relative p-6 sm:p-10 md:p-14 text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              ✨ Registration is now open
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-3 sm:mb-4 tracking-tight">
              FSE 2026
            </h1>
            <p className="text-base sm:text-xl text-blue-50 mb-2 max-w-2xl mx-auto">
              ESEC/FSE &apos;26 — 34th ACM Joint European Software Engineering Conference
            </p>
            <p className="text-sm sm:text-base text-blue-100 mb-6 sm:mb-8">
              📅 Sun 5 – Thu 9 July 2026  ·  📍 Montreal, Canada
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 max-w-2xl mx-auto text-left">
              <Feature icon="📝" title="8 quick steps" desc="~5 min to complete" />
              <Feature icon="🔒" title="Secure" desc="Your data is protected" />
              <Feature icon="📧" title="Confirmation" desc="Email sent instantly" />
            </div>
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="inline-flex items-center justify-center gap-2 px-7 sm:px-10 py-3 sm:py-4 rounded-xl bg-white text-blue-700 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              Start Registration <span className="text-xl">→</span>
            </button>
            <p className="text-xs text-blue-100 mt-4 sm:mt-6 opacity-80">
              By starting you agree to ACM&apos;s privacy policy.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Banner with gradient */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 text-white p-5 sm:p-6 md:p-8 mb-5 md:mb-6 shadow-lg">
        <div className="relative flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="text-2xl sm:text-3xl font-bold mb-1">FSE 2026</div>
            <div className="text-blue-100 text-xs sm:text-sm leading-snug">ESEC/FSE &apos;26: 34th ACM Joint European Software Engineering Conference</div>
          </div>
          <div className="text-left sm:text-right text-xs sm:text-sm flex-shrink-0">
            <div className="font-semibold">Sun 5 – Thu 9 July 2026</div>
            <div className="text-blue-100">Montreal, Canada</div>
          </div>
        </div>
      </div>

      {/* Modern Stepper */}
      <Stepper step={step} total={STEPS.length} label={STEPS[step]} />

      <div className="fse-card">
        {step === 0 && <StepPersonal data={data} update={update} errors={errors} />}
        {step === 1 && <StepAddress data={data} update={update} errors={errors} />}
        {step === 2 && <StepQuestions data={data} update={update} toggle={toggle} />}
        {step === 3 && <StepSponsors data={data} update={update} />}
        {step === 4 && <StepACMDemographics data={data} update={update} toggle={toggle} />}
        {step === 5 && <StepItems data={data} update={update} />}
        {step === 6 && <StepAddOns data={data} update={update} toggle={toggle} />}
        {step === 7 && <StepReview data={data} total={total} />}

        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="text-center text-sm text-slate-600 mb-4 sm:hidden">
            Total: <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => { setErrors({}); setStep(s => Math.max(0, s - 1)); }}
              disabled={step === 0}
              className="fse-btn-secondary flex-1 sm:flex-none"
            >
              ← <span className="hidden sm:inline">Previous</span>
            </button>
            <div className="hidden sm:block text-sm text-slate-600">
              Total: <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
            </div>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => { if (validateStep()) setStep(s => s + 1); }}
                className="fse-btn-primary flex-1 sm:flex-none"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="fse-btn-primary flex-1 sm:flex-none"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-3 sm:p-4 border border-white/20">
      <div className="text-xl sm:text-2xl mb-1">{icon}</div>
      <div className="font-semibold text-sm sm:text-base">{title}</div>
      <div className="text-xs sm:text-sm text-blue-100">{desc}</div>
    </div>
  );
}

function Stepper({ step, total, label }: { step: number; total: number; label: string }) {
  const pct = ((step + 1) / total) * 100;
  return (
    <div className="mb-5 md:mb-6">
      {/* Mobile: progress bar + label */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">
            Step {step + 1}/{total}
          </span>
          <span className="text-sm text-blue-600 font-medium truncate ml-2">{label}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Desktop: numbered circles */}
      <div className="hidden sm:block">
        <div className="flex items-center">
          {Array.from({ length: total }).map((_, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className={`relative flex items-center justify-center w-9 h-9 rounded-full font-semibold text-sm transition-all
                  ${done ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md"
                    : active ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg ring-4 ring-blue-100 scale-110"
                    : "bg-white border-2 border-slate-300 text-slate-400"}`}>
                  {done ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                {i < total - 1 && (
                  <div className="flex-1 h-0.5 mx-1 lg:mx-2 rounded">
                    <div className={`h-full rounded transition-all duration-500 ${i < step ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-slate-200"}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-center">
          <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Step {step + 1} of {total}</span>
          <div className="text-base font-bold text-slate-900 mt-0.5">{label}</div>
        </div>
      </div>
    </div>
  );
}

type Props = { data: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void; errors?: Record<string, string>; toggle?: (k: keyof FormState, v: string) => void };

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={`fse-label ${required ? "fse-required" : ""}`}>{label}</label>
      {children}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function StepPersonal({ data, update, errors }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-1">Personal Information</h2>
      <p className="text-slate-600 text-center mb-6">Fill out the information below, then click Next to continue.</p>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="First name" required error={errors?.firstName}>
          <input className="fse-input" value={data.firstName} onChange={e => update("firstName", e.target.value)} />
        </Field>
        <Field label="Last name" required error={errors?.lastName}>
          <input className="fse-input" value={data.lastName} onChange={e => update("lastName", e.target.value)} />
        </Field>
        <Field label="Email address" required error={errors?.email}>
          <input type="email" className="fse-input" value={data.email} onChange={e => update("email", e.target.value)} />
        </Field>
        <Field label="Registration Type" required error={errors?.registrationType}>
          <select className="fse-input" value={data.registrationType} onChange={e => update("registrationType", e.target.value)}>
            <option value="">Select…</option>
            {REGISTRATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );
}

function StepAddress({ data, update, errors }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Address</h2>
      <div className="space-y-4">
        <Field label="Address 1" required error={errors?.address1}>
          <input className="fse-input" value={data.address1} onChange={e => update("address1", e.target.value)} />
        </Field>
        <Field label="Address 2">
          <input className="fse-input" value={data.address2} onChange={e => update("address2", e.target.value)} />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Country/Region" required error={errors?.country}>
            <select className="fse-input" value={data.country} onChange={e => update("country", e.target.value)}>
              <option value="">Select…</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="City" required error={errors?.city}>
            <input className="fse-input" value={data.city} onChange={e => update("city", e.target.value)} />
          </Field>
          <Field label="State/Province" required error={errors?.state}>
            <input className="fse-input" value={data.state} onChange={e => update("state", e.target.value)} />
          </Field>
          <Field label="ZIP/Postal code" required error={errors?.zipCode}>
            <input className="fse-input" value={data.zipCode} onChange={e => update("zipCode", e.target.value)} />
          </Field>
        </div>

        <Field label="What is your gender?">
          <div className="space-y-2">
            {["Male", "Female", "Other"].map(g => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" checked={data.gender === g} onChange={() => update("gender", g)} className="w-4 h-4 text-blue-600" />
                <span>{g}</span>
              </label>
            ))}
            {data.gender === "Other" && (
              <input className="fse-input mt-2" placeholder="Please specify"
                value={data.genderOther} onChange={e => update("genderOther", e.target.value)} />
            )}
          </div>
        </Field>

        <Field label="What is your region?">
          <select className="fse-input" value={data.region} onChange={e => update("region", e.target.value)}>
            <option value="">Select…</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>

        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Certificate of Attendance</h3>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={data.certificateOfAttendance}
              onChange={e => update("certificateOfAttendance", e.target.checked)}
              className="w-4 h-4 mt-0.5 text-blue-600" />
            <span className="text-sm">Check this box if you would like to receive a certificate of attendance</span>
          </label>
        </div>

        <Field label="Company VAT number (if applicable)">
          <input className="fse-input" value={data.vatNumber} onChange={e => update("vatNumber", e.target.value)} placeholder="If your company is paying your registration fee and requires a VAT number on the invoice." />
        </Field>
      </div>
    </div>
  );
}

function StepQuestions({ data, update, toggle }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">Registration Questions</h2>
      <div className="space-y-6">
        <Field label="Students must upload legible proof of student status (e.g. copy of student ID)">
          <input type="file" accept=".pdf,image/*"
            onChange={e => update("studentProofFileName", e.target.files?.[0]?.name ?? "")}
            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {data.studentProofFileName && <p className="text-sm text-slate-600 mt-1">📎 {data.studentProofFileName}</p>}
        </Field>

        <Field label="Do you have a disability or special need that impacts your access to ACM conferences, special interest groups, publications, or digital resources?">
          <div className="space-y-2">
            {["Yes", "No", "Prefer not to submit"].map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="hasDisability" checked={data.hasDisability === o}
                  onChange={() => update("hasDisability", o)} className="w-4 h-4 text-blue-600" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Please list any dietary restrictions of which requires our awareness:">
          <div className="grid md:grid-cols-2 gap-2">
            {DIETARY_OPTIONS.map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox"
                  checked={data.dietaryRestrictions.includes(o)}
                  onChange={() => toggle?.("dietaryRestrictions", o)}
                  className="w-4 h-4 text-blue-600" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

function StepSponsors({ data, update }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">Sponsors & Communications</h2>
      <div className="space-y-6 text-sm">
        <div>
          <p className="text-slate-700 mb-2">FSE have sponsors who are interested in recruiting students. If you are interested in job opportunities, would you like to opt-in and submit your CV/resume to our database which we will share with our sponsors?</p>
          <div className="space-y-2">
            {["Yes, I would like to be contacted", "No, I choose to opt out"].map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="cvOptIn" checked={data.cvOptIn === o}
                  onChange={() => update("cvOptIn", o)} className="w-4 h-4 text-blue-600" />
                <span>{o}</span>
              </label>
            ))}
          </div>
          {data.cvOptIn.startsWith("Yes") && (
            <div className="mt-3">
              <input type="file" accept=".pdf,.doc,.docx"
                onChange={e => update("cvFileName", e.target.files?.[0]?.name ?? "")}
                className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700" />
              {data.cvFileName && <p className="text-sm text-slate-600 mt-1">📎 {data.cvFileName}</p>}
            </div>
          )}
        </div>

        <Field label="Do you require a Visa Support Letter?">
          <div className="space-y-2">
            {["Yes", "No"].map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="visa" checked={data.visaSupportLetter === o}
                  onChange={() => update("visaSupportLetter", o)} className="w-4 h-4 text-blue-600" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </Field>

        <div>
          <h3 className="font-semibold text-slate-900 mb-1">Postal Mail Opt-Out</h3>
          <p className="text-slate-600 mb-2">ACM occasionally makes the conference attendee lists available to companies and other societies for IT related mailings.</p>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={data.postalMailOptOut}
              onChange={e => update("postalMailOptOut", e.target.checked)}
              className="w-4 h-4 mt-0.5 text-blue-600" />
            <span>Please do not release my postal address to third parties</span>
          </label>
        </div>

        <Field label="Email Opt-Out">
          <p className="text-slate-600 mb-2 text-xs">ACM does not sell, rent or exchange email addresses of its members, conference attendees, etc.</p>
          <div className="space-y-2">
            {["Yes, please send me ACM Announcements via email", "No, please do not send me ACM Announcements via email"].map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="emailOptOut" checked={data.emailOptOut === o}
                  onChange={() => update("emailOptOut", o)} className="w-4 h-4 text-blue-600" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </Field>

        <div>
          <h3 className="font-semibold text-slate-900 mb-1">Virtual Conference Consent</h3>
          <p className="text-slate-600 mb-2 text-xs">Recordings of sessions, chats, questions, and answers may be captured and made available for later viewing.</p>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={data.virtualConsent}
              onChange={e => update("virtualConsent", e.target.checked)}
              className="w-4 h-4 mt-0.5 text-blue-600" />
            <span>I give my consent</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function StepACMDemographics({ data, update, toggle }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">ACM Required Demographic Questions</h2>
      <p className="text-sm text-slate-600 mb-6">This survey is designed to help ACM measure progress in relation to diversity, equity and inclusion (DEI) in all ACM activities.</p>
      <div className="space-y-6">
        <Field label="Are you in the UK or EEA (European Economic Area)?" required>
          <div className="space-y-2">
            {["Yes", "No"].map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="ukEea" checked={data.ukEea === o}
                  onChange={() => update("ukEea", o)} className="w-4 h-4 text-blue-600" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="With which gender do you most identify?" required>
          <div className="space-y-2">
            {["Woman", "Man", "Non-binary or gender diverse", "Prefer not to disclose", "Other"].map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="genderIdentity" checked={data.genderIdentity === o}
                  onChange={() => update("genderIdentity", o)} className="w-4 h-4 text-blue-600" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="When were you born?" required>
          <div className="space-y-2">
            {BIRTH_YEAR_OPTIONS.map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="birthYear" checked={data.birthYear === o}
                  onChange={() => update("birthYear", o)} className="w-4 h-4 text-blue-600" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="What are your ethnic origins or ancestry?" required>
          <div className="space-y-2 mb-3">
            {["Prefer not to disclose", "Make your selections"].map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="ethnicOrigin" checked={data.ethnicOrigin === o}
                  onChange={() => update("ethnicOrigin", o)} className="w-4 h-4 text-blue-600" />
                <span>{o}</span>
              </label>
            ))}
          </div>
          {data.ethnicOrigin === "Make your selections" && (
            <div className="ml-6 space-y-2 border-l-2 border-blue-200 pl-4">
              <p className="text-sm font-medium">Select ALL that apply:</p>
              {ETHNIC_ORIGIN_OPTIONS.map(o => (
                <label key={o} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox"
                    checked={data.ethnicOriginDetails.includes(o)}
                    onChange={() => toggle?.("ethnicOriginDetails", o)}
                    className="w-4 h-4 text-blue-600" />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          )}
        </Field>

        <Field label="How would you identify yourself in terms of race?" required>
          <div className="space-y-2 mb-3">
            {["Prefer not to disclose", "Make your selections"].map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="race" checked={data.race === o}
                  onChange={() => update("race", o)} className="w-4 h-4 text-blue-600" />
                <span>{o}</span>
              </label>
            ))}
          </div>
          {data.race === "Make your selections" && (
            <div className="ml-6 space-y-2 border-l-2 border-blue-200 pl-4">
              <p className="text-sm font-medium">Select ALL that apply:</p>
              {RACE_OPTIONS.map(o => (
                <label key={o} className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox"
                    checked={data.raceDetails.includes(o)}
                    onChange={() => toggle?.("raceDetails", o)}
                    className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span className="text-sm">{o}</span>
                </label>
              ))}
            </div>
          )}
        </Field>

        <Field label="Do you have a disability?" required>
          <div className="space-y-2">
            {["I do not have a disability or impairment", "Prefer not to disclose", "Make your selections"].map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="acmDisability" checked={data.acmDisability === o}
                  onChange={() => update("acmDisability", o)} className="w-4 h-4 text-blue-600" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Where do you currently live?" required>
          <select className="fse-input" value={data.currentCountry} onChange={e => update("currentCountry", e.target.value)}>
            <option value="">Select ONE…</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );
}

function StepItems({ data, update }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">Registration Items</h2>
      <p className="text-center text-slate-600 mb-6">Select an item and click Next.</p>
      <div className="space-y-3">
        {REGISTRATION_ITEMS.map(item => (
          <label key={item.id} className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition ${data.mainItem === item.id ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
            <div className="flex items-start gap-3">
              <input type="radio" name="mainItem" checked={data.mainItem === item.id}
                onChange={() => update("mainItem", item.id)} className="w-4 h-4 mt-1 text-blue-600" />
              <div>
                <div className="font-semibold text-slate-900">{item.label}</div>
                <div className="text-sm text-slate-600">{item.desc}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">${item.price.toLocaleString()}.00</div>
              {data.mainItem === item.id && <div className="text-xs text-blue-600 font-medium">Selected</div>}
            </div>
          </label>
        ))}
      </div>

      <div className="mt-8 space-y-4 pt-6 border-t border-slate-200">
        <Field label="Main Conference Banquet">
          <div className="space-y-2">
            {["Yes, I will attend (Included)", "No, I choose to opt out"].map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="banquet" checked={data.banquet === o}
                  onChange={() => update("banquet", o)} className="w-4 h-4 text-blue-600" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="The FSE Industry Mentoring Symposium will run in parallel with the FSE main conference. Will you be attending this event?">
          <div className="space-y-2">
            {["Yes", "No"].map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="mentoring" checked={data.mentoringSymposium === o}
                  onChange={() => update("mentoringSymposium", o)} className="w-4 h-4 text-blue-600" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Are you a paper author? - If yes, FSE track and paper ID are required">
          <div className="space-y-2">
            {["Yes", "No"].map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="paperAuthor" checked={data.paperAuthor === o}
                  onChange={() => update("paperAuthor", o)} className="w-4 h-4 text-blue-600" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Do you have re-routed presentations from past years?">
          <div className="space-y-2">
            {["Yes", "No"].map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="rerouted" checked={data.reroutedPresentations === o}
                  onChange={() => update("reroutedPresentations", o)} className="w-4 h-4 text-blue-600" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

function StepAddOns({ data, toggle }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">Additional Items</h2>
      <p className="text-center text-slate-600 mb-6">Select Registration Add-On items or Banquet Tickets you&apos;d like to purchase.</p>
      <div className="space-y-3 mb-8">
        {ADD_ONS.map(item => (
          <label key={item.id} className={`flex items-center justify-between p-4 rounded-lg border-2 transition ${item.full ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${data.addOns.includes(item.id) ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
            <div className="flex items-start gap-3">
              <input type="checkbox" disabled={item.full}
                checked={data.addOns.includes(item.id)}
                onChange={() => toggle?.("addOns", item.id)}
                className="w-4 h-4 mt-1 text-blue-600" />
              <div className="font-medium text-slate-900">{item.label}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">${item.price}.00 each</div>
              {item.full && <div className="text-xs text-red-600">Capacity Full</div>}
            </div>
          </label>
        ))}
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-200">
        <Field label="Which one-day co-located event/conference will you attend?">
          <p className="text-xs text-slate-600 mb-2">Please ensure you have registered for the One-Day Co-Located Event/Conference (or add-on) on the corresponding day.</p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
            {ONE_DAY_EVENTS.map(o => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox"
                  checked={data.oneDayEvent.includes(o)}
                  onChange={() => toggle?.("oneDayEvent", o)}
                  className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{o}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Which co-located conference will you attend?">
          <p className="text-xs text-slate-600 mb-2">Please ensure you have registered for the Co-Located Conference ONLY (or add-on) and/or AIware (or AIware + FSE combo).</p>
          <div className="space-y-2">
            {CO_LOCATED_CONFERENCES.map(o => (
              <label key={o} className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox"
                  checked={data.coLocatedConference.includes(o)}
                  onChange={() => toggle?.("coLocatedConference", o)}
                  className="w-4 h-4 mt-0.5 text-blue-600" />
                <span className="text-sm">{o}</span>
              </label>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

function StepReview({ data, total }: { data: FormState; total: number }) {
  const main = REGISTRATION_ITEMS.find(i => i.id === data.mainItem);
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">Review Your Registration</h2>
      <div className="space-y-4 text-sm">
        <Section title="Personal Information">
          <Row label="Name" value={`${data.firstName} ${data.lastName}`} />
          <Row label="Email" value={data.email} />
          <Row label="Registration Type" value={data.registrationType} />
        </Section>

        <Section title="Address">
          <Row label="Address" value={`${data.address1} ${data.address2}`.trim()} />
          <Row label="City" value={`${data.city}, ${data.state} ${data.zipCode}`} />
          <Row label="Country" value={data.country} />
          <Row label="Region" value={data.region} />
        </Section>

        <Section title="Selected Items">
          {main && <Row label={main.label} value={`$${main.price}.00`} />}
          {data.addOns.map(id => {
            const a = ADD_ONS.find(x => x.id === id);
            return a ? <Row key={id} label={a.label} value={`$${a.price}.00`} /> : null;
          })}
        </Section>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="font-semibold text-slate-900">Total Amount</span>
          <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
        </div>

        <p className="text-xs text-slate-500 text-center mt-4">By submitting, you confirm the information provided is accurate.</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-slate-700">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-right">{value || "—"}</span>
    </div>
  );
}
