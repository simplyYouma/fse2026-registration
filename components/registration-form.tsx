"use client";

import { useMemo, useState } from "react";
import { useLang, LangSwitch } from "@/lib/lang-context";
import {
  REGISTRATION_TYPES, COUNTRIES, REGISTRATION_ITEMS, ADD_ONS,
  WORKSHOPS, OTHER_ONE_DAY_EVENTS, CO_LOCATED_CONFERENCES,
} from "@/lib/form-options";

type FormState = {
  firstName: string; lastName: string; email: string; registrationType: string;
  address1: string; address2: string; country: string; city: string;
  state: string; zipCode: string;
  gender: string; genderOther: string; region: string;
  certificateOfAttendance: boolean; vatRequired: boolean; vatNumber: string;
  studentProofFileName: string; hasDisability: string;
  disabilitySpecify: string; disabilityDetail: string;
  dietaryRestrictions: string[];
  cvOptIn: string; cvFileName: string; visaSupportLetter: string;
  postalMailOptOut: boolean; emailOptOut: string; virtualConsent: boolean;
  ukEea: string; ukEeaConsent: string;
  genderIdentity: string; birthYear: string;
  ethnicOrigin: string; ethnicOriginDetails: string[];
  race: string; raceDetails: string[];
  acmDisability: string; acmDisabilityDetails: string[];
  currentCountry: string;
  mainItem: string; banquet: string; mentoringSymposium: string;
  paperAuthor: string; fseTrack: string; paperId: string;
  reroutedPresentations: string; paperTitle: string; paperAuthors: string; paperOriginalUrl: string;
  addOns: string[];
  oneDayEvent: string[]; coLocatedConference: string[];
};

const initialState: FormState = {
  firstName: "", lastName: "", email: "", registrationType: "",
  address1: "", address2: "", country: "", city: "", state: "", zipCode: "",
  gender: "", genderOther: "", region: "",
  certificateOfAttendance: false, vatRequired: false, vatNumber: "",
  studentProofFileName: "", hasDisability: "",
  disabilitySpecify: "", disabilityDetail: "",
  dietaryRestrictions: [],
  cvOptIn: "", cvFileName: "", visaSupportLetter: "",
  postalMailOptOut: false, emailOptOut: "", virtualConsent: false,
  ukEea: "", ukEeaConsent: "",
  genderIdentity: "", birthYear: "",
  ethnicOrigin: "", ethnicOriginDetails: [],
  race: "", raceDetails: [],
  acmDisability: "", acmDisabilityDetails: [],
  currentCountry: "",
  mainItem: "", banquet: "", mentoringSymposium: "",
  paperAuthor: "", fseTrack: "", paperId: "",
  reroutedPresentations: "", paperTitle: "", paperAuthors: "", paperOriginalUrl: "",
  addOns: [],
  oneDayEvent: [], coLocatedConference: [],
};

const STEP_KEYS = [
  "step_personal", "step_address", "step_questions", "step_sponsors",
  "step_acm", "step_items", "step_addons", "step_review",
] as const;

export default function RegistrationForm() {
  const { t } = useLang();
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
      if (!data.firstName.trim()) e.firstName = t("err_required");
      if (!data.lastName.trim()) e.lastName = t("err_required");
      if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = t("err_email");
      if (!data.registrationType) e.registrationType = t("err_required");
    }
    if (step === 1) {
      if (!data.address1.trim()) e.address1 = t("err_required");
      if (!data.country) e.country = t("err_required");
      if (!data.city.trim()) e.city = t("err_required");
      if (!data.state.trim()) e.state = t("err_required");
      if (!data.zipCode.trim()) e.zipCode = t("err_required");
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
        acmDisabilityDetails: data.acmDisabilityDetails.join(", "),
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
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t("success_title")}</h2>
        <p className="text-slate-600 mb-1">{t("success_thanks")}</p>
        <p className="text-sm text-slate-500 break-all">{t("success_id")} <span className="font-mono">{success.id}</span></p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center max-w-2xl mx-auto">
        <div className="self-end mb-3">
          <LangSwitch />
        </div>
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-14 md:p-16 text-center">
          <div className="inline-block text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold mb-6">
            {t("splash_label")}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            FSE <span className="text-blue-600">2026</span>
          </h1>
          <div className="w-12 h-px bg-slate-200 mx-auto my-6" />
          <p className="text-base sm:text-lg text-slate-600 mb-2 max-w-md mx-auto leading-relaxed">
            {t("splash_subtitle")}
          </p>
          <p className="text-sm text-slate-500 mb-10">
            {t("splash_dates")}
          </p>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3 sm:py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors"
          >
            {t("splash_cta")}
          </button>
          <p className="text-xs text-slate-400 mt-6">
            {t("splash_hint")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-end mb-3">
        <LangSwitch />
      </div>

      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 text-white p-5 sm:p-6 md:p-8 mb-5 md:mb-6 shadow-lg">
        <div className="relative flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="text-2xl sm:text-3xl font-bold mb-1">FSE 2026</div>
            <div className="text-blue-100 text-xs sm:text-sm leading-snug">{t("banner_subtitle")}</div>
          </div>
          <div className="text-left sm:text-right text-xs sm:text-sm flex-shrink-0">
            <div className="font-semibold">{t("banner_dates")}</div>
            <div className="text-blue-100">{t("banner_location")}</div>
          </div>
        </div>
      </div>

      <Stepper step={step} total={STEP_KEYS.length} label={t(STEP_KEYS[step])} />

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
            {t("total")}: <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => { setErrors({}); setStep(s => Math.max(0, s - 1)); }}
              disabled={step === 0}
              className="fse-btn-secondary flex-1 sm:flex-none"
            >
              ← <span className="hidden sm:inline">{t("previous")}</span>
            </button>
            <div className="hidden sm:block text-sm text-slate-600">
              {t("total")}: <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
            </div>
            {step < STEP_KEYS.length - 1 ? (
              <button
                type="button"
                onClick={() => { if (validateStep()) setStep(s => s + 1); }}
                className="fse-btn-primary flex-1 sm:flex-none"
              >
                {t("next")} →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="fse-btn-primary flex-1 sm:flex-none"
              >
                {submitting ? t("submitting") : t("submit")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stepper({ step, total, label }: { step: number; total: number; label: string }) {
  const { t } = useLang();
  const pct = ((step + 1) / total) * 100;
  return (
    <div className="mb-5 md:mb-6">
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">
            {t("step_of_short")} {step + 1}/{total}
          </span>
          <span className="text-sm text-blue-600 font-medium truncate ml-2">{label}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${pct}%` }} />
        </div>
      </div>

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
          <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">{t("step_of")} {step + 1} {t("step_of_sep")} {total}</span>
          <div className="text-base font-bold text-slate-900 mt-0.5">{label}</div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  data: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  errors?: Record<string, string>;
  toggle?: (k: keyof FormState, v: string) => void;
};

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
  const { t } = useLang();
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-1">{t("personal_title")}</h2>
      <p className="text-slate-600 text-center mb-6">{t("personal_desc")}</p>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label={t("first_name")} required error={errors?.firstName}>
          <input className="fse-input" value={data.firstName} onChange={e => update("firstName", e.target.value)} />
        </Field>
        <Field label={t("last_name")} required error={errors?.lastName}>
          <input className="fse-input" value={data.lastName} onChange={e => update("lastName", e.target.value)} />
        </Field>
        <Field label={t("email")} required error={errors?.email}>
          <input type="email" className="fse-input" value={data.email} onChange={e => update("email", e.target.value)} />
        </Field>
        <Field label={t("registration_type")} required error={errors?.registrationType}>
          <select className="fse-input" value={data.registrationType} onChange={e => update("registrationType", e.target.value)}>
            <option value="">{t("select")}</option>
            {REGISTRATION_TYPES.map(x => <option key={x} value={x}>{x}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );
}

function StepAddress({ data, update, errors }: Props) {
  const { t } = useLang();
  const regions: { v: string; k: "region_africa"|"region_asia"|"region_europe"|"region_namerica"|"region_oceania"|"region_samerica" }[] = [
    { v: "Africa", k: "region_africa" }, { v: "Asia", k: "region_asia" },
    { v: "Europe", k: "region_europe" }, { v: "North America", k: "region_namerica" },
    { v: "Oceania", k: "region_oceania" }, { v: "South America", k: "region_samerica" },
  ];
  const genders: { v: string; k: "gender_male"|"gender_female"|"gender_other" }[] = [
    { v: "Male", k: "gender_male" }, { v: "Female", k: "gender_female" }, { v: "Other", k: "gender_other" },
  ];
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">{t("address_title")}</h2>
      <div className="space-y-4">
        <Field label={t("address1")} required error={errors?.address1}>
          <input className="fse-input" value={data.address1} onChange={e => update("address1", e.target.value)} />
        </Field>
        <Field label={t("address2")}>
          <input className="fse-input" value={data.address2} onChange={e => update("address2", e.target.value)} />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label={t("country")} required error={errors?.country}>
            <select className="fse-input" value={data.country} onChange={e => update("country", e.target.value)}>
              <option value="">{t("select")}</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label={t("city")} required error={errors?.city}>
            <input className="fse-input" value={data.city} onChange={e => update("city", e.target.value)} />
          </Field>
          <Field label={t("state")} required error={errors?.state}>
            <input className="fse-input" value={data.state} onChange={e => update("state", e.target.value)} />
          </Field>
          <Field label={t("zip")} required error={errors?.zipCode}>
            <input className="fse-input" value={data.zipCode} onChange={e => update("zipCode", e.target.value)} />
          </Field>
        </div>

        <Field label={t("gender_q")}>
          <div className="space-y-2">
            {genders.map(g => (
              <label key={g.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" checked={data.gender === g.v} onChange={() => update("gender", g.v)} className="w-4 h-4 text-blue-600" />
                <span>{t(g.k)}</span>
              </label>
            ))}
            {data.gender === "Other" && (
              <input className="fse-input mt-2" placeholder={t("gender_specify")}
                value={data.genderOther} onChange={e => update("genderOther", e.target.value)} />
            )}
          </div>
        </Field>

        <Field label={t("region_q")}>
          <select className="fse-input" value={data.region} onChange={e => update("region", e.target.value)}>
            <option value="">{t("select")}</option>
            {regions.map(r => <option key={r.v} value={r.v}>{t(r.k)}</option>)}
          </select>
        </Field>

        <div>
          <h3 className="font-semibold text-slate-900 mb-2">{t("cert_title")}</h3>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={data.certificateOfAttendance}
              onChange={e => update("certificateOfAttendance", e.target.checked)}
              className="w-4 h-4 mt-0.5 text-blue-600" />
            <span className="text-sm">{t("cert_check")}</span>
          </label>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 mb-2">{t("vat_label")}</h3>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={data.vatRequired}
              onChange={e => update("vatRequired", e.target.checked)}
              className="w-4 h-4 mt-0.5 text-blue-600" />
            <span className="text-sm">{t("vat_check")}</span>
          </label>
          {data.vatRequired && (
            <div className="mt-3 ml-6">
              <Field label={t("vat_input_label")} required>
                <input className="fse-input" value={data.vatNumber}
                  onChange={e => update("vatNumber", e.target.value)} />
              </Field>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepQuestions({ data, update, toggle }: Props) {
  const { t } = useLang();
  const diets: { v: string; k: "diet_none"|"diet_dairy"|"diet_pork"|"diet_vegan"|"diet_gluten"|"diet_nut"|"diet_vegetarian"|"diet_other" }[] = [
    { v: "None", k: "diet_none" }, { v: "Dairy/Lactose Free", k: "diet_dairy" },
    { v: "No Pork", k: "diet_pork" }, { v: "Vegan", k: "diet_vegan" },
    { v: "Gluten Free", k: "diet_gluten" }, { v: "Nut Free", k: "diet_nut" },
    { v: "Vegetarian", k: "diet_vegetarian" }, { v: "Other", k: "diet_other" },
  ];
  const disab: { v: string; k: "yes"|"no"|"prefer_not" }[] = [
    { v: "Yes", k: "yes" }, { v: "No", k: "no" }, { v: "Prefer not to submit", k: "prefer_not" },
  ];
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">{t("questions_title")}</h2>
      <div className="space-y-6">
        <Field label={t("student_proof")}>
          <input type="file" accept=".pdf,image/*"
            onChange={e => update("studentProofFileName", e.target.files?.[0]?.name ?? "")}
            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {data.studentProofFileName && <p className="text-sm text-slate-600 mt-1">{data.studentProofFileName}</p>}
        </Field>

        <Field label={t("disability_q")}>
          <div className="space-y-2">
            {disab.map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="hasDisability" checked={data.hasDisability === o.v}
                  onChange={() => update("hasDisability", o.v)} className="w-4 h-4 text-blue-600" />
                <span>{t(o.k)}</span>
              </label>
            ))}
          </div>
          {data.hasDisability === "Yes" && (
            <div className="ml-6 mt-3 border-l-2 border-blue-200 pl-4 space-y-2">
              <p className="text-sm font-medium fse-required">{t("disability_specify_q")}</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="disabilitySpecify" checked={data.disabilitySpecify === "Prefer not to specify"}
                  onChange={() => update("disabilitySpecify", "Prefer not to specify")} className="w-4 h-4 text-blue-600" />
                <span>{t("prefer_not_specify")}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="disabilitySpecify" checked={data.disabilitySpecify === "Please specify"}
                  onChange={() => update("disabilitySpecify", "Please specify")} className="w-4 h-4 text-blue-600" />
                <span>{t("please_specify")}</span>
              </label>
              {data.disabilitySpecify === "Please specify" && (
                <input className="fse-input ml-6 max-w-xs" value={data.disabilityDetail}
                  onChange={e => update("disabilityDetail", e.target.value)} />
              )}
            </div>
          )}
        </Field>

        <Field label={t("dietary_q")}>
          <div className="grid md:grid-cols-2 gap-2">
            {diets.map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox"
                  checked={data.dietaryRestrictions.includes(o.v)}
                  onChange={() => toggle?.("dietaryRestrictions", o.v)}
                  className="w-4 h-4 text-blue-600" />
                <span>{t(o.k)}</span>
              </label>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

function StepSponsors({ data, update }: Props) {
  const { t } = useLang();
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">{t("sponsors_title")}</h2>
      <div className="space-y-6 text-sm">
        <div>
          <p className="text-slate-700 mb-2">{t("cv_q")}</p>
          <div className="space-y-2">
            {[{ v: "Yes, I would like to be contacted", k: "cv_yes" as const }, { v: "No, I choose to opt out", k: "cv_no" as const }].map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="cvOptIn" checked={data.cvOptIn === o.v}
                  onChange={() => update("cvOptIn", o.v)} className="w-4 h-4 text-blue-600" />
                <span>{t(o.k)}</span>
              </label>
            ))}
          </div>
          {data.cvOptIn.startsWith("Yes") && (
            <div className="mt-3">
              <input type="file" accept=".pdf,.doc,.docx"
                onChange={e => update("cvFileName", e.target.files?.[0]?.name ?? "")}
                className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700" />
              {data.cvFileName && <p className="text-sm text-slate-600 mt-1">{data.cvFileName}</p>}
            </div>
          )}
        </div>

        <Field label={t("visa_q")}>
          <div className="space-y-2">
            {[{ v: "Yes", k: "yes" as const }, { v: "No", k: "no" as const }].map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="visa" checked={data.visaSupportLetter === o.v}
                  onChange={() => update("visaSupportLetter", o.v)} className="w-4 h-4 text-blue-600" />
                <span>{t(o.k)}</span>
              </label>
            ))}
          </div>
        </Field>

        <div>
          <h3 className="font-semibold text-slate-900 mb-1">{t("postal_title")}</h3>
          <p className="text-slate-600 mb-2">{t("postal_desc")}</p>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={data.postalMailOptOut}
              onChange={e => update("postalMailOptOut", e.target.checked)}
              className="w-4 h-4 mt-0.5 text-blue-600" />
            <span>{t("postal_check")}</span>
          </label>
        </div>

        <Field label={t("email_optout_title")}>
          <p className="text-slate-600 mb-2 text-xs">{t("email_optout_desc")}</p>
          <div className="space-y-2">
            {[{ v: "Yes, please send me ACM Announcements via email", k: "email_yes" as const }, { v: "No, please do not send me ACM Announcements via email", k: "email_no" as const }].map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="emailOptOut" checked={data.emailOptOut === o.v}
                  onChange={() => update("emailOptOut", o.v)} className="w-4 h-4 text-blue-600" />
                <span>{t(o.k)}</span>
              </label>
            ))}
          </div>
        </Field>

        <div>
          <h3 className="font-semibold text-slate-900 mb-1">{t("virtual_title")}</h3>
          <p className="text-slate-600 mb-2 text-xs">{t("virtual_desc")}</p>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={data.virtualConsent}
              onChange={e => update("virtualConsent", e.target.checked)}
              className="w-4 h-4 mt-0.5 text-blue-600" />
            <span>{t("virtual_consent")}</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function StepACMDemographics({ data, update, toggle }: Props) {
  const { t } = useLang();
  const yn: { v: string; k: "yes"|"no" }[] = [{ v: "Yes", k: "yes" }, { v: "No", k: "no" }];
  const genderId: { v: string; k: "gender_woman"|"gender_man"|"gender_nb"|"prefer_not"|"gender_other" }[] = [
    { v: "Woman", k: "gender_woman" }, { v: "Man", k: "gender_man" },
    { v: "Non-binary or gender diverse", k: "gender_nb" },
    { v: "Prefer not to disclose", k: "prefer_not" }, { v: "Other", k: "gender_other" },
  ];
  const birth: { v: string; k: "birth_2001"|"birth_1981"|"birth_1965"|"birth_1946"|"birth_1945"|"prefer_not" }[] = [
    { v: "2001 or later", k: "birth_2001" }, { v: "1981 - 2000", k: "birth_1981" },
    { v: "1965 - 1980", k: "birth_1965" }, { v: "1946 - 1964", k: "birth_1946" },
    { v: "1945 or earlier", k: "birth_1945" }, { v: "Prefer not to disclose", k: "prefer_not" },
  ];
  const ethDetails: { v: string; k: "eth_we"|"eth_ee"|"eth_na"|"eth_ssa"|"eth_wa"|"eth_sa"|"eth_ec"|"eth_pac"|"eth_nam"|"eth_cac"|"eth_sam" }[] = [
    { v: "Western Europe", k: "eth_we" }, { v: "Eastern Europe", k: "eth_ee" },
    { v: "North Africa", k: "eth_na" }, { v: "Sub-Saharan Africa", k: "eth_ssa" },
    { v: "West Asia / Middle East", k: "eth_wa" }, { v: "South and Southeast Asia", k: "eth_sa" },
    { v: "East and Central Asia", k: "eth_ec" }, { v: "Pacific / Oceania", k: "eth_pac" },
    { v: "North America", k: "eth_nam" }, { v: "Central America and Caribbean", k: "eth_cac" },
    { v: "South America", k: "eth_sam" },
  ];
  const races: { v: string; k: "race_asian"|"race_pi"|"race_indig"|"race_mena"|"race_black"|"race_hispanic"|"race_white" }[] = [
    { v: "Asian (e.g., Indian, Chinese, Japanese, Korean, Singaporean)", k: "race_asian" },
    { v: "Pacific Islander (e.g., New Zealand Maori, Samoan, Native Hawaiian)", k: "race_pi" },
    { v: "Indigenous (e.g., North American Cherokee, South American Quechua, Aboriginal, or Torres Strait Islander)", k: "race_indig" },
    { v: "Middle Eastern or North African", k: "race_mena" },
    { v: "Black", k: "race_black" }, { v: "Hispanic or Latino/a/x", k: "race_hispanic" },
    { v: "White", k: "race_white" },
  ];
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">{t("acm_title")}</h2>
      <p className="text-sm text-slate-600 mb-6">{t("acm_desc")}</p>
      <div className="space-y-6">
        <Field label={t("uk_eea_q")} required>
          <p className="text-xs text-slate-600 mb-2">
            {t("uk_eea_link")}{" "}
            <a href="https://www.government.nl/topics/european-union/eu-eea-efta-and-schengen-area-countries"
              target="_blank" rel="noopener noreferrer"
              className="text-blue-600 underline break-all">
              government.nl/topics/european-union/eu-eea-efta-and-schengen-area-countries
            </a>
          </p>
          <div className="space-y-2">
            {yn.map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="ukEea" checked={data.ukEea === o.v}
                  onChange={() => update("ukEea", o.v)} className="w-4 h-4 text-blue-600" />
                <span>{t(o.k)}</span>
              </label>
            ))}
          </div>
          {data.ukEea === "Yes" && (
            <div className="ml-6 mt-3 border-l-2 border-blue-200 pl-4 space-y-3">
              <p className="text-sm font-medium fse-required">{t("uk_eea_consent_q")}</p>
              {[
                { v: "consent_full", k: "uk_eea_consent_1" as const },
                { v: "consent_partial", k: "uk_eea_consent_2" as const },
                { v: "consent_none", k: "uk_eea_consent_3" as const },
              ].map(o => (
                <label key={o.v} className="flex items-start gap-2 cursor-pointer">
                  <input type="radio" name="ukEeaConsent" checked={data.ukEeaConsent === o.v}
                    onChange={() => update("ukEeaConsent", o.v)} className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span className="text-sm">{t(o.k)}</span>
                </label>
              ))}
            </div>
          )}
        </Field>

        <Field label={t("gender_id_q")} required>
          <div className="space-y-2">
            {genderId.map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="genderIdentity" checked={data.genderIdentity === o.v}
                  onChange={() => update("genderIdentity", o.v)} className="w-4 h-4 text-blue-600" />
                <span>{t(o.k)}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label={t("birth_q")} required>
          <div className="space-y-2">
            {birth.map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="birthYear" checked={data.birthYear === o.v}
                  onChange={() => update("birthYear", o.v)} className="w-4 h-4 text-blue-600" />
                <span>{t(o.k)}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label={t("ethnic_q")} required>
          <div className="space-y-2 mb-3">
            {[{ v: "Prefer not to disclose", k: "prefer_not" as const }, { v: "Make your selections", k: "make_selections" as const }].map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="ethnicOrigin" checked={data.ethnicOrigin === o.v}
                  onChange={() => update("ethnicOrigin", o.v)} className="w-4 h-4 text-blue-600" />
                <span>{t(o.k)}</span>
              </label>
            ))}
          </div>
          {data.ethnicOrigin === "Make your selections" && (
            <div className="ml-6 space-y-2 border-l-2 border-blue-200 pl-4">
              <p className="text-sm font-medium">{t("select_all")}</p>
              {ethDetails.map(o => (
                <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox"
                    checked={data.ethnicOriginDetails.includes(o.v)}
                    onChange={() => toggle?.("ethnicOriginDetails", o.v)}
                    className="w-4 h-4 text-blue-600" />
                  <span>{t(o.k)}</span>
                </label>
              ))}
            </div>
          )}
        </Field>

        <Field label={t("race_q")} required>
          <div className="space-y-2 mb-3">
            {[{ v: "Prefer not to disclose", k: "prefer_not" as const }, { v: "Make your selections", k: "make_selections" as const }].map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="race" checked={data.race === o.v}
                  onChange={() => update("race", o.v)} className="w-4 h-4 text-blue-600" />
                <span>{t(o.k)}</span>
              </label>
            ))}
          </div>
          {data.race === "Make your selections" && (
            <div className="ml-6 space-y-2 border-l-2 border-blue-200 pl-4">
              <p className="text-sm font-medium">{t("select_all")}</p>
              {races.map(o => (
                <label key={o.v} className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox"
                    checked={data.raceDetails.includes(o.v)}
                    onChange={() => toggle?.("raceDetails", o.v)}
                    className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span className="text-sm">{t(o.k)}</span>
                </label>
              ))}
            </div>
          )}
        </Field>

        <Field label={t("disability_select_q")} required>
          <div className="space-y-2">
            {[{ v: "I do not have a disability or impairment", k: "no_disability" as const }, { v: "Prefer not to disclose", k: "prefer_not" as const }, { v: "Make your selections", k: "make_selections" as const }].map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="acmDisability" checked={data.acmDisability === o.v}
                  onChange={() => update("acmDisability", o.v)} className="w-4 h-4 text-blue-600" />
                <span>{t(o.k)}</span>
              </label>
            ))}
          </div>
          {data.acmDisability === "Make your selections" && (
            <div className="ml-6 mt-3 border-l-2 border-blue-200 pl-4 space-y-2">
              <p className="text-sm font-medium fse-required">{t("select_all")}</p>
              {([
                { v: "Deaf/deaf or have serious difficulty hearing", k: "disab_deaf" },
                { v: "Blind or have serious difficulty seeing, even when wearing glasses", k: "disab_blind" },
                { v: "Mobility limitation including serious difficulty walking or climbing stairs", k: "disab_mobility" },
                { v: "Motor limitation including manual dexterity", k: "disab_motor" },
                { v: "Learning disability", k: "disab_learning" },
                { v: "Neurodiverse", k: "disab_neuro" },
                { v: "Speech or language impairment", k: "disab_speech" },
                { v: "Chronic illness that is neurological, physical, or a mental health diagnosis", k: "disab_chronic" },
                { v: "Temporary impairment", k: "disab_temp" },
                { v: "Other type of disability", k: "disab_other_type" },
              ] as const).map(o => (
                <label key={o.v} className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={data.acmDisabilityDetails.includes(o.v)}
                    onChange={() => toggle?.("acmDisabilityDetails", o.v)}
                    className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span className="text-sm">{t(o.k)}</span>
                </label>
              ))}
            </div>
          )}
        </Field>

        <Field label={t("live_q")} required>
          <select className="fse-input" value={data.currentCountry} onChange={e => update("currentCountry", e.target.value)}>
            <option value="">{t("select_one")}</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );
}

function StepItems({ data, update }: Props) {
  const { t } = useLang();
  const yn: { v: string; k: "yes"|"no" }[] = [{ v: "Yes", k: "yes" }, { v: "No", k: "no" }];
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">{t("items_title")}</h2>
      <p className="text-center text-slate-600 mb-6">{t("items_desc")}</p>
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
              {data.mainItem === item.id && <div className="text-xs text-blue-600 font-medium">{t("selected")}</div>}
            </div>
          </label>
        ))}
      </div>

      <div className="mt-8 space-y-4 pt-6 border-t border-slate-200">
        <Field label={t("banquet_q")}>
          <div className="space-y-2">
            {[{ v: "Yes, I will attend (Included)", k: "banquet_yes" as const }, { v: "No, I choose to opt out", k: "banquet_no" as const }].map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="banquet" checked={data.banquet === o.v}
                  onChange={() => update("banquet", o.v)} className="w-4 h-4 text-blue-600" />
                <span>{t(o.k)}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label={t("mentoring_q")}>
          <div className="space-y-2">
            {yn.map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="mentoring" checked={data.mentoringSymposium === o.v}
                  onChange={() => update("mentoringSymposium", o.v)} className="w-4 h-4 text-blue-600" />
                <span>{t(o.k)}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label={t("paper_q")}>
          <div className="space-y-2">
            {yn.map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="paperAuthor" checked={data.paperAuthor === o.v}
                  onChange={() => update("paperAuthor", o.v)} className="w-4 h-4 text-blue-600" />
                <span>{t(o.k)}</span>
              </label>
            ))}
          </div>
          {data.paperAuthor === "Yes" && (
            <div className="ml-6 mt-3 border-l-2 border-blue-200 pl-4 space-y-4">
              <Field label={t("paper_track_label")} required>
                <p className="text-xs text-slate-600 mb-2 italic">{t("paper_track_help")}</p>
                <input className="fse-input" value={data.fseTrack} onChange={e => update("fseTrack", e.target.value)} />
              </Field>
              <Field label={t("paper_id_label")} required>
                <p className="text-xs text-slate-600 mb-2 italic">{t("paper_id_help")}</p>
                <input className="fse-input" value={data.paperId} onChange={e => update("paperId", e.target.value)} />
              </Field>
            </div>
          )}
        </Field>

        <Field label={t("rerouted_q")}>
          <div className="space-y-2">
            {yn.map(o => (
              <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="rerouted" checked={data.reroutedPresentations === o.v}
                  onChange={() => update("reroutedPresentations", o.v)} className="w-4 h-4 text-blue-600" />
                <span>{t(o.k)}</span>
              </label>
            ))}
          </div>
          {data.reroutedPresentations === "Yes" && (
            <div className="ml-6 mt-3 border-l-2 border-blue-200 pl-4 space-y-4">
              <Field label={t("paper_title_label")} required>
                <input className="fse-input" value={data.paperTitle}
                  onChange={e => update("paperTitle", e.target.value)} />
              </Field>
              <Field label={t("paper_authors_label")} required>
                <input className="fse-input" value={data.paperAuthors}
                  onChange={e => update("paperAuthors", e.target.value)} />
              </Field>
              <Field label={t("paper_url_label")} required>
                <input type="url" className="fse-input" value={data.paperOriginalUrl}
                  onChange={e => update("paperOriginalUrl", e.target.value)}
                  placeholder="https://..." />
              </Field>
            </div>
          )}
        </Field>
      </div>
    </div>
  );
}

function StepAddOns({ data, toggle }: Props) {
  const { t } = useLang();
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">{t("addons_title")}</h2>
      <p className="text-center text-slate-600 mb-6">{t("addons_desc")}</p>
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
              <div className="font-bold text-slate-900">${item.price}.00 {t("each")}</div>
              {item.full && <div className="text-xs text-red-600">{t("full")}</div>}
            </div>
          </label>
        ))}
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-200">
        <Field label={t("one_day_q")}>
          <p className="text-xs text-slate-600 mb-3">{t("one_day_help")}</p>

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-4 text-xs text-blue-900">
            <strong>{t("workshops_section")} — </strong>{t("workshops_date_note")}
          </div>

          <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">{t("workshops_section")}</div>
          <div className="space-y-2 mb-5 max-h-80 overflow-y-auto pr-2">
            {WORKSHOPS.map(w => (
              <div key={w.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition">
                <input type="checkbox" id={`ws-${w.id}`}
                  checked={data.oneDayEvent.includes(w.id)}
                  onChange={() => toggle?.("oneDayEvent", w.id)}
                  className="w-4 h-4 mt-0.5 text-blue-600 cursor-pointer" />
                <label htmlFor={`ws-${w.id}`} className="flex-1 cursor-pointer text-sm min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900">{w.acronym}</span>
                    {w.date && (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        w.date.startsWith("TBA") ? "bg-slate-100 text-slate-600" : "bg-blue-100 text-blue-700"
                      }`}>
                        {w.date}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 leading-snug mt-0.5">{w.name}</div>
                </label>
                {w.url && (
                  <a href={w.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 underline whitespace-nowrap shrink-0 mt-0.5"
                    onClick={(e) => e.stopPropagation()}>
                    {t("visit_website")} ↗
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">{t("other_events_section")}</div>
          <div className="space-y-2">
            {OTHER_ONE_DAY_EVENTS.map(o => (
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

        <Field label={t("co_located_q")}>
          <p className="text-xs text-slate-600 mb-2">{t("co_located_help")}</p>
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
  const { t } = useLang();
  const main = REGISTRATION_ITEMS.find(i => i.id === data.mainItem);
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">{t("review_title")}</h2>
      <div className="space-y-4 text-sm">
        <Section title={t("section_personal")}>
          <Row label={t("name")} value={`${data.firstName} ${data.lastName}`} />
          <Row label={t("email")} value={data.email} />
          <Row label={t("registration_type")} value={data.registrationType} />
        </Section>

        <Section title={t("section_address")}>
          <Row label={t("address1")} value={`${data.address1} ${data.address2}`.trim()} />
          <Row label={t("city")} value={`${data.city}, ${data.state} ${data.zipCode}`} />
          <Row label={t("country")} value={data.country} />
          <Row label={t("region_q")} value={data.region} />
        </Section>

        <Section title={t("section_items")}>
          {main && <Row label={main.label} value={`$${main.price}.00`} />}
          {data.addOns.map(id => {
            const a = ADD_ONS.find(x => x.id === id);
            return a ? <Row key={id} label={a.label} value={`$${a.price}.00`} /> : null;
          })}
        </Section>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="font-semibold text-slate-900">{t("total_amount")}</span>
          <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
        </div>

        <p className="text-xs text-slate-500 text-center mt-4">{t("review_legal")}</p>
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
