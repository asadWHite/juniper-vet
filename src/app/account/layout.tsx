import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AccountNav } from "@/components/account/AccountNav";
import { IMG } from "@/data/images";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account");

  return (
    <div className="container-x grid min-h-[100svh] grid-cols-12 gap-x-6 pb-24 pt-28 lg:pt-36">
      {/* side */}
      <aside className="col-span-12 lg:col-span-3">
        <div className="lg:sticky lg:top-28">
          <div className="relative overflow-hidden border border-line">
            <img src={IMG.accountHero.src} alt={IMG.accountHero.alt} className="aspect-[16/8] w-full object-cover lg:aspect-[4/3]" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" aria-hidden />
            <div className="absolute bottom-4 left-4">
              <p className="label !text-[8.5px] text-cream/70">YOUR SPACE</p>
              <p className="mt-1.5 text-[17px] font-extrabold uppercase tracking-tight text-cream">
                {user.fullName}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <AccountNav />
          </div>
        </div>
      </aside>

      <div className="col-span-12 mt-10 lg:col-span-9 lg:mt-0 lg:pl-6">{children}</div>
    </div>
  );
}
