import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const reg = await prisma.registration.create({
      data: {
        firstName: String(body.firstName ?? "").trim(),
        lastName: String(body.lastName ?? "").trim(),
        email: String(body.email ?? "").trim().toLowerCase(),
        registrationType: String(body.registrationType ?? ""),
        address1: String(body.address1 ?? ""),
        address2: body.address2 || null,
        country: String(body.country ?? ""),
        city: String(body.city ?? ""),
        state: String(body.state ?? ""),
        zipCode: String(body.zipCode ?? ""),
        gender: body.gender || null,
        genderOther: body.genderOther || null,
        region: body.region || null,
        certificateOfAttendance: !!body.certificateOfAttendance,
        vatNumber: body.vatNumber || null,
        studentProofFileName: body.studentProofFileName || null,
        hasDisability: body.hasDisability || null,
        dietaryRestrictions: body.dietaryRestrictions || null,
        cvOptIn: body.cvOptIn || null,
        cvFileName: body.cvFileName || null,
        visaSupportLetter: body.visaSupportLetter || null,
        postalMailOptOut: !!body.postalMailOptOut,
        emailOptOut: body.emailOptOut || null,
        virtualConsent: !!body.virtualConsent,
        ukEea: body.ukEea || null,
        genderIdentity: body.genderIdentity || null,
        birthYear: body.birthYear || null,
        ethnicOrigin: body.ethnicOrigin || null,
        ethnicOriginDetails: body.ethnicOriginDetails || null,
        race: body.race || null,
        raceDetails: body.raceDetails || null,
        acmDisability: body.acmDisability || null,
        currentCountry: body.currentCountry || null,
        mainItem: body.mainItem || null,
        banquet: body.banquet || null,
        mentoringSymposium: body.mentoringSymposium || null,
        paperAuthor: body.paperAuthor || null,
        reroutedPresentations: body.reroutedPresentations || null,
        addOns: body.addOns || null,
        oneDayEvent: body.oneDayEvent || null,
        coLocatedConference: body.coLocatedConference || null,
        totalAmount: Number(body.totalAmount ?? 0),
      },
    });

    return NextResponse.json({ id: reg.id, ok: true });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ ok: false, error: "Failed to register" }, { status: 500 });
  }
}
