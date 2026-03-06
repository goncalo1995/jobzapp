'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Building2, Save, ArrowLeft, Link as LinkIcon, 
  Briefcase, Globe, CheckCircle2, Zap, FileText 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';
import { STATUS_OPTIONS } from './stage-transition-modal';

interface JobApplicationFormProps {
  initialData?: any;
  editMode?: boolean;
}

export function JobApplicationForm({ initialData, editMode = false }: JobApplicationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cvs, setCvs] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    position: initialData?.position || '',
    company_name: initialData?.company?.name || initialData?.company_name_denormalized || '',
    company_website: initialData?.company?.website || '',
    job_url: initialData?.job_url || '',
    description: initialData?.job_description || '',
    notes: initialData?.notes || '',
    status: initialData?.status || 'Applied',
    cv_id: initialData?.cv_id || '',
    location: initialData?.location || '',
  });

  const supabase = createClient();

  useEffect(() => {
    async function fetchCvs() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('cvs')
        .select('id, name, target_role')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (data) setCvs(data);
    }
    fetchCvs();
  }, [supabase]);

  async function handleSubmit() {
    if (!formData.position || !formData.company_name) {
      toast.error('Job title and Company name are required');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 1. Handle Company (Upsert)
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .upsert({
          name: formData.company_name,
          website: formData.company_website || null,
          created_by: user.id,
        }, { onConflict: 'name, created_by' })
        .select()
        .single();

      if (companyError) throw companyError;

      // 2. Handle Job Application
      const jobData = {
        user_id: user.id,
        company_id: company.id,
        company_name_denormalized: formData.company_name,
        position: formData.position,
        job_url: formData.job_url || null,
        job_description: formData.description || null,
        notes: formData.notes || null,
        status: formData.status as any,
        cv_id: formData.cv_id || null,
        location: formData.location || null,
        last_updated: new Date().toISOString(),
      };

      if (editMode && initialData?.id) {
        const { error: jobError } = await supabase
          .from('job_applications')
          .update(jobData)
          .eq('id', initialData.id);
        if (jobError) throw jobError;
        toast.success('Application updated!');
        router.push(`/dashboard/jobs/${initialData.id}`);
      } else {
        const { error: jobError } = await supabase
          .from('job_applications')
          .insert({
            ...jobData,
            applied_date: formData.status === 'Applied' ? new Date().toISOString() : null,
          });
        if (jobError) throw jobError;
        toast.success('Application added!');
        router.push('/dashboard/jobs');
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save application');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground uppercase tracking-wider text-[10px]">Job Title <span className="text-destructive">*</span></label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="e.g. Senior Frontend Developer"
                  className="pl-10 h-11 bg-secondary/20 border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground uppercase tracking-wider text-[10px]">Company <span className="text-destructive">*</span></label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="e.g. Google"
                  className="pl-10 h-11 bg-secondary/20 border-border"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground uppercase tracking-wider text-[10px]">Company Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={formData.company_website}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_website: e.target.value }))}
                  placeholder="e.g. google.com"
                  className="pl-10 h-11 bg-secondary/20 border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground uppercase tracking-wider text-[10px]">Job URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={formData.job_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, job_url: e.target.value }))}
                  placeholder="e.g. linkedin.com/jobs/..."
                  className="pl-10 h-11 bg-secondary/20 border-border"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground uppercase tracking-wider text-[10px]">Status</label>
              <Select 
                value={formData.status} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
              >
                <SelectTrigger className="h-11 bg-secondary/20 border-border">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground uppercase tracking-wider text-[10px]">Location</label>
              <Input 
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. London, Remote"
                className="h-11 bg-secondary/20 border-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground uppercase tracking-wider text-[10px]">Attached CV</label>
              <Select 
                value={formData.cv_id} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, cv_id: val }))}
              >
                <SelectTrigger className="relative pl-10 h-11 bg-secondary/20 border-border">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select a CV" />
                </SelectTrigger>
                <SelectContent>
                  {cvs.length === 0 ? (
                    <div className="p-2 text-xs text-muted-foreground text-center">
                      No CVs found. <Link href="/dashboard/cvs/new" className="text-primary hover:underline">Create one</Link>
                    </div>
                  ) : (
                    cvs.map((cv) => (
                      <SelectItem key={cv.id} value={cv.id}>
                        {cv.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground uppercase tracking-wider text-[10px]">Job Description / Notes</label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Paste the job description here..."
              className="min-h-[300px] text-sm leading-relaxed resize-none bg-secondary/10 border-border focus:bg-background transition-colors p-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground uppercase tracking-wider text-[10px]">Job Description / Notes</label>
            <Textarea 
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Write your personal notes here..."
              className="min-h-[300px] text-sm leading-relaxed resize-none bg-secondary/10 border-border focus:bg-background transition-colors p-4"
            />
          </div>

          <div className="flex justify-end pt-4">
             <Button onClick={handleSubmit} disabled={loading} className="px-8 h-11 font-bold shadow-lg shadow-primary/20">
               {loading ? 'Saving...' : (editMode ? 'Update Application' : 'Add Application')}
               <Save className="ml-2 h-4 w-4" />
             </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest text-[10px]">Pro Tips</h2>
          <ul className="space-y-4">
            {[
              { title: 'AI Match Scoring', text: 'Paste the full description to see how well you match the role.' },
              { title: 'Resume Tailoring', text: 'Add the job details first to get optimized resume suggestions.' },
              { title: 'Stay Organized', text: 'Track every interaction and follow-up in the job details page.' },
            ].map((item, i) => (
              <li key={i} className="space-y-1">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase">
                  <CheckCircle2 className="h-3 w-3" /> {item.title}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-5">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 rounded-2xl p-6 space-y-4 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
          <div className="flex items-center gap-2 relative">
            <Zap className="h-4 w-4 text-primary fill-primary/20" />
            <h2 className="text-xs font-black text-primary uppercase tracking-widest">AI Power-Up</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed relative font-medium">
            Once added, we'll analyze the job description to help you tailor your experience and prepare for interviews.
          </p>
        </div>
      </div>
    </div>
  );
}
