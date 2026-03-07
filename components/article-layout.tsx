"use client"

import { Link } from '@/i18n/navigation';
import type { ReactNode } from 'react';

interface ArticleLayoutProps {
  cluster: string;
  clusterHref: string;
  clusterContext: string;
  title: string;
  description: string;
  readingTime: string;
  children: ReactNode;
}

export function ArticleLayout({
  cluster,
  clusterHref,
  clusterContext,
  title,
  description,
  readingTime,
  children,
}: ArticleLayoutProps) {
  return (
    <article className="max-w-2xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase mb-12 font-bold opacity-60">
        <Link href="/blog" className="text-foreground hover:text-primary transition-colors">
          Resources
        </Link>
        <span className="text-foreground/20">·</span>
        <Link
          href={clusterHref}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          {cluster}
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-16">
        <h1 className="font-heading text-5xl sm:text-6xl text-foreground leading-[0.95] mb-6 uppercase tracking-tighter">
          {title}
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed mb-6 font-mono">
          {description}
        </p>
        <div className="flex items-center gap-4">
          <span className="h-px w-8 bg-primary/30" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/25 font-bold">
            {readingTime}
          </span>
        </div>
      </header>

      {/* Body */}
      <div className="prose-custom">
        {children}
      </div>
    </article>
  );
}
