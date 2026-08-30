"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  variant?: "up" | "clip";
  delay?: number; // ms
  as?: "div" | "section" | "span" | "figure" | "header";
  style?: CSSProperties;
  id?: string;
}

export function Reveal({ children, className = "", variant = "up", delay = 0, as = "div", style, id }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as "div";
  return (
    <Tag
      ref={ref as never}
      id={id}
      className={`${variant === "clip" ? "reveal-clip" : "reveal"} ${className}`}
      style={{ ...style, transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  );
}
