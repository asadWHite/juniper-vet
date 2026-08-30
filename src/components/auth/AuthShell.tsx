import { PawPrint } from "lucide-react";
import type { ReactNode } from "react";

export function AuthShell({
  image,
  caption,
  kicker,
  title,
  sub,
  children,
}: {
  image: { src: string; alt: string };
  caption: string;
  kicker: string;
  title: ReactNode;
  sub: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-[100svh] grid-cols-12">
      {/* photo panel */}
      <div className="relative hidden lg:col-span-5 lg:block xl:col-span-6">
        <img src={image.src} alt={image.alt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" aria-hidden />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="label !text-[9px] text-cream/70">{caption}</p>
        </div>
      </div>

      {/* form panel */}
      <div className="col-span-12 flex flex-col border-l border-line lg:col-span-7 xl:col-span-6">
        <div className="flex flex-1 flex-col justify-center px-5 py-28 sm:px-14 lg:px-20">
          <div className="animate-step-in">
            <p className="flex items-center gap-2.5 label text-stone">
              <PawPrint size={15} strokeWidth={1.75} className="text-forest" aria-hidden />
              {kicker}
            </p>
            <h1 className="display-3 mt-6">{title}</h1>
            <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-stone">{sub}</p>
            <div className="mt-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
