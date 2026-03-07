"use client"

import Link from 'next/link';
import type { ReactNode } from 'react';

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-heading text-3xl text-foreground mt-14 mb-4 pb-2 border-b border-border">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">{children}</h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-foreground/65 leading-relaxed">{children}</p>;
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="text-foreground font-semibold">{children}</strong>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="space-y-4 my-6">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 text-foreground/65">
      <span className="text-primary flex-shrink-0 mt-0.5">→</span>
      <span>{children}</span>
    </li>
  );
}

export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-2 border-primary pl-5 py-2 my-8 italic text-muted-foreground bg-muted/50">
      {children}
    </blockquote>
  );
}

export function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors">
      {children}
    </Link>
  );
}

export function Divider() {
  return <hr className="border-border my-10" />;
}

export function Callout({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="bg-muted/50 border-l-2 border-primary px-6 py-5 my-8">
      {label && (
        <p className="text-xs tracking-[0.2em] uppercase text-primary mb-3 font-bold">{label}</p>
      )}
      <div className="text-foreground/70 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function Steps({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ol className="space-y-8 my-10">
      {items.map((item, i) => (
        <li key={i} className="flex gap-6">
          <span className="font-heading text-4xl text-primary/20 leading-none flex-shrink-0 w-10">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <p className="text-foreground font-bold mb-2 tracking-wide uppercase text-sm">{item.title}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
