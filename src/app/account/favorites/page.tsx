import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";
import { favoriteDoctorsForUser } from "@/lib/account-data";
import { FavoriteButton } from "@/components/account/clients";

export const metadata: Metadata = { title: "Saved doctors" };
export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await getSessionUser();
  // The layout also guards this, but layouts and pages render in
  // parallel — the page must not assume a session exists.
  if (!user) redirect("/login?next=/account/favorites");
  await ensureSeed();
  const favs = await favoriteDoctorsForUser(user.id).catch(() => []);

  return (
    <div>
      <p className="label text-stone">SAVED DOCTORS</p>
      <h1 className="display-3 mt-4">
        YOUR <span className="serif-i font-normal normal-case text-forest">trusted</span> HANDS.
      </h1>
      <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-stone">
        Animals remember who was gentle with them. So do we. Saved doctors are
        suggested first whenever you book.
      </p>

      {favs.length === 0 ? (
        <div className="mt-12 flex flex-col items-start gap-6 border border-dashed border-line px-8 py-14">
          <p className="text-[14.5px] text-stone">Nothing saved yet — meet the team and tap the heart.</p>
          <Link href="/doctors" className="btn btn-dark">
            MEET THE TEAM <ArrowRight size={13} strokeWidth={2} aria-hidden />
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-12 gap-5">
          {favs.map((f) => (
            <article key={f.doctorId} className="group col-span-12 sm:col-span-6 xl:col-span-4">
              <Link href={`/doctors/${f.doctorId}`} className="img-zoom block overflow-hidden" aria-label={f.name}>
                <img src={f.photoUrl} alt={f.name} loading="lazy" className="aspect-[4/4.4] w-full object-cover" />
              </Link>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-extrabold uppercase tracking-tight">{f.name}</p>
                  <p className="label mt-1.5 !text-[8.5px] text-stone">{f.specialty}</p>
                  <Link href={`/appointment?doctor=${f.doctorId}`} className="link-arrow mt-3 !text-[9px]">
                    BOOK <ArrowRight size={11} strokeWidth={2} aria-hidden />
                  </Link>
                </div>
                <FavoriteButton doctorId={f.doctorId} initial loggedIn />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
