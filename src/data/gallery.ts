import { IMG } from "@/data/images";

export type GalleryCategory = "PETS" | "TEAM" | "CLINIC" | "CARE" | "ENVIRONMENT";

export interface GalleryItem {
  src: string;
  alt: string;
  category: GalleryCategory;
  tall?: boolean;
}

export const GALLERY: GalleryItem[] = [
  { src: IMG.galleryWall.src, alt: IMG.galleryWall.alt, category: "PETS", tall: true },
  { src: IMG.careExam.src, alt: IMG.careExam.alt, category: "CARE" },
  { src: IMG.chihuahua.src, alt: IMG.chihuahua.alt, category: "PETS", tall: true },
  { src: IMG.catSmall.src, alt: IMG.catSmall.alt, category: "PETS" },
  { src: IMG.docJonas.src, alt: IMG.docJonas.alt, category: "TEAM", tall: true },
  { src: IMG.budgies.src, alt: IMG.budgies.alt, category: "PETS" },
  { src: IMG.careListen.src, alt: IMG.careListen.alt, category: "CARE" },
  { src: IMG.gingerCat.src, alt: IMG.gingerCat.alt, category: "PETS", tall: true },
  { src: IMG.streetPair.src, alt: IMG.streetPair.alt, category: "ENVIRONMENT", tall: true },
  { src: IMG.huskyPup.src, alt: IMG.huskyPup.alt, category: "PETS" },
  { src: IMG.svcDental.src, alt: IMG.svcDental.alt, category: "CLINIC", tall: true },
  { src: IMG.rabbitRed.src, alt: IMG.rabbitRed.alt, category: "PETS", tall: true },
  { src: IMG.corgi.src, alt: IMG.corgi.alt, category: "PETS" },
  { src: IMG.svcVaccination.src, alt: IMG.svcVaccination.alt, category: "CARE" },
  { src: IMG.tabby.src, alt: IMG.tabby.alt, category: "PETS" },
  { src: IMG.bulldog.src, alt: IMG.bulldog.alt, category: "PETS" },
  { src: IMG.svcDiagnostics.src, alt: IMG.svcDiagnostics.alt, category: "CLINIC" },
  { src: IMG.kittensTwo.src, alt: IMG.kittensTwo.alt, category: "PETS" },
  { src: IMG.blackLab.src, alt: IMG.blackLab.alt, category: "PETS", tall: true },
  { src: IMG.aboutSpace.src, alt: IMG.aboutSpace.alt, category: "CLINIC" },
  { src: IMG.bunnyHands.src, alt: IMG.bunnyHands.alt, category: "CARE", tall: true },
  { src: IMG.emergency.src, alt: IMG.emergency.alt, category: "ENVIRONMENT" },
];

export const GALLERY_FILTERS: ("ALL" | GalleryCategory)[] = [
  "ALL",
  "PETS",
  "TEAM",
  "CLINIC",
  "CARE",
  "ENVIRONMENT",
];
