"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GALLERY, GALLERY_FILTERS, type GalleryCategory } from "@/data/gallery";

type Filter = "ALL" | GalleryCategory;

export function GalleryView() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [active, setActive] = useState<number | null>(null);

  const items = useMemo(
    () => (filter === "ALL" ? GALLERY : GALLERY.filter((g) => g.category === filter)),
    [filter]
  );

  const close = useCallback(() => setActive(null), []);
  const move = useCallback(
    (dir: 1 | -1) => setActive((a) => (a === null ? null : (a + dir + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [active, close, move]);

  return (
    <>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter gallery">
        {GALLERY_FILTERS.map((f) => (
          <button key={f} type="button" role="tab" aria-selected={filter === f} data-active={filter === f} onClick={() => { setFilter(f); setActive(null); }} className="chip">
            {f}
          </button>
        ))}
      </div>

      <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [column-fill:balance]">
        {items.map((g, i) => (
          <button
            key={g.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Open photo: ${g.alt}`}
            className="img-zoom group relative mb-5 block w-full break-inside-avoid overflow-hidden text-left"
          >
            <img src={g.src} alt={g.alt} loading="lazy" className={`w-full object-cover ${g.tall ? "aspect-[4/5]" : "aspect-[4/3]"}`} />
            <span className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-ink/55 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-400 group-hover:opacity-100" aria-hidden>
              <span className="label !text-[8.5px] text-cream">{g.category}</span>
              <span className="label !text-[8.5px] text-cream/70">{String(i + 1).padStart(2, "0")}</span>
            </span>
          </button>
        ))}
      </div>

      {/* lightbox */}
      {active !== null && items[active] && (
        <div
          className="fixed inset-0 z-[80] flex flex-col bg-ink/95 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={close}
        >
          <div className="flex items-center justify-between gap-4" onClick={(e) => e.stopPropagation()}>
            <p className="label !text-[9px] text-cream/70 tabular">
              {items[active].category} — {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>
            <button type="button" onClick={close} aria-label="Close viewer" className="flex h-12 w-12 items-center justify-center border border-cream/30 text-cream transition-colors hover:bg-cream hover:text-ink">
              <X size={17} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img
              key={items[active].src}
              src={items[active].src.replace("w=1100", "w=1800")}
              alt={items[active].alt}
              className="animate-fade-in max-h-full max-w-full object-contain"
            />
          </div>
          <div className="flex items-center justify-between gap-4" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => move(-1)} aria-label="Previous photo" className="flex h-12 w-12 items-center justify-center border border-cream/30 text-cream transition-colors hover:bg-cream hover:text-ink">
              <ChevronLeft size={17} strokeWidth={1.75} aria-hidden />
            </button>
            <p className="label max-w-md text-center !text-[8.5px] leading-relaxed text-cream/60">{items[active].alt}</p>
            <button type="button" onClick={() => move(1)} aria-label="Next photo" className="flex h-12 w-12 items-center justify-center border border-cream/30 text-cream transition-colors hover:bg-cream hover:text-ink">
              <ChevronRight size={17} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
