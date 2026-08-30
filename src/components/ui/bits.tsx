import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { ReactNode } from "react";

export function ArrowLink({
  href,
  children,
  light = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`link-arrow ${light ? "text-cream hover:text-sage" : "text-ink"} ${className}`}
    >
      <span>{children}</span>
      <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
    </Link>
  );
}

export function SectionHeading({
  index,
  label,
  right,
  tone = "ink",
}: {
  index: string;
  label: string;
  right?: ReactNode;
  tone?: "ink" | "cream";
}) {
  const line = tone === "cream" ? "border-cream/25" : "border-line";
  const text = tone === "cream" ? "text-cream" : "text-ink";
  const sub = tone === "cream" ? "text-cream/60" : "text-stone";
  return (
    <Reveal className={`border-b ${line} pb-5`}>
      <div className="flex items-end justify-between gap-6">
        <div className="flex items-baseline gap-5">
          <span className={`label ${sub}`}>{index}</span>
          <h2 className={`label ${text} !text-[13px]`}>{label}</h2>
        </div>
        <div className={`label ${sub} hidden sm:block text-right`}>{right}</div>
      </div>
    </Reveal>
  );
}

export function Stars({ rating, size = 13, className = "" }: { rating: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          className={i <= rating ? "fill-ink text-ink" : "text-line"}
          aria-hidden
        />
      ))}
    </span>
  );
}
