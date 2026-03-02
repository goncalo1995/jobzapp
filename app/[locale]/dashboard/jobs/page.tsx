// app/[locale]/dashboard/jobs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Briefcase, Plus, Search, Filter, Building2, Calendar, ChevronRight, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  Wishlist: 'bg-muted text-muted-foreground border-border',
  Applied: 'bg-primary/10 text-primary border-primary/20',
  'Pending Review': 'bg-warning/10 text-warning border-warning/20',
  Interviewing: 'bg-accent/10 text-accent border-accent/20',
  Offer: 'bg-success/10 text-success border-success/20',
  Rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  Withdrawn: 'bg-muted text-muted-foreground border-border',
};

export default function JobsTrackingPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('job_applications')
          .select(`*, company:companies(name)`)
          .eq('user_id', user.id)
          .order('last_updated', { ascending: false });

        if (data) setJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [supabase]);

  const filteredJobs = jobs.filter(job => 
    job.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-heading font-bold text-foreground">Applications</h1>
          <p className="text-muted-foreground text-sm">Track your job applications and progress.</p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Application
          </Button>
        </Link>
      </header>

      {/* Search */}
      <div className="flex items-center gap-3 bg-card border border-border p-2 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role or company..." 
            className="pl-10 bg-transparent border-none text-foreground focus-visible:ring-0 placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {/* Job List */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <Link key={job.id} href={`/dashboard/jobs/${job.id}`} className="block">
              <div className="group bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center gap-4">
                <div className="h-12 w-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
                
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {job.position}
                    </h3>
                    <div className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-semibold border",
                      STATUS_COLORS[job.status] || STATUS_COLORS.Applied
                    )}>
                      {job.status}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-xs">
                    <span className="flex items-center gap-1.5">
                       <Building2 className="h-3 w-3" /> {job.company?.name || job.company_name_denormalized || 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1.5">
                       <Calendar className="h-3 w-3" /> {job.applied_date ? new Date(job.applied_date).toLocaleDateString() : 'Not applied'}
                    </span>
                  </div>
                </div>

                {job.match_score != null && (
                  <div className="flex flex-col items-end border-l border-border pl-4">
                    <span className="text-[10px] text-muted-foreground font-medium">Match</span>
                    <span className="text-lg font-heading font-bold text-foreground">{job.match_score}%</span>
                  </div>
                )}

                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-16 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center">
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h2 className="text-lg font-semibold text-foreground">No applications yet</h2>
            <p className="text-sm text-muted-foreground">Add your first job application to start tracking your progress.</p>
          </div>
          <Link href="/dashboard/jobs/new">
            <Button size="lg">Add First Application</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
