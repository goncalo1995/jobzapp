// app/[locale]/dashboard/jobs/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Building2, Save, ArrowLeft, Link as LinkIcon, Briefcase, Globe, CheckCircle2, Zap, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [cvs, setCvs] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    position: '',
    company_name: '',
    company_website: '',
    job_url: '',
    description: '',
    status: 'Applied',
    cv_id: '',
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

  async function handleCreate() {
    if (!formData.position || !formData.company_name) {
      toast.error('Job title and Company name are required');
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('Not authenticated');
      setLoading(false);
      return;
    }

    try {
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

      const { error: jobError } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          company_id: company.id,
          company_name_denormalized: formData.company_name,
          position: formData.position,
          job_url: formData.job_url || null,
          job_description: formData.description || null,
          status: formData.status as any,
          cv_id: formData.cv_id || null,
          applied_date: formData.status === 'Applied' ? new Date().toISOString() : null,
          last_updated: new Date().toISOString(),
        });

      if (jobError) throw jobError;

      toast.success('Application added!');
      router.push('/dashboard/jobs');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add application');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <Link href="/dashboard/jobs" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors group">
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
            Back to Applications
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-heading font-bold text-foreground">New Application</h1>
            <p className="text-muted-foreground text-sm">Track a new job opportunity.</p>
          </div>
        </div>
        <Button onClick={handleCreate} disabled={loading}>
          {loading ? 'Adding...' : 'Add Application'}
          <Save className="ml-1.5 h-4 w-4" />
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border p-6 rounded-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Job Title <span className="text-destructive">*</span></label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="e.g. Senior Frontend Developer"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company <span className="text-destructive">*</span></label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    placeholder="e.g. Google"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={formData.company_website}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_website: e.target.value }))}
                    placeholder="e.g. google.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Job URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={formData.job_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, job_url: e.target.value }))}
                    placeholder="e.g. linkedin.com/jobs/..."
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Status</label>
                <Select 
                  value={formData.status} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wishlist">Wishlist</SelectItem>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interviewing">Interviewing</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Attached CV</label>
                <Select 
                  value={formData.cv_id} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, cv_id: val }))}
                >
                  <SelectTrigger className="relative pl-10">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select a CV (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {cvs.length === 0 ? (
                      <div className="p-2 text-xs text-muted-foreground text-center">
                        No CVs found. <Link href="/dashboard/cvs/new" className="text-primary hover:underline">Create one</Link>
                      </div>
                    ) : (
                      cvs.map((cv) => (
                        <SelectItem key={cv.id} value={cv.id}>
                          {cv.name} {cv.target_role ? `(${cv.target_role})` : ''}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Job Description / Notes</label>
              <Textarea 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Paste the job description or write your notes here..."
                className="min-h-[250px] text-sm leading-relaxed resize-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border p-5 rounded-xl space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Why track this?</h2>
            <ul className="space-y-3">
              {['AI match scoring', 'Resume tailoring', 'Interview preparation', 'Offer comparison'].map((item, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-muted-foreground items-start">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-card border border-primary/20 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-semibold text-primary">AI Optimizer</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Add the job description to unlock AI match scoring and guided resume tailoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
