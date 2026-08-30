import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { GalleryView } from "@/components/gallery/GalleryView";
import { FinalCta, Footer } from "@/components/site/Closing";

export const metadata: Metadata = {
  title: "Gallery — life at the clinic",
  description: "Patients, team and quiet moments between appointments. Photography from inside the practice.",
};

export default function GalleryPage() {
  return (
    <>
      <section className="container-x pb-24 pt-32 lg:pt-44">
        <Reveal>
          <p className="label text-stone">GALLERY</p>
          <h1 className="display-1 mt-8">
            LIFE AT
            <br />
            THE <span className="serif-i font-normal normal-case text-forest">clinic.</span>
          </h1>
          <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-stone">
            Patients, team and quiet moments between appointments. Every
            photograph is real — shot inside the practice or generously shared
            by owners.
          </p>
        </Reveal>
        <div className="mt-14">
          <GalleryView />
        </div>
      </section>
      <FinalCta />
      <Footer />
    </>
  );
}
