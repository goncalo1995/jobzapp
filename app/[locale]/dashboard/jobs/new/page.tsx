'use client';

import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { JobApplicationForm } from '@/components/job-application-form';

export default function NewJobPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="space-y-3">
        <Link href="/dashboard/jobs" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors group uppercase tracking-widest">
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
          Back to Applications
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-heading font-black text-foreground tracking-tight">New Application</h1>
          <p className="text-muted-foreground text-sm font-medium">Start tracking your next career move.</p>
        </div>
      </header>

      <JobApplicationForm />
    </div>
  );
}
