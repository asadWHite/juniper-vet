import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/instrument-serif";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { SiteNav } from "@/components/site/SiteNav";
import { getSessionUser } from "@/lib/auth";
import { clinic } from "@/data/clinic";
import { IMG } from "@/data/images";

export const metadata: Metadata = {
  metadataBase: new URL("https://juniper-vet.example"),
  title: {
    default: `${clinic.name} — ${clinic.tagline}`,
    template: `%s — ${clinic.brand}${clinic.suffix}`,
  },
  description:
    "A calm, modern veterinary practice for dogs, cats and small companions. Tell us about your companion — we help you find the right care, the right doctor and the right time.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: clinic.name,
    title: `${clinic.name} — ${clinic.tagline}`,
    description:
      "Understand the animal before booking the appointment. Smart triage, transparent recommendations, real availability.",
    images: [{ url: IMG.hero.src, width: 1800, height: 1200, alt: IMG.hero.alt }],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VeterinaryClinic",
  name: clinic.name,
  // PLACEHOLDER — replace with verified clinic data
  telephone: clinic.phoneDisplay,
  address: {
    "@type": "PostalAddress",
    streetAddress: clinic.address.line1,
    addressLocality: "Portland",
    addressRegion: "OR",
    postalCode: "97205",
    addressCountry: "US",
  },
  openingHours: ["Mo-Fr 09:00-18:00", "Sa 10:00-15:00"],
  image: IMG.hero.src,
  priceRange: "$$",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteNav loggedIn={!!user} />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
