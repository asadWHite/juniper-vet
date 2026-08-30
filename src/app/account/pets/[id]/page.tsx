import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { appointments, doctors, medicalRecords, pets, services, vaccinations } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";
import { ageLabelFromDates, humanShort } from "@/lib/dates";
import { petDefaultPhoto } from "@/data/images";
import { ArrowRight, FileText, Syringe } from "lucide-react";

export const metadata: Metadata = { title: "Pet profile" };
export const dynamic = "force-dynamic";

export default async function PetProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  // The layout also guards this, but layouts and pages render in
  // parallel — the page must not assume a session exists.
  if (!user) redirect("/login?next=/account/pets");
  const { id } = await params;
  await ensureSeed();

  const pet = await db
    .select()
    .from(pets)
    .where(and(eq(pets.id, id), eq(pets.userId, user.id)))
    .limit(1)
    .then((r) => r[0])
    .catch(() => undefined);
  if (!pet) notFound();

  const [recs, vacs, appts] = await Promise.all([
    db.select().from(medicalRecords).where(eq(medicalRecords.petId, pet.id)).orderBy(desc(medicalRecords.recordedOn)).catch(() => []),
    db.select().from(vaccinations).where(eq(vaccinations.petId, pet.id)).catch(() => []),
    db
      .select({
        id: appointments.id,
        date: appointments.date,
        startTime: appointments.startTime,
        status: appointments.status,
        serviceName: services.name,
        doctorName: doctors.name,
      })
      .from(appointments)
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .innerJoin(doctors, eq(appointments.doctorId, doctors.id))
      .where(and(eq(appointments.petId, pet.id), eq(appointments.userId, user.id)))
      .orderBy(desc(appointments.date))
      .catch(() => []),
  ]);

  const age = ageLabelFromDates(pet.birthDate) ?? pet.ageLabel;

  return (
    <div>
      {/* header */}
      <div className="grid grid-cols-12 gap-0 border border-line">
        <img
          src={pet.photoUrl ?? petDefaultPhoto(pet.species)}
          alt={pet.name}
          className="col-span-12 aspect-[16/9] w-full object-cover sm:col-span-5 sm:aspect-auto sm:h-full"
        />
        <div className="col-span-12 flex flex-col justify-center bg-paper p-7 sm:col-span-7 sm:p-10">
          <p className="label !text-[9px] text-stone">PET PROFILE</p>
          <h1 className="mt-3 text-[clamp(2.2rem,5vw,4rem)] font-extrabold uppercase leading-none tracking-tight">
            {pet.name}
          </h1>
          <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.14em] text-stone">
            {pet.species.toUpperCase()}
            {pet.breed ? ` · ${pet.breed}` : ""}
            {pet.sex ? ` · ${pet.sex}` : ""}
            {age ? ` · ${age}` : ""}
            {pet.weightKg ? ` · ${pet.weightKg} KG` : ""}
          </p>
          {pet.notes && <p className="mt-5 max-w-md border-l-2 border-sage pl-4 text-[13.5px] leading-relaxed text-stone">{pet.notes}</p>}
          <Link href={`/appointment?species=${pet.species}`} className="btn btn-dark mt-7 self-start">
            BOOK FOR {pet.name} <ArrowRight size={13} strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {/* vaccinations */}
        <section aria-label="Vaccinations">
          <p className="label mb-4 flex items-center gap-2.5 text-stone">
            <Syringe size={14} strokeWidth={1.75} aria-hidden /> VACCINATIONS
          </p>
          {vacs.length === 0 ? (
            <p className="border border-dashed border-line px-6 py-8 text-[13px] font-semibold text-stone">
              No vaccine records yet — they appear after the first visit.
            </p>
          ) : (
            <ul className="border-t border-line">
              {vacs.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-4 border-b border-line py-4">
                  <div>
                    <p className="text-[13.5px] font-extrabold uppercase tracking-wide">{v.name}</p>
                    <p className="label mt-1 !text-[8px] text-stone">
                      {v.administeredOn ? `GIVEN ${humanShort(v.administeredOn)}` : "NOT GIVEN YET"}
                      {v.dueOn ? ` · DUE ${humanShort(v.dueOn)}` : ""}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1.5 text-[8.5px] font-bold tracking-[0.16em] ${
                      v.status === "done" ? "bg-sage text-forest" : v.status === "overdue" ? "bg-alert text-cream" : "border border-line text-stone"
                    }`}
                  >
                    {v.status.toUpperCase()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* appointments */}
        <section aria-label="Appointments">
          <p className="label mb-4 text-stone">VISITS</p>
          {appts.length === 0 ? (
            <p className="border border-dashed border-line px-6 py-8 text-[13px] font-semibold text-stone">
              No visits yet for {pet.name}.
            </p>
          ) : (
            <ul className="border-t border-line">
              {appts.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-4 border-b border-line py-4">
                  <div>
                    <p className="text-[13.5px] font-extrabold uppercase tracking-wide">{a.serviceName}</p>
                    <p className="label mt-1 !text-[8px] text-stone">{humanShort(a.date)} · {a.startTime} · {a.doctorName}</p>
                  </div>
                  <span className={`label !text-[8.5px] ${a.status === "booked" ? "text-forest" : "text-stone"}`}>
                    {a.status.toUpperCase()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* medical history */}
      <section aria-label="Medical history" className="mt-12">
        <p className="label mb-4 flex items-center gap-2.5 text-stone">
          <FileText size={14} strokeWidth={1.75} aria-hidden /> MEDICAL HISTORY
        </p>
        {recs.length === 0 ? (
          <p className="border border-dashed border-line px-6 py-8 text-[13px] font-semibold text-stone">
            Examination notes will appear here after visits.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {recs.map((r) => (
              <article key={r.id} className="border border-line bg-paper p-6">
                <p className="label !text-[8px] text-stone">{humanShort(r.recordedOn)}</p>
                <h3 className="mt-2 text-[15px] font-extrabold uppercase tracking-tight">{r.title}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-stone">{r.summary}</p>
              </article>
            ))}
          </div>
        )}
        <p className="label mt-6 !text-[8px] text-stone">DOCUMENTS & PHOTOS ARCHITECTURE READY — FILES ARE UPLOADED BY THE CLINIC.</p>
      </section>
    </div>
  );
}
