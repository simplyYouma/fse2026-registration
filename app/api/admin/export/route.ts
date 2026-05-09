import { prisma } from "@/lib/prisma";

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const rows = await prisma.registration.findMany({ orderBy: { createdAt: "desc" } });

  const headers = [
    "id", "createdAt", "firstName", "lastName", "email", "registrationType",
    "address1", "address2", "country", "city", "state", "zipCode",
    "gender", "genderOther", "region", "certificateOfAttendance", "vatNumber",
    "studentProofFileName", "hasDisability", "dietaryRestrictions",
    "cvOptIn", "cvFileName", "visaSupportLetter", "postalMailOptOut", "emailOptOut", "virtualConsent",
    "ukEea", "genderIdentity", "birthYear", "ethnicOrigin", "ethnicOriginDetails",
    "race", "raceDetails", "acmDisability", "currentCountry",
    "mainItem", "banquet", "mentoringSymposium", "paperAuthor", "reroutedPresentations",
    "addOns", "oneDayEvent", "coLocatedConference", "totalAmount",
  ];

  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map(h => csvEscape((r as Record<string, unknown>)[h])).join(","));
  }
  const csv = "﻿" + lines.join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="fse2026-registrations-${new Date().toISOString().slice(0,10)}.csv"`,
    },
  });
}
