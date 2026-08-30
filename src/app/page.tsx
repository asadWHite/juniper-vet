import { HeroHome } from "@/components/home/HeroHome";
import { IntroManifesto, CarePillars, AnimalCategories } from "@/components/home/SectionsA";
import { ServicesExplorer } from "@/components/home/ServicesExplorer";
import { DoctorsShowcase, HowItWorks, BookingTeaser } from "@/components/home/Middle";
import { GalleryStrip, ReviewsHome, JournalHome } from "@/components/home/Ending";
import { EmergencyBand, FinalCta, Footer } from "@/components/site/Closing";
import { SectionHeading } from "@/components/ui/bits";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HeroHome />
      <IntroManifesto />
      <CarePillars />
      <AnimalCategories />
      <section className="border-y border-line bg-paper" aria-label="Services">
        <div className="container-x py-24 lg:py-32">
          <SectionHeading index="04" label="SERVICES" right="SELECT A SERVICE TO EXPLORE IT" />
          <ServicesExplorer />
        </div>
      </section>
      <DoctorsShowcase />
      <HowItWorks />
      <BookingTeaser />
      <GalleryStrip />
      <ReviewsHome />
      <JournalHome />
      <EmergencyBand />
      <FinalCta />
      <Footer />
    </>
  );
}
