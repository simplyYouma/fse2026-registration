import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PrintButton } from "@/components/print-button";
import { DeleteButton } from "@/components/delete-button";

export const dynamic = "force-dynamic";

export default async function RegistrationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await prisma.registration.findUnique({ where: { id } });
  if (!r) notFound();

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-10 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link href="/admin" className="text-sm text-slate-600 hover:text-slate-900">
            ← Back to dashboard
          </Link>
          <div className="flex items-center gap-2">
            <PrintButton />
            <DeleteButton id={r.id} name={`${r.firstName} ${r.lastName}`} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 print:shadow-none print:border-0 print:rounded-none print:p-0">
          <div className="border-b border-slate-200 pb-6 mb-6">
            <div className="text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold mb-2">
              FSE 2026 — Registration
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {r.firstName} {r.lastName}
            </h1>
            <div className="text-slate-600 text-sm mt-1">{r.email}</div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-500">
              <span>ID: <span className="font-mono">{r.id}</span></span>
              <span>Submitted: {r.createdAt.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <Section title="Personal">
              <Row label="First name" value={r.firstName} />
              <Row label="Last name" value={r.lastName} />
              <Row label="Email" value={r.email} />
              <Row label="Registration type" value={r.registrationType} />
            </Section>

            <Section title="Address">
              <Row label="Address 1" value={r.address1} />
              <Row label="Address 2" value={r.address2} />
              <Row label="City" value={r.city} />
              <Row label="State / Province" value={r.state} />
              <Row label="ZIP / Postal code" value={r.zipCode} />
              <Row label="Country" value={r.country} />
              <Row label="Region" value={r.region} />
            </Section>

            <Section title="Demographics">
              <Row label="Gender" value={r.gender ? `${r.gender}${r.genderOther ? ` (${r.genderOther})` : ""}` : null} />
              <Row label="Gender identity (ACM)" value={r.genderIdentity} />
              <Row label="Birth year range" value={r.birthYear} />
              <Row label="UK / EEA" value={r.ukEea} />
              <Row label="UK/EEA consent" value={r.ukEeaConsent} />
              <Row label="Ethnic origin" value={r.ethnicOrigin} />
              <Row label="Ethnic origin details" value={r.ethnicOriginDetails} />
              <Row label="Race" value={r.race} />
              <Row label="Race details" value={r.raceDetails} />
              <Row label="Currently lives in" value={r.currentCountry} />
            </Section>

            <Section title="Accessibility">
              <Row label="Disability (general)" value={r.hasDisability} />
              <Row label="Disability — specify" value={r.disabilitySpecify} />
              <Row label="Disability detail" value={r.disabilityDetail} />
              <Row label="ACM disability" value={r.acmDisability} />
              <Row label="ACM disability types" value={r.acmDisabilityDetails} />
              <Row label="Dietary restrictions" value={r.dietaryRestrictions} />
            </Section>

            <Section title="Certificate / VAT">
              <Row label="Certificate of attendance" value={r.certificateOfAttendance ? "Yes" : "No"} />
              <Row label="VAT required" value={r.vatRequired ? "Yes" : "No"} />
              <Row label="VAT number" value={r.vatNumber} />
            </Section>

            <Section title="Communications">
              <Row label="CV opt-in" value={r.cvOptIn} />
              <Row label="CV file" value={r.cvFileName} />
              <Row label="Visa support letter" value={r.visaSupportLetter} />
              <Row label="Postal mail opt-out" value={r.postalMailOptOut ? "Yes" : "No"} />
              <Row label="Email opt-out" value={r.emailOptOut} />
              <Row label="Virtual conference consent" value={r.virtualConsent ? "Yes" : "No"} />
            </Section>

            <Section title="Conference items" full>
              <Row label="Main item" value={r.mainItem} />
              <Row label="Banquet" value={r.banquet} />
              <Row label="Mentoring symposium" value={r.mentoringSymposium} />
              <Row label="Paper author" value={r.paperAuthor} />
              <Row label="FSE track" value={r.fseTrack} />
              <Row label="Paper ID" value={r.paperId} />
              <Row label="Re-routed presentation" value={r.reroutedPresentations} />
              <Row label="Paper title" value={r.paperTitle} />
              <Row label="Paper authors" value={r.paperAuthors} />
              <Row label="Paper original URL" value={r.paperOriginalUrl} />
              <Row label="Add-ons" value={r.addOns} />
              <Row label="One-day events" value={r.oneDayEvent} />
              <Row label="Co-located conferences" value={r.coLocatedConference} />
            </Section>

            <Section title="Files" full>
              <Row label="Student proof" value={r.studentProofFileName} />
            </Section>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            <span className="text-lg font-semibold text-slate-900">Total amount</span>
            <span className="text-3xl font-bold text-blue-600">${r.totalAmount.toFixed(2)}</span>
          </div>

          <div className="hidden print:block mt-12 pt-6 border-t border-slate-200 text-xs text-slate-500 text-center">
            Generated from FSE 2026 admin dashboard · {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`${full ? "sm:col-span-2" : ""} print:break-inside-avoid`}>
      <h2 className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-3 pb-2 border-b border-slate-100">
        {title}
      </h2>
      <dl className="space-y-2">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  const display = value && String(value).trim() !== "" ? value : "—";
  return (
    <div className="flex flex-col sm:flex-row sm:gap-3">
      <dt className="text-xs text-slate-500 sm:w-44 sm:flex-shrink-0">{label}</dt>
      <dd className={`text-sm break-words ${display === "—" ? "text-slate-400" : "text-slate-900 font-medium"}`}>
        {display}
      </dd>
    </div>
  );
}
