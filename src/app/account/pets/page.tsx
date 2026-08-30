import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";
import { petsForUser } from "@/lib/account-data";
import { PetsManager } from "@/components/account/clients";

export const metadata: Metadata = { title: "My pets" };
export const dynamic = "force-dynamic";

export default async function PetsPage() {
  const user = (await getSessionUser())!;
  await ensureSeed();
  const pets = await petsForUser(user.id).catch(() => []);

  return (
    <div>
      <p className="label text-stone">MY PETS</p>
      <h1 className="display-3 mt-4">
        THE <span className="serif-i font-normal normal-case text-forest">whole</span> FAMILY.
      </h1>
      <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-stone">
        Every companion gets their own profile — history, vaccinations and
        documents in one place. Add as many as live at your address.
      </p>
      <div className="mt-12">
        <PetsManager initial={pets} />
      </div>
    </div>
  );
}
