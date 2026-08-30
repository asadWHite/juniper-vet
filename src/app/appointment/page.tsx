import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { pets } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { speciesPhoto } from "@/data/images";
import { BookingFlow } from "@/components/booking/BookingFlow";
import type { PetVm } from "@/types";

export const metadata: Metadata = {
  title: "Book a visit — tell us about your companion",
  description:
    "Answer a few adaptive questions about your companion and we will guide you to the right care, doctor and time — no diagnosis, honest guidance only.",
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AppointmentPage({ searchParams }: Props) {
  const sp = await searchParams;
  const one = (k: string) => {
    const v = sp[k];
    return typeof v === "string" ? v : undefined;
  };

  const user = await getSessionUser();
  let myPets: PetVm[] = [];
  if (user) {
    try {
      const rows = await db.select().from(pets).where(eq(pets.userId, user.id));
      myPets = rows.map((p) => ({
        id: p.id,
        name: p.name,
        species: p.species,
        breed: p.breed,
        sex: p.sex,
        ageLabel: p.ageLabel,
        weightKg: p.weightKg,
        notes: p.notes,
        photoUrl: p.photoUrl ?? speciesPhoto(p.species),
      }));
    } catch {
      myPets = [];
    }
  }

  return (
    <BookingFlow
      user={user}
      pets={myPets}
      initial={{
        species: ["dog", "cat", "rabbit", "bird", "other"].includes(one("species") ?? "")
          ? one("species")
          : undefined,
        service: one("service"),
        doctor: one("doctor"),
      }}
    />
  );
}
