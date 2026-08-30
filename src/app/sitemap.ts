import type { MetadataRoute } from "next";
import { ARTICLES } from "@/data/articles";
import { DOCTORS } from "@/data/doctors";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://juniper-vet.example";
  const staticRoutes = ["", "/about", "/doctors", "/journal", "/gallery", "/emergency", "/appointment", "/login", "/register"].map(
    (p) => ({ url: `${base}${p}`, lastModified: new Date() })
  );
  const doctorRoutes = DOCTORS.map((d) => ({ url: `${base}/doctors/${d.id}`, lastModified: new Date() }));
  const articleRoutes = ARTICLES.map((a) => ({ url: `${base}/journal/${a.slug}`, lastModified: new Date() }));
  return [...staticRoutes, ...doctorRoutes, ...articleRoutes];
}
