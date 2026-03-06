'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { JobApplicationForm } from '@/components/job-application-form';
import { toast } from 'sonner';

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchJob() {
      try {
        const { data, error } = await supabase
          .from('job_applications')
          .select('*, company:companies(*)')
          .eq('id', id)
          .single();

        if (error || !data) {
          toast.error('Failed to load application');
          router.push('/dashboard/jobs');
          return;
        }

        setJob(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [id, supabase, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="space-y-3">
        <Link href={`/dashboard/jobs/${id}`} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors group uppercase tracking-widest">
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
          Back to Details
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-heading font-black text-foreground tracking-tight">Edit Application</h1>
          <p className="text-muted-foreground text-sm font-medium">Update the details for your {job.position} application.</p>
        </div>
      </header>

      <JobApplicationForm initialData={job} editMode={true} />
    </div>
  );
}
