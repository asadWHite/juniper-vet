import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IMG } from "@/data/images";

export default function NotFound() {
  return (
    <div className="grid min-h-[100svh] grid-cols-12 items-center">
      <div className="container-x col-span-12 grid grid-cols-12 items-center gap-x-6 py-32">
        <div className="col-span-12 lg:col-span-7">
          <p className="label text-stone">ERROR 404</p>
          <h1 className="display-1 mt-6">
            THIS PAGE
            <br />
            <span className="serif-i font-normal normal-case text-forest">wandered</span> OFF.
          </h1>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-stone">
            Like a cat at carrier time, the page you wanted has made itself
            unavailable. The booking, the doctors and the journal are all still
            where you left them.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/" className="btn btn-dark">
              BACK HOME <ArrowRight size={13} strokeWidth={2} aria-hidden />
            </Link>
            <Link href="/appointment" className="btn btn-ghost">
              BOOK A VISIT
            </Link>
          </div>
        </div>
        <div className="col-span-12 mt-12 lg:col-span-4 lg:col-start-9 lg:mt-0">
          <img src={IMG.streetPair.src} alt={IMG.streetPair.alt} className="aspect-[4/5] w-full object-cover" />
          <p className="label mt-3 !text-[8.5px] text-stone">TWO LOCALS WHO ALSO IGNORE DIRECTIONS</p>
        </div>
      </div>
    </div>
  );
}
