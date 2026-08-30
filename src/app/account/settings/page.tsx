import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { SettingsForms } from "@/components/account/clients";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getSessionUser();
  // The layout also guards this, but layouts and pages render in
  // parallel — the page must not assume a session exists.
  if (!user) redirect("/login?next=/account/settings");

  return (
    <div>
      <p className="label text-stone">SETTINGS</p>
      <h1 className="display-3 mt-4">
        THE <span className="serif-i font-normal normal-case text-forest">boring</span> BITS.
      </h1>
      <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-stone">
        Name, phone, password. Changing your password signs out every other
        session automatically.
      </p>
      <div className="mt-12 border-t border-line pt-12">
        <SettingsForms user={user} />
      </div>
    </div>
  );
}
